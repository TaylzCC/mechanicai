"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

type Report = {
  vehicle: string;
  safety: string;
  safetyNote?: string;
  confidence: string;
  diyValue: string;
  likelyCauses: string[];
  cheapestFirstSteps: string[];
  stopAndGetHelpIf: string[];
  input: {
    make: string;
    model: string;
    year: string;
    symptoms: string;
  };
};

export default function ResultsPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("mechanicai_report");
    if (!raw) return;
    try {
      setReport(JSON.parse(raw));
    } catch {
      setReport(null);
    }
  }, []);

  if (!report) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Repair Plan</h1>
        <p style={{ opacity: 0.8 }}>
          No report found. Start a new diagnosis.
        </p>
        <Link href="/diagnose">← Go to diagnose</Link>
      </main>
    );
  }

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
          <p style={{ opacity: 0.8, margin: 0 }}>{report.vehicle}</p>
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

      {report.safetyNote && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          <b>Safety note:</b> {report.safetyNote}
        </div>
      )}

      <Section title="Your description">
        <p style={{ margin: 0, whiteSpace: "pre-wrap", opacity: 0.9 }}>
          {report.input.symptoms}
        </p>
      </Section>

      <Section title="Most likely causes (ranked)">
        <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          {report.likelyCauses.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </Section>

      <Section title="Cheapest-first diagnostic steps">
        <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          {report.cheapestFirstSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </Section>

      <Section title="Stop & get help if…">
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          {report.stopAndGetHelpIf.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
