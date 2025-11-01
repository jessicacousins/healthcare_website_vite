import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function daysInMonth(y, mIndex) {
  return new Date(y, mIndex + 1, 0).getDate();
}

function blankMed() {
  return { name: "", dose: "", route: "", times: ["08:00"] };
}

export default function MedicationMAR() {
  const today = new Date();
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const [client, setClient] = useState({
    name: "",
    dob: "",
    allergies: "",
    guardian: "",
    provider: "",
    prescriber: "",
  });
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [meds, setMeds] = useState([blankMed()]);

  const numDays = useMemo(
    () => daysInMonth(year, monthIndex),
    [year, monthIndex]
  );

  const rows = useMemo(() => {
    // Expand each medication into one row per admin time
    const out = [];
    meds.forEach((m) => {
      (m.times || []).forEach((t) => out.push({ ...m, time: t }));
    });
    return out;
  }, [meds]);

  const onLogoFile = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(String(r.result));
    r.readAsDataURL(file);
  };

  const updateClient = (patch) => setClient((c) => ({ ...c, ...patch }));

  const addMed = () => setMeds((list) => [...list, blankMed()]);
  const removeMed = (idx) =>
    setMeds((list) => list.filter((_, i) => i !== idx));
  const updateMed = (idx, patch) => {
    setMeds((list) => {
      const next = [...list];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };
  const addTime = (i) => {
    setMeds((list) => {
      const next = [...list];
      const times = Array.isArray(next[i].times) ? [...next[i].times] : [];
      times.push("12:00");
      next[i].times = times;
      return next;
    });
  };
  const updateTime = (i, tIndex, v) => {
    setMeds((list) => {
      const next = [...list];
      const times = [...(next[i].times || [])];
      times[tIndex] = v;
      next[i].times = times;
      return next;
    });
  };
  const removeTime = (i, tIndex) => {
    setMeds((list) => {
      const next = [...list];
      const times = [...(next[i].times || [])].filter((_, k) => k !== tIndex);
      next[i].times = times.length ? times : ["08:00"];
      return next;
    });
  };

  const exportPdf = async () => {
    const mm = MONTHS[monthIndex];
    const base = client.name ? client.name.trim().replace(/\s+/g, "_") : "MAP";
    await downloadElementAsPDF("map-preview", `${base}_${mm}_${year}.pdf`);
  };

  return (
    <div className="layout">
      <div className="grid grid-2">
        {/* Editor */}
        <section className="card">
          <div className="kicker">Medication</div>
          <div className="h1">Medication Administration Record (MAP)</div>
          <p className="inline-help">
            Client-side only. Configure patient details, medications, and admin
            times; print or export to PDF.
          </p>

          {/* Header / Branding */}
          <div className="card" style={{ marginTop: 8 }}>
            <div className="kicker">Header</div>
            <div className="grid grid-3">
              <div>
                <div className="label">Organization</div>
                <input
                  className="input"
                  placeholder="Company / Program"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <div>
                <div className="label">Month</div>
                <select
                  className="input"
                  value={monthIndex}
                  onChange={(e) => setMonthIndex(Number(e.target.value))}
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="label">Year</div>
                <input
                  className="input"
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="label">Logo (optional)</div>
                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onLogoFile(e.target.files?.[0])}
                />
                {logoSrc && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={logoSrc}
                      alt="Logo"
                      style={{
                        maxHeight: 56,
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

          {/* Client info */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Client</div>
            <div className="grid grid-3">
              <div>
                <div className="label">Client Name</div>
                <input
                  className="input"
                  value={client.name}
                  onChange={(e) => updateClient({ name: e.target.value })}
                />
              </div>
              <div>
                <div className="label">DOB</div>
                <input
                  className="input"
                  type="date"
                  value={client.dob}
                  onChange={(e) => updateClient({ dob: e.target.value })}
                />
              </div>
              <div>
                <div className="label">Guardian</div>
                <input
                  className="input"
                  value={client.guardian}
                  onChange={(e) => updateClient({ guardian: e.target.value })}
                />
              </div>
              <div>
                <div className="label">Primary Provider/Program</div>
                <input
                  className="input"
                  value={client.provider}
                  onChange={(e) => updateClient({ provider: e.target.value })}
                />
              </div>
              <div>
                <div className="label">Prescriber</div>
                <input
                  className="input"
                  value={client.prescriber}
                  onChange={(e) => updateClient({ prescriber: e.target.value })}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="label">Allergies</div>
                <textarea
                  className="input"
                  rows={2}
                  value={client.allergies}
                  onChange={(e) => updateClient({ allergies: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Medications editor */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Medications</div>
            {meds.map((m, i) => (
              <div
                key={i}
                className="stack"
                style={{
                  border: "1px dashed var(--border)",
                  padding: 8,
                  borderRadius: 10,
                  marginBottom: 8,
                }}
              >
                <div className="grid grid-3">
                  <div>
                    <div className="label">Medication</div>
                    <input
                      className="input"
                      value={m.name}
                      onChange={(e) => updateMed(i, { name: e.target.value })}
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <div className="label">Dose</div>
                    <input
                      className="input"
                      value={m.dose}
                      onChange={(e) => updateMed(i, { dose: e.target.value })}
                      placeholder="e.g., 10 mg"
                    />
                  </div>
                  <div>
                    <div className="label">Route</div>
                    <input
                      className="input"
                      value={m.route}
                      onChange={(e) => updateMed(i, { route: e.target.value })}
                      placeholder="PO, SL, IM, etc."
                    />
                  </div>
                </div>

                <div style={{ marginTop: 6 }}>
                  <div className="label">Admin Times</div>
                  {(m.times || []).map((t, k) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <input
                        className="input"
                        style={{ maxWidth: 160 }}
                        value={t}
                        onChange={(e) => updateTime(i, k, e.target.value)}
                        placeholder="e.g., 08:00"
                      />
                      <button
                        className="btn danger"
                        onClick={() => removeTime(i, k)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button className="btn" onClick={() => addTime(i)}>
                      Add time
                    </button>
                    <button className="btn danger" onClick={() => removeMed(i)}>
                      Remove medication
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={addMed}>
                Add medication
              </button>
            </div>
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
            <span className="inline-help">
              PDF is generated locally from the preview.
            </span>
          </div>
        </section>

        {/* Preview (PDF source) */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">
            MAP — {MONTHS[monthIndex]} {year}
          </div>

          <div className="preview-surface mar-sheet" id="mar-preview">
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
                  alt="Logo"
                  style={{ maxHeight: 56, maxWidth: 200, objectFit: "contain" }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0 }}>Medication Administration Record</h2>
                {orgName && (
                  <div style={{ color: "#566", fontSize: 12 }}>{orgName}</div>
                )}
                <div style={{ color: "#566", fontSize: 12 }}>
                  {MONTHS[monthIndex]} {year}
                </div>
              </div>
              <span className="file-pill">Generated Preview</span>
            </header>

            {/* Client header block */}
            <div className="grid grid-3" style={{ marginBottom: 8 }}>
              <div>
                <strong>Client:</strong> {client.name || "—"}
              </div>
              <div>
                <strong>DOB:</strong> {client.dob || "—"}
              </div>
              <div>
                <strong>Guardian:</strong> {client.guardian || "—"}
              </div>
              <div>
                <strong>Provider:</strong> {client.provider || "—"}
              </div>
              <div>
                <strong>Prescriber:</strong> {client.prescriber || "—"}
              </div>
              <div>
                <strong>Allergies:</strong> {client.allergies || "—"}
              </div>
            </div>

            {/* MAP grid */}
            <div style={{ overflowX: "auto" }}>
              <table className="mar-grid">
                <thead>
                  <tr>
                    <th>Medication</th>
                    <th>Dose</th>
                    <th>Route</th>
                    <th>Time</th>
                    {Array.from({ length: numDays }, (_, i) => (
                      <th key={i} className="mar-day-cell">
                        {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4 + numDays}
                        style={{
                          textAlign: "center",
                          padding: 12,
                          color: "#667",
                        }}
                      >
                        Add medications and times to populate the MAR.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, idx) => (
                      <tr key={idx}>
                        <td>{r.name || "—"}</td>
                        <td>{r.dose || "—"}</td>
                        <td>{r.route || "—"}</td>
                        <td>{r.time || "—"}</td>
                        {Array.from({ length: numDays }, (_, i) => (
                          <td key={i} className="mar-day-cell">
                            <span className="mar-day-box" />
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Initials key */}
            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                Initials Key
              </div>
              <table className="mar-grid" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Initials</th>
                    <th>Printed Name</th>
                    <th>Signature</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td style={{ height: 28 }}></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PRN log */}
            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                PRN Administration Log
              </div>
              <table className="mar-grid" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Medication</th>
                    <th>Dose</th>
                    <th>Reason / Symptoms</th>
                    <th>Effect / Follow-up</th>
                    <th>Staff Initials</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td style={{ height: 28 }}></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
              <em>
                Generated locally. This preview is not saved or transmitted. Use
                your official EHR/EMR for retention and signatures per policy.
              </em>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
}
