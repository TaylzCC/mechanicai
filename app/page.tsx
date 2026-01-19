import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>MechanicAI</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        Describe your car problem and get a safe, cheapest-first diagnostic plan.
      </p>

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
    </main>
  );
}
