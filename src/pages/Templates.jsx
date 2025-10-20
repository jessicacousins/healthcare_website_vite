import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext.jsx";
import TemplateCard from "../components/TemplateCard.jsx";

const TEMPLATES = [
  {
    id: "tmpl-intake",
    title: "Client Intake (General)",
    blurb:
      "Demographics, contacts, insurance/IDs, and core consents. Open in Form Builder and tailor for your program.",
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
    blurb: "Structured incident capture with contributing factors & follow-up.",
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
      "Client & guardian info, location, contact, birthday, notes, toured by, priority — plus PCP history, diagnoses, detailed medications, ADLs, current services, and trauma-informed care.",
    to: "/tour-form",
  },

  {
    id: "tmpl-staff-compliance",
    title: "Staff Credential & Compliance Checker",
    blurb:
      "HR/Managers: track CPR/MAP/CORI, OSHA/HIPAA, licenses, and expirations with an at-a-glance status and PDF export.",
    to: "/staff-compliance",
  },
  {
    id: "tmpl-case-file",
    title: "Case File Readiness Checklist",
    blurb:
      "MassHealth/department-run baseline readiness (identity, clinical, consents, plans, meds, safety, services) with a progress bar and PDF export.",
    to: "/case-file-checklist",
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
