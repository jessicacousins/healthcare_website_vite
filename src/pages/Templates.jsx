import React, { useMemo } from "react";
import { useSession } from "../context/SessionContext.jsx";
import TemplateCard from "../components/TemplateCard.jsx";

const TEMPLATES = [
  {
    id: "tmpl-intake",
    title: "Client Intake (General)",
    blurb:
      "Basic demographics, contacts, consents. For non-PHI trial/demo use here.",
  },
  {
    id: "tmpl-consent",
    title: "Consent to Services",
    blurb: "Informed consent outline for services. Customize in Form Builder.",
  },
  {
    id: "tmpl-incident",
    title: "Incident/Unusual Event Report",
    blurb: "Structured incident capture with factors and follow-up fields.",
  },
  {
    id: "tmpl-progress",
    title: "Progress Note (SOAP-style)",
    blurb: "Subjective, Objective, Assessment, Plan sectioned note.",
  },
  {
    id: "tmpl-audit",
    title: "Internal Audit Checklist",
    blurb: "Simple compliance checklist scaffold for internal review.",
  },
];

export default function Templates() {
  const { searchQuery } = useSession();
  const list = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return TEMPLATES;
    return TEMPLATES.filter(
      (t) =>
        t.title.toLowerCase().includes(q) || t.blurb.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="layout">
      <div className="kicker">Templates</div>
      <div className="h1">Starter Blueprints</div>
      <p className="inline-help">
        Use these as a jumping-off point. Open them in the Form Builder and
        customize.
      </p>

      <div className="grid grid-2" style={{ marginTop: 12 }}>
        {list.map((t) => (
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
