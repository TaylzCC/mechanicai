"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DiagnosePage() {
  const router = useRouter();

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

      <div
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        <input
          placeholder="Make (e.g. Ford)"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
        <input
          placeholder="Model (e.g. Fiesta)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
        <input
          placeholder="Year (e.g. 2012)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
      </div>

      <textarea
        placeholder="Describe the problem (when it happens, noises, smells, warning lights)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        rows={6}
        style={{
          width: "100%",
          marginTop: 12,
          padding: 10,
          borderRadius: 10,
          border: "1px solid #ddd",
        }}
      />

      <button
        style={{
          marginTop: 12,
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #ddd",
          cursor: make && model && year && symptoms ? "pointer" : "not-allowed",
        }}
        disabled={!make || !model || !year || !symptoms}
        onClick={() => {
          const q = new URLSearchParams({
            make,
            model,
            year,
            symptoms,
          }).toString();
          router.push(`/results?${q}`);
        }}
      >
        Generate repair plan
      </button>

      <p style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        Safety note: if you smell fuel, see smoke, have brake/steering issues, or
        the engine is overheating, don’t drive the car.
      </p>
    </main>
  );
}
