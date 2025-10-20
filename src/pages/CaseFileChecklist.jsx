import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

const SECTIONS = [
  {
    key: "identity",
    title: "Identity & Eligibility",
    items: [
      {
        key: "demographics_sheet",
        label: "Demographics sheet (name, DOB, address, phone)",
        required: true,
      },
      {
        key: "photo_id",
        label: "Government photo ID (copy or verified)",
        required: true,
      },
      {
        key: "masshealth_id",
        label: "MassHealth/Insurance ID (copy)",
        required: true,
      },
      {
        key: "eligibility_verification",
        label: "MassHealth eligibility verification (date checked)",
        required: true,
      },
      {
        key: "insurance_card",
        label: "Insurance card (front/back) or policy details",
        required: true,
      },
      {
        key: "guardian_docs",
        label:
          "Guardianship/Power of Attorney/Healthcare Proxy (if applicable)",
        required: true,
      },
    ],
  },
  {
    key: "clinical",
    title: "Clinical History & Providers",
    items: [
      { key: "pcp_contact", label: "PCP name/phone/fax", required: true },
      {
        key: "specialists",
        label: "Current specialists (behavioral, neurology, etc.)",
        required: false,
      },
      {
        key: "medical_history",
        label: "Medical history & active diagnoses",
        required: true,
      },
      { key: "allergies", label: "Allergies & reactions", required: true },
      {
        key: "immunizations",
        label: "Immunizations (as applicable)",
        required: false,
      },
    ],
  },
  {
    key: "consents",
    title: "Consents & Releases",
    items: [
      {
        key: "hipaa_npp",
        label: "HIPAA Notice of Privacy Practices acknowledgment",
        required: true,
      },
      {
        key: "roi_pcp",
        label: "Release of Information to PCP",
        required: true,
      },
      {
        key: "roi_specialists",
        label:
          "Release(s) to specialists/schools/community providers (as needed)",
        required: false,
      },
      {
        key: "part2_sud",
        label: "42 CFR Part 2 consent (if SUD info is involved)",
        required: false,
      },
      {
        key: "consent_care",
        label: "Consent for services/care",
        required: true,
      },
      {
        key: "rights",
        label: "Client rights acknowledgement / grievance policy",
        required: true,
      },
    ],
  },
  {
    key: "plans",
    title: "Plans & Assessments",
    items: [
      {
        key: "person_centered_plan",
        label: "Person-centered plan / ISP / treatment plan",
        required: true,
      },
      {
        key: "functional_assessment",
        label: "Functional assessment / ADL",
        required: true,
      },
      {
        key: "risk_assessment",
        label: "Risk/safety assessment",
        required: true,
      },
      {
        key: "behavior_plan",
        label: "Behavior/positive support plan (if applicable)",
        required: false,
      },
      {
        key: "seizure_protocol",
        label: "Seizure protocol (if applicable)",
        required: false,
      },
      {
        key: "med_admin_protocol",
        label:
          "Medication administration protocol / MAR template (if applicable)",
        required: false,
      },
    ],
  },
  {
    key: "meds",
    title: "Medications & Health",
    items: [
      {
        key: "med_list",
        label: "Current medication list with dose/route/frequency & prescriber",
        required: true,
      },
      {
        key: "orders",
        label: "Active medication orders / prescriptions",
        required: true,
      },
      { key: "pharmacy", label: "Pharmacy contact", required: false },
      {
        key: "equipment",
        label: "DME/medical equipment orders (if applicable)",
        required: false,
      },
    ],
  },
  {
    key: "safety",
    title: "Safety & Emergency",
    items: [
      {
        key: "emergency_contacts",
        label: "Emergency contacts (2+), relationship & phone",
        required: true,
      },
      {
        key: "crisis_plan",
        label: "Crisis/safety plan with de-escalation steps",
        required: true,
      },
      {
        key: "home_safety",
        label: "Home/environment safety check (if HCBS/community)",
        required: false,
      },
      {
        key: "transport_consent",
        label: "Transportation consent (if applicable)",
        required: false,
      },
    ],
  },
  {
    key: "services",
    title: "Services & Authorization",
    items: [
      {
        key: "service_authorization",
        label: "Service authorization / plan of care authorization",
        required: true,
      },
      {
        key: "schedule",
        label: "Service schedule & provider assignment",
        required: false,
      },
      {
        key: "current_services",
        label: "Current services (PT/OT/SLP/behavioral/day program)",
        required: false,
      },
      {
        key: "transition",
        label: "Transition/discharge planning notes (if applicable)",
        required: false,
      },
    ],
  },
];

