import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

function diffInDays(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const ms = d.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}
function statusFor(expires) {
  const days = diffInDays(expires);
  if (days === null) return ["—", "na"];
  if (days < 0) return ["Expired", "expired"];
  if (days <= 30) return ["Due ≤30d", "due"];
  return ["OK", "ok"];
}

const DEFAULT_REQS = [
  {
    id: "id",
    label: "Government Photo ID verified",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "bg",
    label: "Background Check (CORI/State)",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "oig",
    label: "OIG/LEIE Exclusion Check",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "ppd",
    label: "TB/PPD (date & result)",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "physical",
    label: "Physical / Fit for Duty",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "flu",
    label: "Influenza Vaccine",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "hipaa",
    label: "HIPAA/Privacy Training",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "osha",
    label: "OSHA/BBP/Infection Control",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "cpr",
    label: "CPR / First Aid",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "cpi",
    label: "De-escalation / CPI (if required)",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "map",
    label: "Medication Admin (MAP) (if required)",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "dl",
    label: "Driver’s License (if driving)",
    completed: "",
    expires: "",
    notes: "",
  },
  {
    id: "auto",
    label: "Auto Insurance (if driving)",
    completed: "",
    expires: "",
    notes: "",
  },
  // Role-specific can be added below or via “Add requirement”
];

