import { NextResponse } from "next/server";

type Input = {
  make: string;
  model: string;
  year: string;
  symptoms: string;
};

type Question = {
  id: string;
  text: string;
  type: "choice" | "yesno";
  options?: string[];
};

function includesAny(text: string, words: string[]) {
  return words.some((w) => text.includes(w));
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

function baseQuestions(): Question[] {
  return [
    {
      id: "when_happens",
      text: "When does it happen most?",
      type: "choice",
      options: ["Only cold", "Only hot", "Both cold and hot", "Not sure"],
    },
    {
      id: "warning_lights",
      text: "Any warning lights on the dash?",
      type: "choice",
      options: ["None", "Check engine", "Battery/charging", "Temp/overheating", "Other / not sure"],
    },
    {
      id: "recent_work",
      text: "Any recent work done on the car (battery, brakes, engine, etc.)?",
      type: "choice",
      options: ["No", "Yes (battery)", "Yes (brakes)", "Yes (engine)", "Yes (other)"],
    },
  ];
}

function categoryQuestions(cat: string): Question[] {
  switch (cat) {
    case "no_start":
      return [
        { id: "crank", text: "When you turn the key, does the engine crank?", type: "choice", options: ["No crank", "Cranks slowly", "Cranks normally", "Not sure"] },
        { id: "clicking", text: "Do you hear clicking when trying to start?", type: "yesno" },
        { id: "jump", text: "Have you tried a jump start?", type: "choice", options: ["Not yet", "Yes — it started", "Yes — no change"] },
      ];
    case "starting_clicking":
      return [
        { id: "click_type", text: "What kind of clicking?", type: "choice", options: ["Rapid clicking", "Single click", "No clicking", "Not sure"] },
        { id: "lights_dim", text: "Do the dash lights dim a lot when starting?", type: "yesno" },
        { id: "battery_age", text: "How old is the battery (roughly)?", type: "choice", options: ["< 2 years", "2–4 years", "4+ years", "Not sure"] },
      ];
    case "check_engine":
      return [
        { id: "cel_flash", text: "Is the check engine light flashing?", type: "yesno" },
        { id: "rough", text: "Is the engine running rough / misfiring?", type: "yesno" },
        { id: "recent_fuel", text: "Did you recently refuel or leave the fuel cap loose?", type: "yesno" },
      ];
    case "overheating":
      return [
        { id: "coolant_low", text: "Is the coolant level low (checked only when cold)?", type: "choice", options: ["Yes", "No", "Haven’t checked"] },
        { id: "fan", text: "Does the radiator fan come on when hot?", type: "choice", options: ["Yes", "No", "Not sure"] },
        { id: "leak", text: "Do you see coolant leaking under the car?", type: "yesno" },
      ];
    case "brakes_noise":
      return [
        { id: "when_brake", text: "When is the noise happening?", type: "choice", options: ["Light braking", "Hard braking", "All the time", "Only when turning"] },
        { id: "feel_safe", text: "Do the brakes feel unsafe or weak?", type: "yesno" },
        { id: "vibration_brake", text: "Do you feel vibration through the pedal when braking?", type: "yesno" },
      ];
    case "vibration":
      return [
        { id: "speed", text: "Does it happen mostly at a certain speed?", type: "choice", options: ["Under 30 mph", "30–50 mph", "50+ mph", "Any speed"] },
        { id: "only_braking", text: "Does it mainly happen when braking?", type: "yesno" },
        { id: "steering_shake", text: "Does the steering wheel shake?", type: "yesno" },
      ];
    default:
      return [
        { id: "noise", text: "Any unusual noise?", type: "choice", options: ["None", "Clicking", "Grinding", "Knocking", "Squeal", "Other"] },
        { id: "smell", text: "Any unusual smell?", type: "choice", options: ["None", "Fuel", "Burning", "Sweet/coolant", "Other"] },
      ];
  }
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Input>;

  const make = (body.make || "").trim();
  const model = (body.model || "").trim();
  const year = (body.year || "").trim();
  const symptoms = (body.symptoms || "").trim();

  if (!make || !model || !year || !symptoms) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const s = symptoms.toLowerCase();
  const category = pickCategory(s);

  const questions = [...baseQuestions(), ...categoryQuestions(category)];

  return NextResponse.json({ category, questions });
}
