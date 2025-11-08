import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

const DRILL_TYPES = [
  "Fire",
  "Evacuation",
  "Lockdown",
  "Severe Weather",
  "Medical Emergency",
  "Missing Person",
];

function blankRow() {
  return {
    type: "Fire",
    date: "",
    start: "09:00",
    end: "09:05",
    durationMin: 5,
    lead: "",
    participants: "",
    outcome: "Pass",
    issues: "",
    actions: "",
    notes: "",
  };
}

function parseHHMM(s) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || "").trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(min)) return null;
  return h * 60 + min;
}
function diffMinutes(start, end) {
  const a = parseHHMM(start),
    b = parseHHMM(end);
  if (a == null || b == null) return 0;
  let d = b - a;
  if (d < 0) d += 24 * 60; // cross-midnight tolerance
  return Math.max(0, d);
}

export default function EmergencyDrillLog() {
  // Header/meta
  const [orgName, setOrgName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [address, setAddress] = useState("");
  const [month, setMonth] = useState(""); // input type="month"
  const [logoSrc, setLogoSrc] = useState("");

  // Optional header image (e.g., floor plan / rally point)
  const [headerImage, setHeaderImage] = useState("");

  // Per-type monthly requirements
  const [required, setRequired] = useState(() => {
    const base = Object.fromEntries(DRILL_TYPES.map((t) => [t, 0]));
    base.Fire = 1; // common monthly target
    return base;
  });

  // Drill rows
  const [rows, setRows] = useState([blankRow(), blankRow(), blankRow()]);

  const onLogoFile = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(String(r.result));
    r.readAsDataURL(file);
  };

  const onHeaderImage = (file) => {
    if (!file) return setHeaderImage("");
    const r = new FileReader();
    r.onload = () => setHeaderImage(String(r.result));
    r.readAsDataURL(file);
  };

  const totals = useMemo(() => {
    const byType = new Map();
    let count = 0;
    let minutes = 0;
    let pass = 0;
    for (const r of rows) {
      const d = Number(r.durationMin) || 0;
      minutes += d;
      count += 1;
      if (r.outcome === "Pass") pass += 1;
      byType.set(r.type, (byType.get(r.type) || 0) + 1);
    }
    const avg = count ? Math.round((minutes / count) * 100) / 100 : 0;
    return {
      count,
      minutes: Math.round(minutes * 100) / 100,
      avgDuration: avg,
      pass,
      byType: Array.from(byType.entries()).sort((a, b) => b[1] - a[1]),
    };
  }, [rows]);

  const compliance = useMemo(() => {
    const counts = Object.fromEntries(DRILL_TYPES.map((t) => [t, 0]));
    for (const r of rows) counts[r.type] += 1;

    const statusByType = {};
    let ok = 0,
      warn = 0,
      missing = 0;

    for (const t of DRILL_TYPES) {
      const need = Number(required[t]) || 0;
      const have = counts[t] || 0;
      let status = "ok";
      let detail = "Requirement met";
      if (need > 0 && have === 0) {
        status = "missing";
        detail = "No drills recorded";
      } else if (need > 0 && have < need) {
        status = "warn";
        detail = `Have ${have} of ${need}`;
      }
      if (status === "ok") ok++;
      else if (status === "warn") warn++;
      else missing++;
      statusByType[t] = { need, have, status, detail };
    }
    return { statusByType, counts, ok, warn, missing };
  }, [rows, required]);

  const updateRow = (i, patch) => {
    setRows((list) => {
      const next = [...list];
      const merged = { ...next[i], ...patch };
      if ("start" in patch || "end" in patch) {
        merged.durationMin = diffMinutes(merged.start, merged.end);
      }
      next[i] = merged;
      return next;
    });
  };

  const addRow = () => setRows((l) => [...l, blankRow()]);
  const addFive = () =>
    setRows((l) => [...l, ...Array.from({ length: 5 }, blankRow)]);
  const clearRows = () => setRows([]);
  const duplicateRow = (i) =>
    setRows((l) => {
      const next = [...l];
      next.splice(i + 1, 0, { ...l[i] });
      return next;
    });
  const removeRow = (i) => setRows((l) => l.filter((_, k) => k !== i));

  const exportPdf = async () => {
    const base = (siteName || orgName || "Emergency_Drills")
      .trim()
      .replace(/\s+/g, "_");
    await downloadElementAsPDF(
      "drill-preview",
      `${base}_Drill_Log_${month || "Period"}.pdf`
    );
  };

  return (
    <div className="layout">
      <div className="kicker">Safety</div>
      <div className="h1">Emergency Drill Log & After-Action Report</div>
      <p className="inline-help">
        Client-side only. Track monthly drills, compute compliance vs required
        counts, and export a PDF. Nothing is stored; all processing happens in
        your browser.
      </p>

      <div className="grid grid-2">
        {/* Editor */}
        <section className="card">
          <div className="kicker">Header</div>
          <div className="grid grid-3">
            <div>
              <div className="label">Organization</div>
              <input
                className="input"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Company / Program"
              />
            </div>
            <div>
              <div className="label">Site</div>
              <input
                className="input"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Building / Program name"
              />
            </div>
            <div>
              <div className="label">Month</div>
              <input
                className="input"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="label">Address</div>
              <input
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, State"
              />
            </div>
            <div>
              <div className="label">Logo (optional)</div>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => onLogoFile(e.target.files?.[0])}
              />
            </div>
            <div>
              <div className="label">Header Image (optional)</div>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => onHeaderImage(e.target.files?.[0])}
              />
            </div>
          </div>

          <div className="divider"></div>

          <div className="kicker">Monthly Requirements</div>
          <div className="inline-help">
            Set how many of each drill type are required this month.
          </div>
          <div className="grid grid-3" style={{ marginTop: 6 }}>
            {DRILL_TYPES.map((t) => (
              <label
                key={t}
                className="label"
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                <span style={{ minWidth: 130 }}>{t}</span>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1"
                  value={required[t]}
                  onChange={(e) =>
                    setRequired((r) => ({
                      ...r,
                      [t]: Math.max(0, Number(e.target.value || 0)),
                    }))
                  }
                  style={{ maxWidth: 100 }}
                />
              </label>
            ))}
          </div>

          <div className="divider"></div>

          <div className="kicker">Drills</div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            <button className="btn" onClick={addRow}>
              Add Row
            </button>
            <button className="btn" onClick={addFive}>
              Add 5 Rows
            </button>
            <button className="btn warn" onClick={clearRows}>
              Clear
            </button>
            <span className="pill">Events: {totals.count}</span>
            <span className="pill">
              Total Duration: {totals.minutes.toFixed(2)} min
            </span>
            <span className="pill">
              Avg Duration: {totals.avgDuration.toFixed(2)} min
            </span>
            <span className="pill">Pass: {totals.pass}</span>
          </div>

          {/* Reuse .aba-grid table styling for clean print */}
          <table className="aba-grid">
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Duration</th>
                <th>Lead</th>
                <th>Participants</th>
                <th>Outcome</th>
                <th>Issues</th>
                <th>Corrective Actions</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    style={{ textAlign: "center", padding: 12, color: "#667" }}
                  >
                    Add rows to begin.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <select
                        className="input"
                        value={r.type}
                        onChange={(e) => updateRow(i, { type: e.target.value })}
                      >
                        {DRILL_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="input"
                        type="date"
                        value={r.date}
                        onChange={(e) => updateRow(i, { date: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.start}
                        onChange={(e) =>
                          updateRow(i, { start: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.end}
                        onChange={(e) => updateRow(i, { end: e.target.value })}
                      />
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {Number(r.durationMin || 0).toFixed(2)} min
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.lead}
                        onChange={(e) => updateRow(i, { lead: e.target.value })}
                        placeholder="Name / Role"
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.participants}
                        onChange={(e) =>
                          updateRow(i, { participants: e.target.value })
                        }
                        placeholder="#"
                      />
                    </td>
                    <td>
                      <select
                        className="input"
                        value={r.outcome}
                        onChange={(e) =>
                          updateRow(i, { outcome: e.target.value })
                        }
                      >
                        <option>Pass</option>
                        <option>Needs Improvement</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.issues}
                        onChange={(e) =>
                          updateRow(i, { issues: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.actions}
                        onChange={(e) =>
                          updateRow(i, { actions: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.notes}
                        onChange={(e) =>
                          updateRow(i, { notes: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        <button className="btn" onClick={() => duplicateRow(i)}>
                          Duplicate
                        </button>
                        <button
                          className="btn danger"
                          onClick={() => removeRow(i)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 12,
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

        {/* Preview / PDF surface */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">Monthly Drill Summary</div>

          <div id="drill-preview" className="preview-surface">
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
                <h2 style={{ margin: 0 }}>{orgName || "Organization"}</h2>
                <div style={{ color: "#566", fontSize: 12 }}>
                  Site: {siteName || "—"} • Month: {month || "—"}
                  {address ? ` • ${address}` : ""}
                </div>
              </div>
              <span className="file-pill">Generated Preview</span>
            </header>

            {headerImage && (
              <div style={{ marginBottom: 8 }}>
                <img
                  src={headerImage}
                  alt="Header attachment"
                  style={{
                    maxHeight: 160,
                    objectFit: "contain",
                    width: "100%",
                    borderRadius: 6,
                    border: "1px solid var(--border, #e1e4e8)",
                  }}
                />
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <span className="pill">Events: {totals.count}</span>
              <span className="pill">
                Total Duration: {totals.minutes.toFixed(2)} min
              </span>
              <span className="pill">
                Avg Duration: {totals.avgDuration.toFixed(2)} min
              </span>
              <span className="pill">Pass: {totals.pass}</span>
            </div>

            {totals.byType.length ? (
              <>
                <h3>Events by Type</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {totals.byType.map(([k, v]) => (
                    <span key={k} className="tag">
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </>
            ) : null}

            <h3 style={{ marginTop: 14 }}>Compliance Status (Monthly)</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {DRILL_TYPES.map((t) => {
                const s = compliance.statusByType[t];
                const cls =
                  s.status === "ok"
                    ? "ok"
                    : s.status === "warn"
                    ? "due"
                    : "expired";
                return (
                  <div
                    key={t}
                    className="tag"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>
                      <strong>{t}</strong> — need {s.need}, have {s.have} (
                      {s.detail})
                    </span>
                    <span className={`status-badge ${cls}`}>
                      {s.status.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="pill">OK: {compliance.ok}</span>{" "}
              <span className="pill">Warn: {compliance.warn}</span>{" "}
              <span className="pill">Missing: {compliance.missing}</span>
            </div>

            <h3 style={{ marginTop: 14 }}>Drill Table</h3>
            <table className="aba-grid">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th>Lead</th>
                  <th>Participants</th>
                  <th>Outcome</th>
                  <th>Issues</th>
                  <th>Corrective Actions</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      style={{
                        textAlign: "center",
                        padding: 12,
                        color: "#667",
                      }}
                    >
                      No events.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={i}>
                      <td>{r.type}</td>
                      <td>{r.date || "—"}</td>
                      <td>{r.start}</td>
                      <td>{r.end}</td>
                      <td>{Number(r.durationMin || 0).toFixed(2)} min</td>
                      <td>{r.lead}</td>
                      <td>{r.participants}</td>
                      <td>{r.outcome}</td>
                      <td style={{ whiteSpace: "pre-wrap" }}>{r.issues}</td>
                      <td style={{ whiteSpace: "pre-wrap" }}>{r.actions}</td>
                      <td style={{ whiteSpace: "pre-wrap" }}>{r.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <footer style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
              <em>
                Generated locally. Not saved or transmitted. Use your official
                EHR/EMR for retention and signatures per policy.
              </em>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
}
