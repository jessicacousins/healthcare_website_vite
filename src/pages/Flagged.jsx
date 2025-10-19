import React from "react";
import { useSession } from "../context/SessionContext.jsx";
import TemplateCard from "../components/TemplateCard.jsx";

const ALL = {
  "tmpl-intake": {
    title: "Client Intake (General)",
    blurb: "Basic demographics, contacts, consents.",
  },
  "tmpl-consent": {
    title: "Consent to Services",
    blurb: "Informed consent outline.",
  },
  "tmpl-incident": {
    title: "Incident/Unusual Event Report",
    blurb: "Incident capture with follow-up.",
  },
  "tmpl-progress": {
    title: "Progress Note (SOAP-style)",
    blurb: "SOAP sectioned note.",
  },
  "tmpl-audit": {
    title: "Internal Audit Checklist",
    blurb: "Compliance checklist scaffold.",
  },
};

export default function Flagged() {
  const { flagged } = useSession();
  const items = Array.from(flagged)
    .map((id) => ({ id, ...ALL[id] }))
    .filter(Boolean);

  return (
    <div className="layout">
      <div className="kicker">Quick Access</div>
      <div className="h1">Flagged Items</div>
      {!items.length && (
        <p className="inline-help">
          Nothing flagged yet. Visit Templates and click “Flag”.
        </p>
      )}
      <div className="grid grid-2" style={{ marginTop: 12 }}>
        {items.map((t) => (
          <TemplateCard
            key={t.id}
            id={t.id}
            title={t.title}
            blurb={t.blurb}
            actions={
              <a className="btn" href="/form-builder">
                Open in Form Builder
              </a>
            }
          />
        ))}
      </div>
    </div>
  );
}
