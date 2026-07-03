"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../components/AuthContext";

const STEPS = ["Location", "Cleaning type", "Choose a cleaner", "Supplies & notes", "Add-ons", "Schedule", "Checkout", "Confirmed"];
const TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

function upcomingDays(count = 14) {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function BookPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [cleaners, setCleaners] = useState([]);

  const [address, setAddress] = useState("");
  const [packageId, setPackageId] = useState("");
  const [cleanerId, setCleanerId] = useState("");
  const [suppliesProvided, setSuppliesProvided] = useState(null);
  const [notes, setNotes] = useState("");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName((n) => n || user.name);
      setEmail((e) => e || user.email);
    }
  }, [user]);

  useEffect(() => {
    Promise.all([
      fetch("/api/packages").then((r) => r.json()),
      fetch("/api/addons").then((r) => r.json()),
      fetch("/api/cleaners").then((r) => r.json())
    ])
      .then(([p, a, c]) => {
        setPackages(p);
        setAddons(a);
        setCleaners(c);
      })
      .catch(() => setError("Couldn't reach the API. Is the server running on :4000?"));
  }, []);

  const selectedPackage = packages.find((p) => p.id === packageId);
  const selectedCleaner = cleaners.find((c) => c.id === cleanerId);

  const addonsTotal = useMemo(() => {
    return selectedAddons.reduce((sum, id) => {
      const a = addons.find((x) => x.id === id);
      return sum + (a ? a.price : 0);
    }, 0);
  }, [selectedAddons, addons]);

  const supplyFee = suppliesProvided ? 0 : 5;
  const total = (selectedPackage ? selectedPackage.price : 0) + supplyFee + addonsTotal;

  function toggleAddon(id) {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submitBooking() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          packageId,
          cleanerId,
          suppliesProvided,
          notes,
          addonIds: selectedAddons,
          date,
          timeSlot,
          name,
          phone,
          email
        })
      });
      if (!res.ok) throw new Error("Booking failed");
      const data = await res.json();
      setConfirmation(data);
      setStep(7);
    } catch (e) {
      setError("Something went wrong submitting the booking. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="wf-shell">
      <span className="wf-label">[ Booking flow — {STEPS[step]} ]</span>
      <div className="wf-steps">
        {STEPS.map((s, i) => (
          <span key={s} className={i === step ? "active" : i < step ? "done" : ""}>
            {i + 1}. {s}
            {i < STEPS.length - 1 ? "  →  " : ""}
          </span>
        ))}
      </div>

      {error && <div className="wf-callout">{error}</div>}

      {step === 0 && (
        <div className="wf-box">
          <div className="wf-field">
            <label>Dorm address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Residence Hall North, Room 204"
            />
          </div>
          <button className="wf-btn" disabled={!address.trim()} onClick={next}>
            Continue
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="wf-grid-3">
            {packages.map((p) => (
              <div
                key={p.id}
                className={`wf-card selectable ${packageId === p.id ? "selected" : ""}`}
                onClick={() => setPackageId(p.id)}
              >
                <span className="wf-label">Package</span>
                <strong>{p.name}</strong>
                <p style={{ fontSize: 13, color: "var(--ss-muted)" }}>{p.description}</p>
                <p><strong>${p.price}</strong> {p.unit}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button className="wf-btn secondary" onClick={back}>Back</button>
            <button className="wf-btn" disabled={!packageId} onClick={next}>Continue</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p style={{ fontSize: 13, color: "var(--ss-muted)", marginBottom: 12 }}>
            Cleaners near {address || "your address"}
          </p>
          {cleaners.map((c) => (
            <div
              key={c.id}
              className={`wf-card selectable ${cleanerId === c.id ? "selected" : ""}`}
              style={{ display: "flex", gap: 12, marginBottom: 10 }}
              onClick={() => setCleanerId(c.id)}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: "50%", background: "var(--tint-lavender)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13, flexShrink: 0
                }}
              >
                {c.name.split(" ").map((w) => w[0]).join("")}
              </div>
              <div>
                <strong>{c.name}</strong>
                <p style={{ fontSize: 13, margin: "2px 0" }}>
                  {"★".repeat(Math.round(c.rating))}{"☆".repeat(5 - Math.round(c.rating))}{" "}
                  <span style={{ color: "var(--ss-muted)" }}>{c.rating.toFixed(1)} ({c.reviews} reviews)</span>
                </p>
                <p style={{ fontSize: 13, color: "var(--ss-muted)", margin: "2px 0" }}>{c.tagline}</p>
                <p style={{ fontSize: 12, color: "var(--ss-muted)", margin: 0 }}>
                  {c.suppliesIncluded ? "Brings own supplies" : "Asks you to provide supplies"}
                </p>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button className="wf-btn secondary" onClick={back}>Back</button>
            <button className="wf-btn" disabled={!cleanerId} onClick={next}>Continue</button>
          </div>
        </div>
      )}

      {step === 3 && selectedCleaner && (
        <div>
          <div className="wf-box">
            <span className="wf-label">Supplies</span>
            <p style={{ fontSize: 13, color: "var(--ss-muted)" }}>
              {selectedCleaner.name}{" "}
              {selectedCleaner.suppliesIncluded
                ? "can bring their own supplies at no extra cost."
                : "prefers you provide supplies. If you'd rather they bring supplies, we add a $5 fee."}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="wf-btn secondary"
                style={{ flex: 1, background: suppliesProvided === true ? "var(--tint-lavender)" : "#fff" }}
                onClick={() => setSuppliesProvided(true)}
              >
                I will provide supplies
              </button>
              <button
                className="wf-btn secondary"
                style={{ flex: 1, background: suppliesProvided === false ? "var(--tint-lavender)" : "#fff" }}
                onClick={() => setSuppliesProvided(false)}
              >
                Cleaner brings supplies (+$5)
              </button>
            </div>
          </div>
          <div className="wf-box" style={{ marginTop: 16 }}>
            <span className="wf-label">Notes for your cleaner (optional)</span>
            <textarea
              rows={3}
              style={{ width: "100%", padding: 9, border: "1px solid var(--ss-border)", borderRadius: 3 }}
              placeholder="e.g. Key is with front desk, please knock first"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button className="wf-btn secondary" onClick={back}>Back</button>
            <button className="wf-btn" disabled={suppliesProvided === null} onClick={next}>Continue</button>
          </div>
        </div>
      )}

      {step === 4 && selectedPackage && (
        <div>
          <div className="wf-box">
            <span className="wf-label">Included in your {selectedPackage.name}</span>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: "var(--ss-ink)" }}>
              {selectedPackage.included.map((i) => <li key={i} style={{ marginBottom: 4 }}>{i}</li>)}
            </ul>
          </div>
          <p style={{ fontSize: 13, color: "var(--ss-muted)", margin: "16px 0 10px" }}>
            Want anything extra? Ranked by how many students ask for it.
          </p>
          {addons
            .slice()
            .sort((a, b) => b.demandPct - a.demandPct)
            .map((a) => (
              <div key={a.id} className="wf-checkbox-row">
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(a.id)}
                    onChange={() => toggleAddon(a.id)}
                  />
                  {a.name} <span style={{ color: "var(--ss-muted)" }}>({a.demandPct}% of students want this)</span>
                </label>
                <span>+${a.price}</span>
              </div>
            ))}
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button className="wf-btn secondary" onClick={back}>Back</button>
            <button className="wf-btn" onClick={next}>Continue</button>
          </div>
        </div>
      )}

      {step === 5 && selectedCleaner && (
        <div>
          <div className="wf-box">
            <span className="wf-label">Choose a date — showing {selectedCleaner.name}&apos;s availability</span>
            <div className="wf-slot-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
              {upcomingDays().map((d) => {
                const iso = d.toISOString().slice(0, 10);
                const available = selectedCleaner.availableDays.includes(d.getDay());
                const selected = date === iso;
                return (
                  <div
                    key={iso}
                    onClick={() => available && (setDate(iso), setTimeSlot(""))}
                    className="wf-slot"
                    style={{
                      cursor: available ? "pointer" : "not-allowed",
                      opacity: available ? 1 : 0.4,
                      background: selected ? "var(--ss-primary)" : "#fff",
                      color: selected ? "#fff" : "var(--ss-ink)"
                    }}
                  >
                    <div style={{ fontSize: 10 }}>{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
                    <div>{d.getDate()}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {date && (
            <div style={{ marginTop: 16 }}>
              <span className="wf-label">Time slot</span>
              <div className="wf-slot-grid">
                {TIME_SLOTS.map((t) => (
                  <div
                    key={t}
                    className={`wf-slot ${timeSlot === t ? "selected" : ""}`}
                    onClick={() => setTimeSlot(t)}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button className="wf-btn secondary" onClick={back}>Back</button>
            <button className="wf-btn" disabled={!(date && timeSlot)} onClick={next}>Continue</button>
          </div>
        </div>
      )}

      {step === 6 && selectedPackage && selectedCleaner && (
        <div>
          <div className="wf-box">
            <span className="wf-label">Your contact info</span>
            {user && (
              <div className="wf-callout" style={{ marginTop: 0 }}>
                Prefilled from your account ({user.email}). Feel free to edit.
              </div>
            )}
            <div className="wf-field">
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Comet" />
            </div>
            <div className="wf-field">
              <label>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(214) 555-0134" />
            </div>
            <div className="wf-field">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane.comet@utdallas.edu" />
            </div>
          </div>

          <div className="wf-section-title">Order summary</div>
          <div className="wf-box">
            <div className="wf-summary-row"><span>Address</span><span>{address}</span></div>
            <div className="wf-summary-row"><span>Cleaner</span><span>{selectedCleaner.name}</span></div>
            <div className="wf-summary-row"><span>Package</span><span>{selectedPackage.name}</span></div>
            <div className="wf-summary-row">
              <span>Add-ons</span>
              <span>{selectedAddons.length ? selectedAddons.map((id) => addons.find((a) => a.id === id)?.name).join(", ") : "None"}</span>
            </div>
            <div className="wf-summary-row"><span>Date / time</span><span>{date} · {timeSlot}</span></div>
            <div className="wf-summary-row"><span>Supplies</span><span>{suppliesProvided ? "You provide" : "Cleaner provides (+$5)"}</span></div>
            <div className="wf-summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <div className="wf-callout">
            Demo checkout — clicking confirm will not charge a card or dispatch a cleaner.
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button className="wf-btn secondary" onClick={back}>Back</button>
            <button className="wf-btn" disabled={submitting || !(name && phone && email)} onClick={submitBooking}>
              {submitting ? "Confirming…" : "Confirm booking"}
            </button>
          </div>
        </div>
      )}

      {step === 7 && confirmation && selectedPackage && selectedCleaner && (
        <div className="wf-box" style={{ textAlign: "center", padding: 40 }}>
          <span className="wf-label">Confirmation</span>
          <h2>Booking confirmed ✓</h2>
          <p>Confirmation code: <strong>{confirmation.id}</strong></p>
          <p style={{ color: "var(--ss-muted)" }}>{confirmation.status}</p>
          <p>{selectedCleaner.name} · {selectedPackage.name} · {date} at {timeSlot}</p>
          <p><strong>Total: ${total.toFixed(2)}</strong> (demo — not charged)</p>
        </div>
      )}
    </main>
  );
}
