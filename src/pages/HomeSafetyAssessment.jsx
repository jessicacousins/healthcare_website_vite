import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

const SECTIONS = [
  {
    key: "general",
    title: "General Environment",
    items: [
      {
        key: "clutter",
        label: "Walkways free of clutter & loose cords",
        required: true,
      },
      {
        key: "lighting",
        label: "Adequate lighting (hallways, stairs, entrances)",
        required: true,
      },
      {
        key: "floors",
        label: "Floors level / rugs secured (non‑slip)",
        required: true,
      },
      {
        key: "pests",
        label: "No pests/mold; ventilation adequate",
        required: false,
      },
      {
        key: "temperature",
        label: "Heating/AC functioning; safe temp range",
        required: false,
      },
    ],
  },
  {
    key: "bath",
    title: "Bathroom",
    items: [
      {
        key: "grabBars",
        label: "Grab bars (toilet, shower) if needed",
        required: true,
      },
      { key: "nonSlip", label: "Non‑slip mat & dry floor", required: true },
      {
        key: "toiletHeight",
        label: "Toilet height & supports appropriate",
        required: false,
      },
      {
        key: "reachableSupplies",
        label: "Supplies reachable without unsafe bending",
        required: false,
      },
    ],
  },
  {
    key: "kitchen",
    title: "Kitchen",
    items: [
      {
        key: "applianceSafety",
        label: "Appliances in good repair; no frayed cords",
        required: true,
      },
      {
        key: "stoveSafety",
        label: "Stove/oven used safely (knob covers if indicated)",
        required: true,
      },
      {
        key: "foodSafety",
        label: "Food storage & refrigeration appropriate",
        required: false,
      },
      {
        key: "medStorage",
        label: "Medications stored securely & labeled",
        required: true,
      },
    ],
  },
  {
    key: "egress",
    title: "Safety, Egress & Detectors",
    items: [
      { key: "smokeCO", label: "Working smoke & CO detectors", required: true },
      {
        key: "extinguisher",
        label: "Fire extinguisher available/charged",
        required: false,
      },
      {
        key: "exitPaths",
        label: "Exit paths clear; evacuation plan posted",
        required: true,
      },
      {
        key: "emergencyNumbers",
        label: "Emergency numbers posted & visible",
        required: true,
      },
    ],
  },
  {
    key: "mobility",
    title: "Mobility & DME",
    items: [
      {
        key: "stairsRails",
        label: "Stairs with rails; ramps stable",
        required: true,
      },
      {
        key: "transferSpace",
        label: "Adequate transfer space at bed/chair/bath",
        required: true,
      },
      {
        key: "wheelchairFit",
        label: "Wheelchair/walker fitted & maintained",
        required: false,
      },
      {
        key: "oxygenSafety",
        label: "Oxygen safety (signage, storage, tubing)",
        required: false,
      },
      {
        key: "backupPower",
        label: "Back‑up plan for power‑dependent devices",
        required: false,
      },
    ],
  },
  {
    key: "risk",
    title: "Risk Factors",
    items: [
      {
        key: "weapons",
        label: "Weapons/firearms secured (if present)",
        required: false,
      },
      {
        key: "pets",
        label: "Pets controlled; no bite/fall hazards",
        required: false,
      },
      {
        key: "substances",
        label: "Substance use risks addressed (if applicable)",
        required: false,
      },
      {
        key: "behavioral",
        label: "Behavioral triggers/precautions posted",
        required: false,
      },
    ],
  },
];

