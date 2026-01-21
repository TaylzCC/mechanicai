import { NextResponse } from "next/server";

type DiagnoseInput = {
  make: string;
  model: string;
  year: string;
  symptoms: string;
};

function includesAny(text: string, words: string[]) {
  return words.some((w) => text.includes(w));
}

function safetyGate(symptomsLower: string) {
  const red = [
    "fuel",
    "petrol",
    "gas smell",
    "smell of fuel",
    "leak",
    "smoke",
    "burning",
    "fire",
    "overheat",
    "overheating",
    "temperature warning",
    "brake",
    "brakes",
    "steering",
    "airbag",
  ];

  const amber = [
    "engine light flashing",
    "check engine flashing",
    "misfire",
    "knocking",
    "grinding",
    "metal",
    "lost power",
    "limp mode",
  ];

  if (includesAny(symptomsLower, red)) {
    return {
      level: "Red" as const,
      note:
        "Potential safety issue detected. Avoid driving until inspected. If you smell fuel, see smoke, have brake/steering problems, or the engine is overheating, get professional help.",
    };
  }

  if (includesAny(symptomsLower, amber)) {
    return {
      level: "Amber" as const,
      note:
        "Possible risk of damage if driven. Keep trips short and avoid hard driving until diagnosed.",
    };
  }

  return {
    level: "Green" as const,
    note:
      "No obvious safety red flags detected from the description, but always use caution when working on vehicles.",
  };
}

function pickCategory(symptomsLower: string) {
  if (includesAny(symptomsLower, ["won't start", "wont start", "no start", "not starting"])) return "no_start";
  if (includesAny(symptomsLower, ["clicking", "click", "cranks slowly", "slow crank"])) return "starting_clicking";
  if (includesAny(symptomsLower, ["overheat", "overheating", "coolant", "temperature"])) return "overheating";
  if (includesAny(symptomsLower, ["brake", "brakes", "squeal", "grinding"])) return "brakes_noise";
  if (includesAny(symptomsLower, ["engine light", "check engine", "cel"])) return "check_engine";
  if (includesAny(symptomsLower, ["shaking", "vibration", "vibrating"])) return "vibration";
  if (includesAny(symptomsLower, ["stall", "stalls", "stalling"])) return "stalling";
  if (includesAny(symptomsLower, ["misfire", "rough idle", "rough", "judder"])) return "misfire_rough";
  if (includesAny(symptomsLower, ["battery", "alternator", "charging", "keeps dying"])) return "charging";
  return "generic";
}

