import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

function parseHHMM(s) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || "").trim());
  if (!m) return null;
  const h = Number(m[1]),
    min = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(min)) return null;
  return h * 60 + min;
}
function diffMinutes(start, end) {
  const a = parseHHMM(start),
    b = parseHHMM(end);
  if (a == null || b == null) return 0;
  let d = b - a;
  if (d < 0) d += 24 * 60; // wrap tolerance
  return Math.max(0, d);
}

const SUG_ANTE = [
  "Denied access / demand placed",
  "Transition",
  "Unstructured time",
  "Attention removed / diverted",
  "Task difficulty",
  "Sensory trigger",
];
const SUG_BEH = [
  "Noncompliance",
  "Elopement",
  "Physical aggression",
  "Property destruction",
  "Self-injury",
  "Vocal disruption",
];
const SUG_CONS = [
  "Redirection",
  "Planned ignore",
  "Prompting (verbal/gestural)",
  "Break given",
  "Alternative task",
  "Preferred item access",
];

function blankEvent() {
  return {
    timeStart: "09:00",
    timeEnd: "09:05",
    durationMin: 5,
    antecedent: "",
    behavior: "",
    consequence: "",
    intensity: 1,
    location: "",
    staff: "",
    notes: "",
    injury: false,
    restrictive: false,
  };
}