function CaseFileChecklist() {
  // Branding
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const onLogoChange = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(r.result.toString());
    r.readAsDataURL(file);
  };

  // State for items
  const [state, setState] = useState(() => {
    const s = {};
    for (const sec of SECTIONS) {
      for (const item of sec.items) {
        s[item.key] = { applicable: true, present: false, date: "", notes: "" };
      }
    }
    return s;
  });

  const setItem = (key, patch) =>
    setState((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const totals = useMemo(() => {
    let totalApplicable = 0;
    let satisfied = 0;
    SECTIONS.forEach((sec) => {
      sec.items.forEach((it) => {
        const v = state[it.key];
        const applicable = v?.applicable !== false; // default true
        if (applicable) {
          totalApplicable += 1;
          if (v?.present) satisfied += 1;
        } else {
          // count N/A as satisfied for readiness
          satisfied += 1;
        }
      });
    });
    const overallTotal = SECTIONS.reduce((a, sec) => a + sec.items.length, 0);
    const percent = overallTotal
      ? Math.round((satisfied / overallTotal) * 100)
      : 0;
    const percentApplicable = totalApplicable
      ? Math.round((satisfied / totalApplicable) * 100)
      : 0;
    return { totalApplicable, satisfied, percent, percentApplicable };
  }, [state]);

  const exportPdf = async () => {
    await downloadElementAsPDF("casefile-preview", "Case_File_Readiness.pdf");
  };

  return (
    <div className="layout">
      <div className="grid grid-2">
        {/* LEFT: Checklist editor */}
        <section className="card">
          <div className="kicker">Tool</div>
          <div className="h1">Case File Readiness Checklist</div>
          <p className="inline-help">
            For Massachusetts-based programs (MassHealth & department-run
            agencies). This is a convenience tool—confirm agency/program
            specifics. Nothing is stored.
          </p>

          {/* Branding */}
          <div className="card" style={{ marginTop: 8 }}>
            <div className="kicker">Branding</div>
            <div className="grid grid-2">
              <div>
                <div className="label">Organization (optional)</div>
                <input
                  className="input"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Company / Program name"
                />
              </div>
              <div>
                <div className="label">Logo (optional)</div>
                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onLogoChange(e.target.files?.[0])}
                />
                {logoSrc && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={logoSrc}
                      alt="Logo preview"
                      style={{
                        maxHeight: 48,
                        objectFit: "contain",
                        background: "#fff",
                        padding: 6,
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Progress</div>
            <div className="h1" style={{ fontSize: 20 }}>
              Overall: {totals.percentApplicable}% (applicable) •{" "}
              {totals.percent}% (incl. N/A)
            </div>
            <div
              aria-label="Overall progress"
              style={{
                height: 10,
                borderRadius: 999,
                background: "rgba(0,0,0,.08)",
                overflow: "hidden",
                marginTop: 8,
              }}
            >
              <div
                style={{
                  width: `${totals.percentApplicable}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #7af2e0, #6ac8ff, #a29bff)",
                }}
              />
            </div>
            <p className="inline-help" style={{ marginTop: 6 }}>
              N/A counts as satisfied for readiness.
            </p>
          </div>

          {/* Sections */}
          {SECTIONS.map((sec) => (
            <div key={sec.key} className="card" style={{ marginTop: 12 }}>
              <div className="kicker">{sec.title}</div>
              <div style={{ display: "grid", gap: 8 }}>
                {sec.items.map((it) => {
                  const v = state[it.key];
                  return (
                    <div key={it.key} className="card" style={{ padding: 10 }}>
                      <div className="grid grid-3">
                        <div style={{ gridColumn: "1 / -1" }}>
                          <strong>{it.label}</strong>{" "}
                          {!it.required && (
                            <span className="inline-help">(as applicable)</span>
                          )}
                        </div>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={v.applicable}
                            onChange={(e) =>
                              setItem(it.key, { applicable: e.target.checked })
                            }
                          />
                          Applicable
                        </label>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={v.present}
                            onChange={(e) =>
                              setItem(it.key, { present: e.target.checked })
                            }
                          />
                          On file
                        </label>
                        <input
                          className="input"
                          type="date"
                          value={v.date}
                          onChange={(e) =>
                            setItem(it.key, { date: e.target.value })
                          }
                          placeholder="Doc date"
                        />
                        <input
                          className="input"
                          style={{ gridColumn: "1 / -1" }}
                          placeholder="Notes / location (paper, EHR, etc.)"
                          value={v.notes}
                          onChange={(e) =>
                            setItem(it.key, { notes: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button className="btn ok" onClick={exportPdf}>
              Download PDF
            </button>
            <span className="inline-help">
              Client-side only. Use your official system for storage.
            </span>
          </div>
        </section>

        {/* RIGHT: PDF Preview */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">Case File — Preview</div>

          <div className="preview-surface" id="casefile-preview">
            <header
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 10,
              }}
            >
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt="Organization logo"
                  style={{ maxHeight: 56, maxWidth: 200, objectFit: "contain" }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0 }}>Case File Readiness Checklist</h2>
                {orgName && (
                  <div style={{ color: "#566", fontSize: 12 }}>{orgName}</div>
                )}
              </div>
              <span className="file-pill">Generated Preview</span>
            </header>

            {/* Progress summary */}
            <div style={{ margin: "6px 0 10px" }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#334",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                }}
              >
                Completion
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    borderRadius: 999,
                    background: "rgba(0,0,0,.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${totals.percentApplicable}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #7af2e0, #6ac8ff, #a29bff)",
                    }}
                  />
                </div>
                <div style={{ fontSize: 12, color: "#223" }}>
                  {totals.percentApplicable}% (applicable)
                </div>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#fff",
                }}
              >
                <thead>
                  <tr>
                    {[
                      "Section",
                      "Item",
                      "Applicable",
                      "On File",
                      "Doc Date",
                      "Notes",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          borderBottom: "1px solid #ccc",
                          padding: "8px 6px",
                          color: "#223",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SECTIONS.flatMap((sec) =>
                    sec.items.map((it, idx) => {
                      const v = state[it.key];
                      return (
                        <tr key={`${sec.key}-${it.key}`}>
                          <td
                            style={{
                              borderBottom: "1px solid #eee",
                              padding: "6px",
                            }}
                          >
                            {idx === 0 ? sec.title : ""}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #eee",
                              padding: "6px",
                            }}
                          >
                            {it.label}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #eee",
                              padding: "6px",
                            }}
                          >
                            {v.applicable ? "Yes" : "N/A"}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #eee",
                              padding: "6px",
                            }}
                          >
                            {v.present ? "Yes" : "No"}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #eee",
                              padding: "6px",
                            }}
                          >
                            {v.date || "—"}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #eee",
                              padding: "6px",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {v.notes || "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <footer style={{ marginTop: 14, fontSize: 12, color: "#666" }}>
              <em>
                Generated locally. This preview is not saved or transmitted.
              </em>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CaseFileChecklist;