// IMPORTANT: This function returns ONLY the dynamic diagnosis fields.
// Safety is handled separately by safetyGate(), so we don't include it here.
function buildReport(symptomsLower: string): {
  category: string;
  confidence: "Low" | "Medium" | "High";
  diyValue: string;
  likelyCauses: string[];
  cheapestFirstSteps: string[];
  stopAndGetHelpIf: string[];
} {
  const cat = pickCategory(symptomsLower);

  // Default (generic) report
  let confidence: "Low" | "Medium" | "High" = "Low";
  let diyValue = "6/10";
  let likelyCauses = [
    "Loose or damaged hose/connector (visual inspection needed)",
    "Sensor reading issue (needs scan tool to confirm)",
    "Wear-and-tear part failing (belt, battery, plugs, etc.)",
  ];
  let cheapestFirstSteps = [
    "Write down exactly when it happens (cold/hot, speed, turning, braking).",
    "Look for obvious issues: leaks under the car, loose connectors, cracked hoses, broken belts.",
    "Check fluid levels (oil, coolant, brake fluid) before driving further.",
    "If a warning light is on, read the OBD2 codes (even a cheap scanner helps).",
  ];

  if (cat === "no_start") {
    confidence = "Medium";
    diyValue = "8/10";
    likelyCauses = [
      "Battery discharged or faulty",
      "Loose/corroded battery terminals",
      "Starter motor/relay issue",
      "Immobiliser/key issue (less common)",
    ];
    cheapestFirstSteps = [
      "Check dashboard lights: are they dim or normal?",
      "Inspect battery terminals for looseness/corrosion. Tighten/clean.",
      "Try a jump start. If it starts, battery/charging is likely.",
      "If it cranks strongly but won’t fire, listen for fuel pump prime and check for spark (carefully).",
    ];
  }

  if (cat === "starting_clicking") {
    confidence = "Medium";
    diyValue = "8/10";
    likelyCauses = [
      "Weak battery (most common with clicking)",
      "Bad battery connection/ground strap",
      "Starter solenoid or starter motor failing",
    ];
    cheapestFirstSteps = [
      "If you hear rapid clicking: try jump start first.",
      "Check battery terminals and the ground strap to chassis/engine.",
      "If you have a multimeter: battery should be ~12.4–12.7V engine off.",
      "If it starts with a jump but dies later, test alternator charging (~13.8–14.5V running).",
    ];
  }

  if (cat === "check_engine") {
    confidence = "Low";
    diyValue = "7/10";
    likelyCauses = [
      "Loose fuel cap / evap leak (common)",
      "Misfire (plugs/coils), especially if rough running",
      "Sensor issue (O2, MAF/MAP) or vacuum leak",
    ];
    cheapestFirstSteps = [
      "If the check engine light is FLASHING, stop driving (misfire can damage the catalytic converter).",
      "Tighten the fuel cap and drive a few trips to see if it clears (if no other symptoms).",
      "Read the OBD2 code(s). The code is the fastest way to avoid guessing.",
      "If rough idle/misfire: inspect plugs/coils, and listen for vacuum leak hiss.",
    ];
  }

  if (cat === "overheating") {
    confidence = "Medium";
    diyValue = "5/10";
    likelyCauses = [
      "Coolant leak (hose, radiator, water pump)",
      "Thermostat stuck closed",
      "Radiator fan not running",
      "Low coolant / air in system",
    ];
    cheapestFirstSteps = [
      "Do NOT open the coolant cap when hot.",
      "Check coolant level only when the engine is cold.",
      "Look for leaks under the car and wet hoses/radiator area.",
      "Check if radiator fan comes on when hot (carefully, keep hands clear).",
      "If coolant is low, top up correctly and monitor — but persistent overheating needs proper diagnosis.",
    ];
  }

  if (cat === "brakes_noise") {
    confidence = "Medium";
    diyValue = "6/10";
    likelyCauses = [
      "Worn brake pads (squeal indicator)",
      "Warped discs/rotors (vibration when braking)",
      "Stuck caliper or slide pins",
    ];
    cheapestFirstSteps = [
      "If braking feels unsafe, do not drive.",
      "Look through the wheel spokes: do pads look very thin?",
      "Note when noise happens: light braking vs heavy braking vs turning.",
      "If vibration only when braking at speed, rotors may be warped.",
      "Brakes are safety-critical — if unsure, get a pro inspection.",
    ];
  }

  if (cat === "vibration") {
    confidence = "Low";
    diyValue = "6/10";
    likelyCauses = [
      "Wheel imbalance (common at speed)",
      "Tyre damage/bulge or low tyre pressure",
      "Worn suspension component (bush/joint)",
      "Warped brake rotors (if vibration is during braking)",
    ];
    cheapestFirstSteps = [
      "Check tyre pressures and look for tyre bulges/cuts.",
      "Does it happen only at certain speeds? (often wheel balance)",
      "Does it happen only when braking? (often rotors)",
      "If it changes when turning left/right, suspect wheel bearing or suspension joint.",
    ];
  }

  if (cat === "stalling") {
    confidence = "Low";
    diyValue = "6/10";
    likelyCauses = [
      "Dirty throttle body / idle control issue",
      "Vacuum leak",
      "Fuel delivery issue (filter/pump)",
      "Sensor issue (MAF/MAP/crank) — needs codes",
    ];
    cheapestFirstSteps = [
      "Note when it stalls: idle, stopping, accelerating, after rain, etc.",
      "Check for any warning lights and pull codes if possible.",
      "Listen for hissing (vacuum leak) and inspect intake hoses.",
      "If it stalls only when stopping, throttle body/idle control is a common culprit.",
    ];
  }

  if (cat === "misfire_rough") {
    confidence = "Medium";
    diyValue = "7/10";
    likelyCauses = [
      "Worn spark plugs",
      "Ignition coil pack failure",
      "Vacuum leak / intake leak",
      "Fuel injector issue (less common)",
    ];
    cheapestFirstSteps = [
      "If the check engine light is flashing, stop driving.",
      "Pull OBD2 codes (misfire codes help identify which cylinder).",
      "Inspect plugs and coils; swap coils between cylinders to see if the misfire moves (classic test).",
      "Listen for vacuum leaks and inspect intake hoses.",
    ];
  }

  if (cat === "charging") {
    confidence = "Medium";
    diyValue = "7/10";
    likelyCauses = [
      "Alternator not charging properly",
      "Battery old/weak",
      "Loose drive belt",
      "Bad ground/connection",
    ];
    cheapestFirstSteps = [
      "Check battery terminals and ground strap.",
      "Check belt condition and tension (if accessible).",
      "Multimeter test: ~12.4–12.7V off; ~13.8–14.5V running.",
      "If voltage stays ~12V while running, alternator/charging is likely.",
    ];
  }

  return {
    category: cat,
    confidence,
    diyValue,
    likelyCauses,
    cheapestFirstSteps,
    stopAndGetHelpIf: [
      "You smell fuel or see smoke",
      "The car is overheating",
      "Brakes/steering feel unsafe",
    ],
  };
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<DiagnoseInput>;

  const make = (body.make || "").trim();
  const model = (body.model || "").trim();
  const year = (body.year || "").trim();
  const symptoms = (body.symptoms || "").trim();

  if (!make || !model || !year || !symptoms) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const symptomsLower = symptoms.toLowerCase();
  const safety = safetyGate(symptomsLower);

  const vehicle = `${year} ${make} ${model}`;
  const dynamic = buildReport(symptomsLower);

  return NextResponse.json({
    vehicle,
    safety: safety.level,
    safetyNote: safety.note,
    confidence: dynamic.confidence,
    diyValue: dynamic.diyValue,
    likelyCauses: dynamic.likelyCauses,
    cheapestFirstSteps: dynamic.cheapestFirstSteps,
    stopAndGetHelpIf: dynamic.stopAndGetHelpIf,
    input: { make, model, year, symptoms },
    category: dynamic.category,
  });
}