export default function ABCDataCollector() {
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const [meta, setMeta] = useState({
    client: "",
    dob: "",
    date: "",
    observer: "",
    setting: "Program",
  });

  const [rows, setRows] = useState([blankEvent(), blankEvent(), blankEvent()]);

  const totals = useMemo(() => {
    const byBehavior = new Map();
    const byAntecedent = new Map();
    const byConsequence = new Map();
    let events = 0;
    let mins = 0;
    let intensitySum = 0;

    for (const r of rows) {
      const d = Number(r.durationMin) || 0;
      const i = Number(r.intensity) || 0;
      if (r.behavior?.trim()) {
        byBehavior.set(r.behavior, (byBehavior.get(r.behavior) || 0) + 1);
      }
      if (r.antecedent?.trim()) {
        byAntecedent.set(
          r.antecedent,
          (byAntecedent.get(r.antecedent) || 0) + 1
        );
      }
      if (r.consequence?.trim()) {
        byConsequence.set(
          r.consequence,
          (byConsequence.get(r.consequence) || 0) + 1
        );
      }
      events += 1;
      mins += d;
      intensitySum += i;
    }
    const avgIntensity = events
      ? Math.round((intensitySum / events) * 100) / 100
      : 0;
    return {
      events,
      mins: Math.round(mins * 100) / 100,
      avgIntensity,
      byBehavior: Array.from(byBehavior.entries()).sort((a, b) => b[1] - a[1]),
      byAntecedent: Array.from(byAntecedent.entries()).sort(
        (a, b) => b[1] - a[1]
      ),
      byConsequence: Array.from(byConsequence.entries()).sort(
        (a, b) => b[1] - a[1]
      ),
    };
  }, [rows]);

  const onLogoFile = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(String(r.result));
    r.readAsDataURL(file);
  };

  const addRow = () => setRows((l) => [...l, blankEvent()]);
  const addTen = () =>
    setRows((l) => [...l, ...Array.from({ length: 10 }, blankEvent)]);
  const clearRows = () => setRows([]);
  const duplicateRow = (i) =>
    setRows((l) => {
      const next = [...l];
      next.splice(i + 1, 0, { ...l[i] });
      return next;
    });
  const removeRow = (i) => setRows((l) => l.filter((_, k) => k !== i));

  const updateRow = (i, patch) => {
    setRows((l) => {
      const next = [...l];
      const merged = { ...next[i], ...patch };
      if ("timeStart" in patch || "timeEnd" in patch) {
        merged.durationMin = diffMinutes(merged.timeStart, merged.timeEnd);
      }
      next[i] = merged;
      return next;
    });
  };

  const exportPdf = async () => {
    const base = meta.client
      ? meta.client.trim().replace(/\s+/g, "_")
      : "ABC_Data";
    await downloadElementAsPDF("abc-preview", `${base}_ABC_Data.pdf`);
  };

  return (
    <div className="layout">
      <div className="kicker">Behavior</div>
      <div className="h1">ABC Behavior Data Collector</div>
      <p className="inline-help">
        Client-side only. Capture Antecedent–Behavior–Consequence events,
        durations, and intensity. Export as PDF.
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
              <div className="label">Date</div>
              <input
                className="input"
                type="date"
                value={meta.date}
                onChange={(e) => setMeta({ ...meta, date: e.target.value })}
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
          </div>

          <div className="divider"></div>

          <div className="kicker">Client</div>
          <div className="grid grid-3">
            <div>
              <div className="label">Client Name</div>
              <input
                className="input"
                value={meta.client}
                onChange={(e) => setMeta({ ...meta, client: e.target.value })}
              />
            </div>
            <div>
              <div className="label">DOB</div>
              <input
                className="input"
                type="date"
                value={meta.dob}
                onChange={(e) => setMeta({ ...meta, dob: e.target.value })}
              />
            </div>
            <div>
              <div className="label">Observer</div>
              <input
                className="input"
                value={meta.observer}
                onChange={(e) => setMeta({ ...meta, observer: e.target.value })}
              />
            </div>
            <div>
              <div className="label">Setting</div>
              <input
                className="input"
                value={meta.setting}
                onChange={(e) => setMeta({ ...meta, setting: e.target.value })}
                placeholder="Program / Home / Community"
              />
            </div>
          </div>

          <div className="divider"></div>

          <div className="kicker">Events</div>
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
            <button className="btn" onClick={addTen}>
              Add 10 Rows
            </button>
            <button className="btn warn" onClick={clearRows}>
              Clear
            </button>
            <span className="pill">Events: {totals.events}</span>
            <span className="pill">
              Total Duration: {totals.mins.toFixed(2)} min
            </span>
            <span className="pill">
              Avg Intensity: {totals.avgIntensity.toFixed(2)}/5
            </span>
          </div>

          {/* Reuse .aba-grid styles for a crisp printable table */}
          <table className="aba-grid">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Duration (min)</th>
                <th>Antecedent</th>
                <th>Behavior</th>
                <th>Consequence</th>
                <th>Intensity (1–5)</th>
                <th>Location</th>
                <th>Staff</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    style={{ textAlign: "center", padding: 12, color: "#667" }}
                  >
                    Add rows to begin.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        className="input"
                        value={r.timeStart}
                        onChange={(e) =>
                          updateRow(i, { timeStart: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.timeEnd}
                        onChange={(e) =>
                          updateRow(i, { timeEnd: e.target.value })
                        }
                      />
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {Number(r.durationMin || 0).toFixed(2)}
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.antecedent}
                        onChange={(e) =>
                          updateRow(i, { antecedent: e.target.value })
                        }
                        list="ante-list"
                        placeholder="type or pick…"
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.behavior}
                        onChange={(e) =>
                          updateRow(i, { behavior: e.target.value })
                        }
                        list="beh-list"
                        placeholder="type or pick…"
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.consequence}
                        onChange={(e) =>
                          updateRow(i, { consequence: e.target.value })
                        }
                        list="cons-list"
                        placeholder="type or pick…"
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        type="number"
                        min="1"
                        max="5"
                        step="1"
                        value={r.intensity}
                        onChange={(e) =>
                          updateRow(i, { intensity: e.target.value })
                        }
                      />
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        <label className="label tiny">
                          <input
                            type="checkbox"
                            checked={r.injury}
                            onChange={(e) =>
                              updateRow(i, { injury: e.target.checked })
                            }
                          />{" "}
                          Injury
                        </label>
                        <label className="label tiny">
                          <input
                            type="checkbox"
                            checked={r.restrictive}
                            onChange={(e) =>
                              updateRow(i, { restrictive: e.target.checked })
                            }
                          />{" "}
                          Restrictive used
                        </label>
                      </div>
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.location}
                        onChange={(e) =>
                          updateRow(i, { location: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.staff}
                        onChange={(e) =>
                          updateRow(i, { staff: e.target.value })
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

          {/* datalist suggestions */}
          <datalist id="ante-list">
            {SUG_ANTE.map((x) => (
              <option key={x} value={x} />
            ))}
          </datalist>
          <datalist id="beh-list">
            {SUG_BEH.map((x) => (
              <option key={x} value={x} />
            ))}
          </datalist>
          <datalist id="cons-list">
            {SUG_CONS.map((x) => (
              <option key={x} value={x} />
            ))}
          </datalist>

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

        {/* Preview panel for PDF */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">ABC Data Summary</div>

          <div id="abc-preview" className="preview-surface">
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
                  Date: {meta.date || "—"} • Setting: {meta.setting || "—"}
                </div>
              </div>
              <span className="file-pill">Generated Preview</span>
            </header>

            <div className="grid grid-3" style={{ marginBottom: 8 }}>
              <div>
                <strong>Client:</strong> {meta.client || "—"}
              </div>
              <div>
                <strong>DOB:</strong> {meta.dob || "—"}
              </div>
              <div>
                <strong>Observer:</strong> {meta.observer || "—"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              <span className="pill">Events: {totals.events}</span>
              <span className="pill">
                Total Duration: {totals.mins.toFixed(2)} min
              </span>
              <span className="pill">
                Avg Intensity: {totals.avgIntensity.toFixed(2)}/5
              </span>
            </div>

            <h3>Top Behaviors</h3>
            {totals.byBehavior.length ? (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {totals.byBehavior.map(([k, v]) => (
                  <span key={k} className="tag">
                    {k} — {v}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ color: "#667" }}>—</div>
            )}

            <h3 style={{ marginTop: 14 }}>Antecedents</h3>
            {totals.byAntecedent.length ? (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {totals.byAntecedent.map(([k, v]) => (
                  <span key={k} className="tag">
                    {k} — {v}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ color: "#667" }}>—</div>
            )}

            <h3 style={{ marginTop: 14 }}>Consequences</h3>
            {totals.byConsequence.length ? (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {totals.byConsequence.map(([k, v]) => (
                  <span key={k} className="tag">
                    {k} — {v}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ color: "#667" }}>—</div>
            )}

            <h3 style={{ marginTop: 14 }}>Event Table</h3>
            <table className="aba-grid">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th>Antecedent</th>
                  <th>Behavior</th>
                  <th>Consequence</th>
                  <th>Intensity</th>
                  <th>Location</th>
                  <th>Staff</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
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
                      <td>{r.timeStart}</td>
                      <td>{r.timeEnd}</td>
                      <td>{Number(r.durationMin || 0).toFixed(2)} min</td>
                      <td>{r.antecedent}</td>
                      <td>{r.behavior}</td>
                      <td>{r.consequence}</td>
                      <td>{r.intensity}</td>
                      <td>{r.location}</td>
                      <td>{r.staff}</td>
                      <td>{r.notes}</td>
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
