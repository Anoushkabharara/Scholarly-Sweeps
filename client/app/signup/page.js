"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(name, email, password);
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
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Create your account</h1>
        <p style={{ color: "var(--ss-muted)", fontSize: 14, marginBottom: 24 }}>
          Save your info for faster checkout and see your booking history.
        </p>
        {error && <div className="wf-callout">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="wf-field">
            <label>Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Comet" />
          </div>
          <div className="wf-field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane.comet@utdallas.edu" />
          </div>
          <div className="wf-field">
            <label>Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
          </div>
          <button className="wf-btn" style={{ width: "100%" }} disabled={submitting} type="submit">
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p style={{ fontSize: 13.5, marginTop: 18, color: "var(--ss-muted)" }}>
          Already have an account? <Link href="/login" style={{ color: "var(--ss-primary-dark)", fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </main>
  );
}
