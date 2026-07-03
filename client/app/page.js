import Link from "next/link";
import PackageCard from "../components/PackageCard";

const PACKAGES = [
  {
    label: "Per month",
    name: "Standard Clean",
    description: "Weekly tidy-up.",
    price: "$25",
    included: ["Floors vacuumed and mopped", "Surfaces wiped down", "Trash taken out", "Bathroom wipe-down"]
  },
  {
    label: "One-time",
    name: "Deep Clean",
    description: "One-time thorough clean.",
    price: "$45",
    included: ["Everything in Standard Clean", "Baseboards and vents", "Appliance exteriors", "Full bathroom and kitchen detail"]
  },
  {
    label: "One-time",
    name: "Move-Out Clean",
    description: "End-of-semester deep clean.",
    price: "$55",
    included: ["Everything in Deep Clean", "Move-out inspection checklist", "Closet and cabinet interiors"]
  }
];

export default function Home() {
  return (
    <main className="wf-shell">
      <div className="wf-hero">
        <span className="wf-label">Dorm cleaning, matched to a real person</span>
        <h1>Your dorm, actually clean. Without you doing it.</h1>
        <p>
          Scholarly Sweeps matches you with a nearby, rated cleaner for your dorm
          room on your schedule. 47% of UTD students say lack of time is the #1
          reason they'd hire a cleaning service — this is that service.
        </p>
        <Link href="/book" className="wf-btn">Book a cleaning →</Link>
      </div>

      <div className="wf-section-title">Why students hire us (survey, n=56)</div>
      <div className="wf-grid-3">
        <div className="wf-card tint-lavender">
          <span className="wf-label">Survey finding</span>
          <strong style={{ fontSize: 30, fontFamily: "Fraunces, serif" }}>47.3%</strong>
          <p style={{ margin: "4px 0 0" }}>lack time to clean their own space</p>
        </div>
        <div className="wf-card tint-mint">
          <span className="wf-label">Survey finding</span>
          <strong style={{ fontSize: 30, fontFamily: "Fraunces, serif" }}>32.2%</strong>
          <p style={{ margin: "4px 0 0" }}>want more thorough cleaning</p>
        </div>
        <div className="wf-card tint-peach">
          <span className="wf-label">Starting price</span>
          <strong style={{ fontSize: 30, fontFamily: "Fraunces, serif" }}>$25/mo</strong>
          <p style={{ margin: "4px 0 0" }}>sized to student budgets</p>
        </div>
      </div>

      <div className="wf-section-title">Packages</div>
      <div className="wf-grid-3">
        {PACKAGES.map((p) => (
          <PackageCard key={p.name} {...p} />
        ))}
      </div>

      <div className="wf-section-title">How it works</div>
      <div className="wf-grid-3">
        <div className="wf-card tint-pink">
          <span className="wf-label">1</span>
          <p style={{ margin: 0 }}>Tell us your dorm address and cleaning type.</p>
        </div>
        <div className="wf-card tint-butter">
          <span className="wf-label">2</span>
          <p style={{ margin: 0 }}>Pick a rated cleaner and a time that works for both of you.</p>
        </div>
        <div className="wf-card tint-lavender">
          <span className="wf-label">3</span>
          <p style={{ margin: 0 }}>Confirm — no payment collected in this demo.</p>
        </div>
      </div>

      <div className="wf-section-title">This is a demo</div>
      <div className="wf-callout">
        This is a working prototype built for a product case study. Bookings are
        simulated — no payment is processed and no cleaner is dispatched. See the{" "}
        <Link href="/dashboard" style={{ fontWeight: 600 }}>product dashboard</Link>{" "}
        for the research and decisions behind this design.
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Link href="/book" className="wf-btn">Try the booking flow →</Link>
      </div>
    </main>
  );
}
