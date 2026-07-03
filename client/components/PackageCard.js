"use client";
import { useState } from "react";

export default function PackageCard({ label, name, description, price, included }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="wf-card">
      <span className="wf-label">{label}</span>
      <strong style={{ fontSize: 18 }}>{name}</strong>
      <p style={{ fontSize: 14, color: "var(--ss-muted)", margin: "6px 0" }}>{description}</p>
      <p style={{ fontSize: 20, fontFamily: "Fraunces, serif", margin: "0 0 14px" }}>{price}</p>

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          font: "inherit",
          fontWeight: 600,
          fontSize: 13.5,
          color: "var(--ss-primary-dark)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6
        }}
      >
        {open ? "Hide what's included" : "See what's included"}
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", fontSize: 11 }}>▾</span>
      </button>

      {open && (
        <ul style={{ margin: "12px 0 0", paddingLeft: 18, fontSize: 13.5, color: "var(--ss-ink)" }}>
          {included.map((item) => (
            <li key={item} style={{ marginBottom: 4 }}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
