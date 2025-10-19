import React from "react";
import FlagButton from "./FlagButton.jsx";

export default function TemplateCard({ id, title, blurb, actions }) {
  return (
    <div className="card">
      <div className="kicker">Template</div>
      <div className="h1">{title}</div>
      <p style={{ color: "var(--muted)" }}>{blurb}</p>
      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}
      >
        {actions}
        <FlagButton id={id} />
      </div>
    </div>
  );
}