export default function StaffCompliance() {
  // Branding
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const onLogoChange = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(r.result.toString());
    r.readAsDataURL(file);
  };

  // Staff basics
  const [staff, setStaff] = useState({
    name: "",
    role: "",
    employeeId: "",
    supervisor: "",
    startDate: "",
    phone: "",
    email: "",
  });

  // Optional role-specific
  const [nurse, setNurse] = useState({
    isNurse: false,
    license: "",
    licenseExp: "",
  });

  // Requirements list
  const [reqs, setReqs] = useState(DEFAULT_REQS);
  const updateReq = (i, key, val) =>
    setReqs((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: val };
      return next;
    });
  const addReq = () =>
    setReqs((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        label: "Custom requirement",
        completed: "",
        expires: "",
        notes: "",
      },
    ]);
  const removeReq = (i) =>
    setReqs((prev) => prev.filter((_, idx) => idx !== i));

  // Derived summary
  const summary = useMemo(() => {
    let ok = 0,
      due = 0,
      expired = 0;
    for (const r of reqs) {
      const [, cls] = statusFor(r.expires);
      if (cls === "ok") ok++;
      else if (cls === "due") due++;
      else if (cls === "expired") expired++;
    }
    // include nurse license in summary if applicable
    if (nurse.isNurse) {
      const [, cls] = statusFor(nurse.licenseExp);
      if (cls === "ok") ok++;
      else if (cls === "due") due++;
      else if (cls === "expired") expired++;
    }
    return { ok, due, expired };
  }, [reqs, nurse]);

  const fileName = useMemo(() => {
    const base = staff.name?.trim()
      ? staff.name.trim().replace(/\s+/g, "_")
      : "Staff_Compliance";
    return `${base}.pdf`;
  }, [staff.name]);

  const clear = () => {
    setOrgName("");
    setLogoSrc("");
    setStaff({
      name: "",
      role: "",
      employeeId: "",
      supervisor: "",
      startDate: "",
      phone: "",
      email: "",
    });
    setNurse({ isNurse: false, license: "", licenseExp: "" });
    setReqs(DEFAULT_REQS);
  };

  const exportPdf = async () => {
    await downloadElementAsPDF("compliance-preview", fileName);
  };

  return (
    <div className="layout">
      <div className="grid grid-2">
        {/* LEFT: Editor */}
        <section className="card">
          <div className="kicker">Tool</div>
          <div className="h1">Staff Credential & Compliance Checker</div>
          <p className="inline-help">
            Ephemeral tool—no storage or transmission. Use to review a staff
            file and export a PDF summary.
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

          {/* Staff details */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Staff Details</div>
            <div className="grid grid-3">
              <input
                className="input"
                placeholder="Name"
                value={staff.name}
                onChange={(e) => setStaff({ ...staff, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Role/Title"
                value={staff.role}
                onChange={(e) => setStaff({ ...staff, role: e.target.value })}
              />
              <input
                className="input"
                placeholder="Employee ID"
                value={staff.employeeId}
                onChange={(e) =>
                  setStaff({ ...staff, employeeId: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Supervisor"
                value={staff.supervisor}
                onChange={(e) =>
                  setStaff({ ...staff, supervisor: e.target.value })
                }
              />
              <input
                className="input"
                type="date"
                placeholder="Start date"
                value={staff.startDate}
                onChange={(e) =>
                  setStaff({ ...staff, startDate: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Phone"
                value={staff.phone}
                onChange={(e) => setStaff({ ...staff, phone: e.target.value })}
              />
              <input
                className="input"
                placeholder="Email"
                value={staff.email}
                onChange={(e) => setStaff({ ...staff, email: e.target.value })}
              />
            </div>
          </div>

          {/* Nurse license (optional) */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Role-specific</div>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={nurse.isNurse}
                onChange={(e) =>
                  setNurse({ ...nurse, isNurse: e.target.checked })
                }
              />
              Staff is RN/LPN (track license)
            </label>
            {nurse.isNurse && (
              <div className="grid grid-3" style={{ marginTop: 8 }}>
                <input
                  className="input"
                  placeholder="License #"
                  value={nurse.license}
                  onChange={(e) =>
                    setNurse({ ...nurse, license: e.target.value })
                  }
                />
                <input
                  className="input"
                  type="date"
                  placeholder="License Expiration"
                  value={nurse.licenseExp}
                  onChange={(e) =>
                    setNurse({ ...nurse, licenseExp: e.target.value })
                  }
                />
                <div
                  className={`status-badge ${statusFor(nurse.licenseExp)[1]}`}
                >
                  {statusFor(nurse.licenseExp)[0]}
                </div>
              </div>
            )}
          </div>

          {/* Requirements editor */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Requirements</div>
            <p className="inline-help">
              Enter completion and (if applicable) expiration dates. Status
              calculates automatically.
            </p>
            {reqs.map((r, i) => (
              <div
                key={r.id}
                className="card"
                style={{ padding: 12, marginBottom: 8 }}
              >
                <div className="grid grid-3">
                  <input
                    className="input"
                    value={r.label}
                    onChange={(e) => updateReq(i, "label", e.target.value)}
                  />
                  <input
                    className="input"
                    type="date"
                    value={r.completed}
                    onChange={(e) => updateReq(i, "completed", e.target.value)}
                    placeholder="Completed"
                  />
                  <input
                    className="input"
                    type="date"
                    value={r.expires}
                    onChange={(e) => updateReq(i, "expires", e.target.value)}
                    placeholder="Expires"
                  />
                  <input
                    className="input"
                    placeholder="Notes / Results"
                    value={r.notes}
                    onChange={(e) => updateReq(i, "notes", e.target.value)}
                    style={{ gridColumn: "1 / -1" }}
                  />
                  <div className={`status-badge ${statusFor(r.expires)[1]}`}>
                    {statusFor(r.expires)[0]}
                  </div>
                  <button className="btn warn" onClick={() => removeReq(i)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button className="btn ok" onClick={addReq}>
              Add requirement
            </button>
          </div>

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
            <button className="btn ghost" onClick={clear}>
              Clear
            </button>
            <span className="inline-help">
              All actions are client-side only.
            </span>
          </div>
        </section>

        {/* RIGHT: Preview */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">Compliance Summary</div>

          <div className="preview-surface" id="compliance-preview">
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
                  Staff Credential & Compliance Checker
                </h2>
                {orgName && (
                  <div style={{ color: "#566", fontSize: 12 }}>{orgName}</div>
                )}
              </div>
              <span className="file-pill">Generated Preview</span>
            </header>

            {/* Staff block */}
            <section style={{ display: "grid", gap: 8 }}>
              <FieldRow label="Name" value={staff.name} />
              <FieldRow label="Role/Title" value={staff.role} />
              <FieldRow label="Employee ID" value={staff.employeeId} />
              <FieldRow label="Supervisor" value={staff.supervisor} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 10,
                }}
              >
                <FieldMini label="Start Date" value={staff.startDate} />
                <FieldMini label="Phone" value={staff.phone} />
                <FieldMini label="Email" value={staff.email} />
              </div>
              {nurse.isNurse && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: 10,
                  }}
                >
                  <FieldMini label="License #" value={nurse.license} />
                  <FieldMini label="License Exp" value={nurse.licenseExp} />
                  <div>
                    <div className="label tiny">Status</div>
                    <div
                      className={`status-badge ${
                        statusFor(nurse.licenseExp)[1]
                      }`}
                    >
                      {statusFor(nurse.licenseExp)[0]}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Summary row */}
            <div style={{ display: "flex", gap: 10, margin: "10px 0" }}>
              <div className="status-badge ok">OK: {summary.ok}</div>
              <div className="status-badge due">Due ≤30d: {summary.due}</div>
              <div className="status-badge expired">
                Expired: {summary.expired}
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
                      "Requirement",
                      "Completed",
                      "Expires",
                      "Status",
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
                  {reqs.map((r) => {
                    const [label, cls] = statusFor(r.expires);
                    return (
                      <tr key={r.id}>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          {r.label || "—"}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          {r.completed || "—"}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          {r.expires || "—"}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          <span className={`status-badge ${cls}`}>{label}</span>
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {r.notes || "—"}
                        </td>
                      </tr>
                    );
                  })}
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

function FieldRow({ label, value }) {
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
function FieldMini({ label, value }) {
  return (
    <div>
      <div className="label tiny">{label}</div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: 8,
          borderRadius: 8,
          background: "#fff",
        }}
      >
        {value?.toString().trim() ? value : "—"}
      </div>
    </div>
  );
}
