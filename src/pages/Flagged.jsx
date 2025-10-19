import React from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext.jsx";
import TemplateCard from "../components/TemplateCard.jsx";

const ALL = {
  "tmpl-intake": {
    title: "Client Intake (General)",
    blurb: "Basic demographics, contacts, consents.",
    to: "/form-builder",
  },
  "tmpl-consent": {
    title: "Consent to Services",
    blurb: "Informed consent outline.",
    to: "/form-builder",
  },
  "tmpl-incident": {
    title: "Incident/Unusual Event Report",
    blurb: "Incident capture with follow-up.",
    to: "/form-builder",
  },
  "tmpl-progress": {
    title: "Progress Note (SOAP-style)",
    blurb: "SOAP sectioned note.",
    to: "/form-builder",
  },
  "tmpl-audit": {
    title: "Internal Audit Checklist",
    blurb: "Compliance checklist scaffold.",
    to: "/form-builder",
  },

  "tmpl-tour": {
    title: "Tour Form",
    blurb:
      "Client/guardian, location, contacts, birthday, notes, toured by, priority.",
    to: "/tour-form",
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
              <Link className="btn" to={t.to}>
                Open
              </Link>
            }
          />
        ))}
      </div>
    </div>
  );
}
