"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="wf-auth-shell">
      <div className="wf-box">
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Welcome back</h1>
        <p style={{ color: "var(--ss-muted)", fontSize: 14, marginBottom: 24 }}>
          Log in to see your bookings and book faster next time.
        </p>
        {error && <div className="wf-callout">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="wf-field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane.comet@utdallas.edu" />
          </div>
          <div className="wf-field">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="wf-btn" style={{ width: "100%" }} disabled={submitting} type="submit">
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p style={{ fontSize: 13.5, marginTop: 18, color: "var(--ss-muted)" }}>
          New here? <Link href="/signup" style={{ color: "var(--ss-primary-dark)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </main>
  );
}
