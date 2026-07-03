"use client";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Legend
} from "recharts";

function Chart({ title, children, height = 220 }) {
  return (
    <div className="wf-box" style={{ marginBottom: 20 }}>
      <span className="wf-label">{title}</span>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/survey")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("Couldn't reach the API. Is the server running on :4000?"));
  }, []);

  if (error) return <main className="wf-shell"><div className="wf-callout">{error}</div></main>;
  if (!data) return <main className="wf-shell"><p>Loading survey data…</p></main>;

  return (
    <main className="wf-shell">
      <span className="wf-label">[ Product dashboard — research → decisions → roadmap ]</span>
      <h1 style={{ marginBottom: 4 }}>Scholarly Sweeps: Product Case Study</h1>
      <p style={{ color: "#666" }}>
        Source: primary survey, n={data.respondents} UTD students. Every chart below is
        tied to a product decision, not just a stat.
      </p>

      <div className="wf-section-title">1. Who are we building for?</div>
      <Chart title={`Class year (n=${data.respondents})`}>
        <BarChart data={data.classYear}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis fontSize={12} unit="%" />
          <Tooltip />
          <Bar dataKey="value" fill="#5B9BD8" />
        </BarChart>
      </Chart>
      <div className="wf-callout">
        <strong>Decision:</strong> 89.7% of interested respondents are freshmen. Marketing
        (parent group chats, welcome-week tabling) and onboarding copy target freshmen
        specifically, not "all students."
      </div>

      <div className="wf-section-title">2. Why would they buy?</div>
      <Chart title="Reasons to hire a cleaning service">
        <BarChart data={data.reasonsToHire} layout="vertical" margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit="%" fontSize={12} />
          <YAxis type="category" dataKey="label" width={180} fontSize={11} />
          <Tooltip />
          <Bar dataKey="value" fill="#5B9BD8" />
        </BarChart>
      </Chart>
      <div className="wf-callout">
        <strong>Decision:</strong> "lack of time" (47.3%) beats "better quality clean" (32.2%)
        — the landing page hero leads with time saved, not cleanliness quality.
      </div>

      <div className="wf-section-title">3. What can they actually pay?</div>
      <Chart title={`Willingness to pay $25/mo, 1-10 scale (n=${data.pricingWillingness.responses})`}>
        <BarChart data={data.pricingWillingness.distribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="score" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Bar dataKey="count" fill="#5B9BD8" />
        </BarChart>
      </Chart>
      <div className="wf-callout">
        <strong>Finding:</strong> Responses cluster at both extremes (1 and 5-10) — a split
        market. Open-ended feedback said explicitly: "{data.pricingWillingness.customerFeedback}"
        <br />
        <strong>Decision:</strong> keep $25/mo as the anchor "Standard Clean" price (matches
        original research), but add a discounted promo tier for price-sensitive students
        instead of lowering the base price — protects margin while addressing the feedback.
      </div>

      <div className="wf-section-title">4. What should the roadmap prioritize next?</div>
      <Chart title="Add-on demand (% of students who want it)">
        <BarChart data={data.addonDemand} layout="vertical" margin={{ left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit="%" fontSize={12} />
          <YAxis type="category" dataKey="label" width={140} fontSize={11} />
          <Tooltip />
          <Bar dataKey="value" fill="#5B9BD8" />
        </BarChart>
      </Chart>
      <div className="wf-callout">
        <strong>Decision:</strong> Laundry service (61% demand) is the top add-on, and it's
        shown only after the "included in your clean" list — framed as an upsell, not a gap
        in the base service. Carpet cleaning and eco-friendly options (2.4% each) are cut
        from the roadmap entirely.
      </div>

      <div className="wf-section-title">5. How do we compare to competitors?</div>
      <div className="wf-box">
        <span className="wf-label">Competitor pricing (North Texas Cowboy Cleaners)</span>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 8 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th style={{ padding: "6px 0" }}>Service</th>
              <th>Price range</th>
            </tr>
          </thead>
          <tbody>
            {data.competitorPricing.map((c) => (
              <tr key={c.service} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "6px 0" }}>{c.service}</td>
                <td>{c.low === c.high ? `$${c.low}` : `$${c.low}–$${c.high}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="wf-callout">
        <strong>Decision:</strong> Competitor weekly cleaning starts at $115+tax for a full
        apartment; our $25-35/mo per-room model is priced for a single student, not a whole
        unit — the point of difference is affordability through a narrower unit of service,
        not a discount on the same offering.
      </div>

      <div className="wf-section-title">6. Twelve-month financial trend (original model)</div>
      <Chart title="Revenue vs. profit by month" height={260}>
        <LineChart data={data.monthlyFinancials}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#8FBFE0" strokeWidth={2} />
          <Line type="monotone" dataKey="profit" stroke="#3574A8" strokeWidth={2} />
        </LineChart>
      </Chart>
      <div className="wf-callout">
        <strong>Finding:</strong> revenue is highly seasonal (move-in/move-out spikes in
        Aug/Feb/Apr, troughs in Jan/summer).
        <br />
        <strong>Decision:</strong> roadmap prioritizes a subscription add-on (laundry) that
        generates recurring revenue in the off-season, rather than only one-time deep cleans.
      </div>

      <div className="wf-section-title">Prioritized roadmap (next 2 quarters)</div>
      <div className="wf-grid-3">
        <div className="wf-card tint-mint">
          <span className="wf-label">Now</span>
          <strong>Launch Standard + laundry add-on</strong>
          <p style={{ fontSize: 13 }}>Highest-demand add-on (61%); directly targets recurring off-season revenue.</p>
        </div>
        <div className="wf-card tint-lavender">
          <span className="wf-label">Next</span>
          <strong>Promo pricing tier for price-sensitive segment</strong>
          <p style={{ fontSize: 13 }}>Addresses "lower your prices" feedback without cutting the anchor price.</p>
        </div>
        <div className="wf-card tint-peach">
          <span className="wf-label">Later</span>
          <strong>University housing partnership</strong>
          <p style={{ fontSize: 13 }}>Distribution channel to freshmen at move-in, the highest-intent moment.</p>
        </div>
      </div>
    </main>
  );
}
