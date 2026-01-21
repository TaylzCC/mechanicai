"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Question = {
  id: string;
  text: string;
  type: "choice" | "yesno";
  options?: string[];
};

export default function DiagnosePage() {
  const router = useRouter();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [step, setStep] = useState<"input" | "questions">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  async function fetchQuestions() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ make, model, year, symptoms }),
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error || "Failed to get questions.");
      }

      const data = await res.json();
      setCategory(data.category);
      setQuestions(data.questions);
      setStep("questions");
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function generateReport() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ make, model, year, symptoms, answers, category }),
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error || "Failed to generate report.");
      }

      const report = await res.json();
      sessionStorage.setItem("mechanicai_report", JSON.stringify(report));
      router.push("/results");
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Start a diagnosis</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        {step === "input"
          ? "Enter your vehicle and describe the issue."
          : "Answer a few quick questions to narrow it down."}
      </p>

      {step === "input" && (
        <>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr 1fr" }}>
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
            style={{ width: "100%", marginTop: 12, padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />

          <button
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ddd",
              cursor: !make || !model || !year || !symptoms || loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={!make || !model || !year || !symptoms || loading}
            onClick={fetchQuestions}
          >
            {loading ? "Loading..." : "Next: answer questions"}
          </button>
        </>
      )}

      {step === "questions" && (
        <>
          <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12, background: "#fafafa" }}>
            <b>Detected category:</b> {category}
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
            {questions.map((q) => (
              <div key={q.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>{q.text}</div>

                {q.type === "yesno" ? (
                  <select
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", width: "100%" }}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Not sure">Not sure</option>
                  </select>
                ) : (
                  <select
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", width: "100%" }}
                  >
                    <option value="">Select</option>
                    {(q.options || []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd" }}
              onClick={() => setStep("input")}
              disabled={loading}
            >
              ← Back
            </button>

            <button
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onClick={generateReport}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate repair plan"}
            </button>
          </div>
        </>
      )}

      {error && <p style={{ marginTop: 10, color: "crimson" }}>{error}</p>}

      <p style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        Safety note: if you smell fuel, see smoke, have brake/steering issues, or the engine is overheating, don’t drive the car.
      </p>
    </main>
  );
}
