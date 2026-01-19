"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

function Badge({ text }: { text: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #ddd",
        fontSize: 12,
      }}
    >
      {text}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: 18,
        padding: 16,
        border: "1px solid #eee",
        borderRadius: 14,
      }}
    >
      <h2 style={{ fontSize: 16, marginBottom: 10 }}>{title}</h2>
      {children}
    </div>
  );
}

export default function ResultsPage() {
  const sp = useSearchParams();

  const make = sp.get("make") || "";
  const model = sp.get("model") || "";
  const year = sp.get("year") || "";
  const symptoms = sp.get("symptoms") || "";

  // Fake “report” for now. We'll replace this with real AI soon.
  const report = {
    safety: "Amber",
    confidence: "Medium",
    diyValue: "7/10",
    causes: [
      "Weak battery or poor connection at terminals",
      "Failing starter motor / starter relay",
      "Alternator not charging (if battery keeps dying)",
    ],
    steps: [
      "Check battery terminals for looseness/corrosion. Tighten/clean if needed.",
      "Try a jump start. If it starts, suspect battery/charging.",
      "If you have a multimeter: check battery voltage (12.4–12.7V off; ~13.8–14.5V running).",
      "Listen for single click vs rapid clicking vs cranking — note what happens.",
      "If voltage is good but it won’t crank, starter/relay becomes more likely.",
    ],
    stopIf: [
      "You smell fuel or see smoke",
      "The car is overheating",
      "Brakes/steering feel unsafe",
    ],
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "baseline",
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Repair Plan</h1>
          <p style={{ opacity: 0.8, margin: 0 }}>
            {year} {make} {model}
          </p>
        </div>

        <Link href="/diagnose" style={{ textDecoration: "none", opacity: 0.8 }}>
          ← New diagnosis
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Badge text={`Safety: ${report.safety}`} />
        <Badge text={`Confidence: ${report.confidence}`} />
        <Badge text={`DIY Value: ${report.diyValue}`} />
      </div>

      <Section title="Your description">
        <p style={{ margin: 0, whiteSpace: "pre-wrap", opacity: 0.9 }}>
          {symptoms || "—"}
        </p>
      </Section>

      <Section title="Most likely causes (ranked)">
        <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          {report.causes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </Section>

      <Section title="Cheapest-first diagnostic steps">
        <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          {report.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </Section>

      <Section title="Stop & get help if…">
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          {report.stopIf.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
