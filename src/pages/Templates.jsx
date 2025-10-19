import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext.jsx";
import TemplateCard from "../components/TemplateCard.jsx";

const TEMPLATES = [
  {
    id: "tmpl-intake",
    title: "Client Intake (General)",
    blurb:
      "Basic demographics, contacts, consents. For non-PHI trial/demo use here.",
    to: "/form-builder",
  },
  {
    id: "tmpl-consent",
    title: "Consent to Services",
    blurb: "Informed consent outline for services. Customize in Form Builder.",
    to: "/form-builder",
  },
  {
    id: "tmpl-incident",
    title: "Incident/Unusual Event Report",
    blurb: "Structured incident capture with factors and follow-up fields.",
    to: "/form-builder",
  },
  {
    id: "tmpl-progress",
    title: "Progress Note (SOAP-style)",
    blurb: "Subjective, Objective, Assessment, Plan sectioned note.",
    to: "/form-builder",
  },
  {
    id: "tmpl-audit",
    title: "Internal Audit Checklist",
    blurb: "Simple compliance checklist scaffold for internal review.",
    to: "/form-builder",
  },

  {
    id: "tmpl-tour",
    title: "Tour Form",
    blurb:
      "Client & guardian info, location, contact, birthday, notes, toured by, and priority (High/Med/Low).",
    to: "/tour-form",
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
        Use these as a jumping-off point. Open them and customize as needed.
        Nothing is saved.
      </p>

      <div className="grid grid-2" style={{ marginTop: 12 }}>
        {list.map((t) => (
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
