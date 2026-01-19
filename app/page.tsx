import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>MechanicAI</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        Describe your car problem and get a safe, cheapest-first diagnostic plan.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          href="/diagnose"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 10,
            background: "black",
            color: "white",
            textDecoration: "none",
          }}
        >
          Start diagnosis
        </Link>

        <Link
          href="/results?make=Ford&model=Fiesta&year=2012&symptoms=Car%20won%27t%20start%2C%20clicking%20noise"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            color: "black",
            textDecoration: "none",
          }}
        >
          View sample report
        </Link>
      </div>

      <ul style={{ marginTop: 22, lineHeight: 1.8 }}>
        <li>
          <b>Cheapest-first steps</b> — check the free stuff before buying parts.
        </li>
        <li>
          <b>Safety warnings</b> — clear “stop driving” guidance.
        </li>
        <li>
          <b>DIY value score</b> — tells you if it’s worth doing yourself.
        </li>
      </ul>
    </main>
  );
}
