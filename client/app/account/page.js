"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/bookings/mine")
        .then((r) => r.json())
        .then(setBookings)
        .finally(() => setLoadingBookings(false));
    }
  }, [user]);

  if (loading || !user) return <main className="wf-shell"><p>Loading…</p></main>;

  return (
    <main className="wf-shell">
      <span className="wf-label">[ My account ]</span>
      <div className="wf-box" style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 32 }}>
        <div className="wf-avatar" style={{ width: 56, height: 56, fontSize: 18 }}>
          {user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
        </div>
        <div>
          <h1 style={{ fontSize: 22 }}>{user.name}</h1>
          <p style={{ color: "var(--ss-muted)", fontSize: 14, margin: 0 }}>{user.email}</p>
        </div>
      </div>

      <div className="wf-section-title">Your bookings</div>
      {loadingBookings ? (
        <p style={{ color: "var(--ss-muted)" }}>Loading bookings…</p>
      ) : bookings.length === 0 ? (
        <div className="wf-callout">
          You haven't booked a cleaning yet. Head to <a href="/book" style={{ fontWeight: 600 }}>Book a clean</a> to try it.
        </div>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="wf-card" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <strong>{b.packageId}</strong>
                <p style={{ fontSize: 13.5, color: "var(--ss-muted)", margin: "4px 0" }}>{b.address}</p>
                <p style={{ fontSize: 13.5, margin: 0 }}>{b.date} at {b.timeSlot}</p>
              </div>
              <span className="wf-label" style={{ marginBottom: 0 }}>#{b.id}</span>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
