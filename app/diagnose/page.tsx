"use client";

import { useState } from "react";

export default function DiagnosePage() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [symptoms, setSymptoms] = useState("");

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Start a diagnosis</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        Enter your vehicle and describe the issue.
      </p>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr 1fr" }}>
        <input placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} />
        <input placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
        <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
      </div>

      <textarea
        placeholder="Describe the problem (when it happens, noises, smells, warning lights)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        rows={6}
        style={{ width: "100%", marginTop: 12 }}
      />

      <button
        style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10 }}
        disabled={!make || !model || !year || !symptoms}
        onClick={() => alert("Next step: generate a report")}
      >
        Generate repair plan
      </button>
    </main>
  );
}