export default function HomeSafetyAssessment() {
  // Branding
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const onLogoChange = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(r.result.toString());
    r.readAsDataURL(file);
  };

  // Visit details
  const [visit, setVisit] = useState({
    client: "",
    address: "",
    assessor: "",
    date: "",
    phone: "",
    caregiver: "",
    notes: "",
  });

  // Items
  const [state, setState] = useState(() => {
    const s = {};
    for (const sec of SECTIONS) {
      for (const item of sec.items) {
        s[item.key] = { applicable: true, status: "safe", notes: "" }; // status: safe | needs
      }
    }
    return s;
  });
  const setItem = (k, patch) =>
    setState((prev) => ({ ...prev, [k]: { ...prev[k], ...patch } }));

  const counts = useMemo(() => {
    const all = SECTIONS.reduce((n, s) => n + s.items.length, 0);
    let safeOrNA = 0,
      needs = 0;
    for (const sec of SECTIONS) {
      for (const it of sec.items) {
        const v = state[it.key];
        if (v?.applicable === false) safeOrNA++;
        else if (v?.status === "safe") safeOrNA++;
        else needs++;
      }
    }
    const percent = all ? Math.round((safeOrNA / all) * 100) : 0;
    const riskLevel = needs >= 6 ? "High" : needs >= 3 ? "Moderate" : "Low";
    return { all, safeOrNA, needs, percent, riskLevel };
  }, [state]);

  const exportPdf = async () => {
    await downloadElementAsPDF(
      "hesa-preview",
      `${
        visit.client ? visit.client.replace(/\s+/g, "_") + "_" : ""
      }Home_Safety_Assessment.pdf`
    );
  };

  const RiskBadge = ({ level }) => (
    <span className={`risk-badge ${level.toLowerCase()}`}>{level} Risk</span>
  );

  return (
    <div className="layout">
      <div className="grid grid-2">
        {/* LEFT: Form */}
        <section className="card">
          <div className="kicker">Tool</div>
          <div className="h1">Home & Environmental Safety Assessment</div>
          <p className="inline-help">
            Client-side only. Use to assess home readiness and document actions
            before service starts.
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

          {/* Visit details */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Visit Details</div>
            <div className="grid grid-3">
              <input
                className="input"
                placeholder="Client"
                value={visit.client}
                onChange={(e) => setVisit({ ...visit, client: e.target.value })}
              />
              <input
                className="input"
                placeholder="Address"
                value={visit.address}
                onChange={(e) =>
                  setVisit({ ...visit, address: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Phone"
                value={visit.phone}
                onChange={(e) => setVisit({ ...visit, phone: e.target.value })}
              />
              <input
                className="input"
                placeholder="Assessor"
                value={visit.assessor}
                onChange={(e) =>
                  setVisit({ ...visit, assessor: e.target.value })
                }
              />
              <input
                className="input"
                type="date"
                placeholder="Date"
                value={visit.date}
                onChange={(e) => setVisit({ ...visit, date: e.target.value })}
              />
              <input
                className="input"
                placeholder="Caregiver (if any)"
                value={visit.caregiver}
                onChange={(e) =>
                  setVisit({ ...visit, caregiver: e.target.value })
                }
              />
              <div style={{ gridColumn: "1 / -1" }}>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="General notes / context"
                  value={visit.notes}
                  onChange={(e) =>
                    setVisit({ ...visit, notes: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Progress header */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Progress</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <div className="h1" style={{ fontSize: 20, margin: 0 }}>
                {counts.percent}% ready
              </div>
              <RiskBadge level={counts.riskLevel} />
              <div className="inline-help">Ready = Safe + N/A</div>
            </div>
            <div aria-label="Overall progress" className="progress-wrap">
              <div
                className="progress-bar"
                style={{ width: `${counts.percent}%` }}
              />
            </div>
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
                        <div>
                          <div className="label">Status</div>
                          <select
                            className="select"
                            value={v.status}
                            onChange={(e) =>
                              setItem(it.key, { status: e.target.value })
                            }
                            disabled={v.applicable === false}
                          >
                            <option value="safe">Safe</option>
                            <option value="needs">Needs Attention</option>
                          </select>
                        </div>
                        <input
                          className="input"
                          style={{ gridColumn: "1 / -1" }}
                          placeholder="Notes / action steps (who/what/when)"
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
              PDF is generated locally from the preview.
            </span>
          </div>
        </section>

        {/* RIGHT: Preview (PDF) */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">Home Safety — Preview</div>

          <div className="preview-surface" id="hesa-preview">
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
                <h2 style={{ margin: 0 }}>
                  Home & Environmental Safety Assessment
                </h2>
                {orgName && (
                  <div style={{ color: "#566", fontSize: 12 }}>{orgName}</div>
                )}
              </div>
              <span className="file-pill">Generated Preview</span>
            </header>

            <section style={{ display: "grid", gap: 8 }}>
              <Row label="Client" value={visit.client} />
              <Row label="Address" value={visit.address} />
              <Row label="Phone" value={visit.phone} />
              <Row label="Assessor" value={visit.assessor} />
              <Row label="Date" value={visit.date} />
              <Row label="Caregiver" value={visit.caregiver} />
            </section>

            {/* Progress summary */}
            <div style={{ margin: "10px 0 12px" }}>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#334",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                  }}
                >
                  Readiness
                </div>
                <div style={{ fontWeight: 700 }}>{counts.percent}%</div>
                <span
                  className={`risk-badge ${counts.riskLevel.toLowerCase()}`}
                >
                  {counts.riskLevel} Risk
                </span>
              </div>
              <div className="progress-wrap">
                <div
                  className="progress-bar"
                  style={{ width: `${counts.percent}%` }}
                />
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
                    {["Section", "Item", "Applicable", "Status", "Notes"].map(
                      (h) => (
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
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {SECTIONS.flatMap((sec) =>
                    sec.items.map((it, idx) => {
                      const v = state[it.key];
                      const applicableTxt = v.applicable ? "Yes" : "N/A";
                      const statusTxt = v.applicable
                        ? v.status === "safe"
                          ? "Safe"
                          : "Needs Attention"
                        : "—";
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
                            {applicableTxt}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #eee",
                              padding: "6px",
                            }}
                          >
                            {statusTxt}
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

            {visit.notes && (
              <div style={{ marginTop: 10 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "#334",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    marginBottom: 4,
                  }}
                >
                  General Notes
                </div>
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: 10,
                    borderRadius: 8,
                    background: "#fff",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {visit.notes}
                </div>
              </div>
            )}

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

function Row({ label, value }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 10 }}>
      <div
        style={{
          fontSize: 12,
          color: "#334",
          textTransform: "uppercase",
          letterSpacing: ".05em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: 10,
          borderRadius: 8,
          background: "#fff",
        }}
      >
        {value?.toString().trim() ? value : "—"}
      </div>
    </div>
  );
}
