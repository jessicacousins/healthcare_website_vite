import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const SERVICE_OPTS = [
  "ABA (H2019)",
  "Assessment (H0031)",
  "Treatment Plan (H0032)",
  "Parent/Caregiver Training",
  "BCBA Supervision",
  "Day Habilitation (Program)",
  "Transport (non-billable)",
];

const RATIO_OPTS = ["1:1", "2:1", "Group"];

function blankRow() {
  return {
    day: "Mon",
    service: "ABA (H2019)",
    ratio: "1:1",
    location: "",
    staff: "",
    start: "15:00",
    end: "17:00",
    hours: 2,
    notes: "",
    billable: true,
  };
}

function parseHHMM(s) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || "").trim());
  if (!m) return null;
  const h = Number(m[1]),
    min = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(min)) return null;
  return h * 60 + min;
}
function diffHours(start, end) {
  const a = parseHHMM(start),
    b = parseHHMM(end);
  if (a == null || b == null) return 0;
  let d = b - a;
  if (d < 0) d += 24 * 60;
  return Math.round((d / 60) * 100) / 100;
}

// Convenience builders for the day program template
function rowTransport(day, start, end, ampm) {
  return {
    day,
    service: "Transport (non-billable)",
    ratio: "Group",
    location: "Vendor / Agency",
    staff: "",
    start,
    end,
    hours: diffHours(start, end),
    notes:
      ampm === "AM" ? "Inbound transport window" : "Outbound transport window",
    billable: false,
  };
}
function rowProgram(day, start, end) {
  return {
    day,
    service: "Day Habilitation (Program)",
    ratio: "Group",
    location: "Program",
    staff: "",
    start,
    end,
    hours: diffHours(start, end),
    notes: "Program day window",
    billable: true,
  };
}

export default function ABASchedule() {
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");

  const [client, setClient] = useState({
    name: "",
    dob: "",
    guardian: "",
    memberId: "",
  });

  const [period, setPeriod] = useState({
    start: "",
    end: "",
    weekOf: "",
  });

  const [rows, setRows] = useState([
    blankRow(),
    blankRow(),
    blankRow(),
    blankRow(),
    blankRow(),
  ]);

  // ABA Note scaffolding
  const [targets, setTargets] = useState("");
  const [procedures, setProcedures] = useState(
    "DTT; NET; Naturalistic teaching"
  );
  const [reinforcement, setReinforcement] = useState(
    "Token board; praise; differential reinforcement"
  );
  const [behaviorObs, setBehaviorObs] = useState("");
  const [dataSummary, setDataSummary] = useState("");
  const [parentTraining, setParentTraining] = useState(0);
  const [supervision, setSupervision] = useState(0);
  const [noteFree, setNoteFree] = useState("");

  // Totals only count billable rows
  const totals = useMemo(() => {
    const perService = {};
    let all = 0;
    for (const r of rows) {
      const hrs = Number(r.hours) || 0;
      if (r.billable) {
        all += hrs;
        perService[r.service] = (perService[r.service] || 0) + hrs;
      }
    }
    return { all: Math.round(all * 100) / 100, perService };
  }, [rows]);

  // Compliance (Mon–Fri): require AM transport 08–09, Program 09–15, PM transport 15–16
  const compliance = useMemo(() => {
    const ok = (d, s, e, billableVal) =>
      rows.some(
        (r) =>
          r.day === d &&
          r.start === s &&
          r.end === e &&
          (billableVal == null || r.billable === billableVal)
      );

    const daily = WEEKDAYS.map((d) => {
      const am = ok(d, "08:00", "09:00", false);
      const prog = ok(d, "09:00", "15:00", true);
      const pm = ok(d, "15:00", "16:00", false);

      let status = "missing";
      let detail = "Program block not found (09:00–15:00).";
      if (prog && am && pm) {
        status = "ok";
        detail = "All required blocks present.";
      } else if (prog && (!am || !pm)) {
        status = "warn";
        detail = `Program present; transport ${!am ? "in" : ""}${
          !am && !pm ? " & " : ""
        }${!pm ? "out" : ""} missing.`;
      }
      return { day: d, am, prog, pm, status, detail };
    });

    const counts = daily.reduce(
      (a, d) => {
        a[d.status] += 1;
        return a;
      },
      { ok: 0, warn: 0, missing: 0 }
    );

    return { daily, counts };
  }, [rows]);

  const onLogoFile = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(String(r.result));
    r.readAsDataURL(file);
  };

  const updateClient = (patch) => setClient((c) => ({ ...c, ...patch }));
  const updatePeriod = (patch) => setPeriod((p) => ({ ...p, ...patch }));

  const addRow = () => setRows((list) => [...list, blankRow()]);
  const addTen = () =>
    setRows((list) => [...list, ...Array.from({ length: 10 }, blankRow)]);
  const clearRows = () => setRows([]);

  const duplicateRow = (i) =>
    setRows((list) => {
      const next = [...list];
      next.splice(i + 1, 0, { ...list[i] });
      return next;
    });

  const updateRow = (i, patch) => {
    setRows((list) => {
      const next = [...list];
      const merged = { ...next[i], ...patch };
      if ("start" in patch || "end" in patch) {
        merged.hours = diffHours(merged.start, merged.end);
      }
      next[i] = merged;
      return next;
    });
  };

  // One-click Massachusetts Day Program template (Mon–Fri 8–4 with transport)
  const fillDayProgramTemplate = () => {
    const newRows = [];
    for (const d of WEEKDAYS) {
      newRows.push(rowTransport(d, "08:00", "09:00", "AM"));
      newRows.push(rowProgram(d, "09:00", "15:00"));
      newRows.push(rowTransport(d, "15:00", "16:00", "PM"));
    }
    setRows(newRows);
  };

  const exportPdf = async () => {
    const base = client.name
      ? client.name.trim().replace(/\s+/g, "_")
      : "ABA_Schedule";
    await downloadElementAsPDF(
      "aba-schedule-preview",
      `${base}_Schedule_and_Note.pdf`
    );
  };

  return (
    <div className="layout">
      <div className="kicker">Scheduling</div>
      <div className="h1">ABA & Day Program Schedule + Session Note</div>
      <p className="inline-help">
        Client-side only. Build a weekly schedule and attach a structured note.
        The “Day Program” template fills Mon–Fri with transport and program
        windows commonly used in Massachusetts DDS/MassHealth day services.
        Confirm specifics with your contract and payer policy.
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
              <div className="label">Week Of</div>
              <input
                className="input"
                type="date"
                value={period.weekOf}
                onChange={(e) => updatePeriod({ weekOf: e.target.value })}
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
              <div className="label">Member ID (optional)</div>
              <input
                className="input"
                value={client.memberId}
                onChange={(e) => updateClient({ memberId: e.target.value })}
              />
            </div>
            <div>
              <div className="label">Contract Start</div>
              <input
                className="input"
                type="date"
                value={period.start}
                onChange={(e) => updatePeriod({ start: e.target.value })}
              />
            </div>
            <div>
              <div className="label">Contract End</div>
              <input
                className="input"
                type="date"
                value={period.end}
                onChange={(e) => updatePeriod({ end: e.target.value })}
              />
            </div>
          </div>

          <div className="divider"></div>

          <div className="kicker">Weekly Schedule</div>
          <div className="inline-help">
            Enter start/end as 24-hour time (e.g., 15:00). Hours auto-calc.
            Billable rows are counted in totals.
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              margin: "8px 0",
            }}
          >
            <button className="btn ok" onClick={fillDayProgramTemplate}>
              Fill Day Program Template (Mon–Fri 8–4 w/ Transport)
            </button>
            <button className="btn" onClick={addRow}>
              Add Row
            </button>
            <button className="btn" onClick={addTen}>
              Add 10 Rows
            </button>
            <button className="btn warn" onClick={clearRows}>
              Clear
            </button>
            <span className="pill">
              Billable Weekly Total: {totals.all.toFixed(2)} hrs
            </span>
          </div>

          <table className="aba-grid" style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Service</th>
                <th>Ratio</th>
                <th>Billable</th>
                <th>Location</th>
                <th>Staff</th>
                <th>Start</th>
                <th>End</th>
                <th>Hours</th>
                <th>Notes</th>
                <th style={{ width: 124 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>
                    <select
                      className="input"
                      value={r.day}
                      onChange={(e) => updateRow(i, { day: e.target.value })}
                    >
                      {DOW.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="input"
                      value={r.service}
                      onChange={(e) =>
                        updateRow(i, { service: e.target.value })
                      }
                    >
                      {SERVICE_OPTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="input"
                      value={r.ratio}
                      onChange={(e) => updateRow(i, { ratio: e.target.value })}
                    >
                      {RATIO_OPTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={!!r.billable}
                      onChange={(e) =>
                        updateRow(i, { billable: e.target.checked })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={r.location}
                      onChange={(e) =>
                        updateRow(i, { location: e.target.value })
                      }
                      placeholder="Home / Clinic / Program / Community"
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={r.staff}
                      onChange={(e) => updateRow(i, { staff: e.target.value })}
                      placeholder="Staff name / role"
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={r.start}
                      onChange={(e) => updateRow(i, { start: e.target.value })}
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
                    {Number(r.hours || 0).toFixed(2)}
                  </td>
                  <td>
                    <input
                      className="input"
                      value={r.notes}
                      onChange={(e) => updateRow(i, { notes: e.target.value })}
                      placeholder="Targets, behaviors, etc."
                    />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button className="btn" onClick={() => duplicateRow(i)}>
                        Duplicate
                      </button>
                      <button
                        className="btn danger"
                        onClick={() =>
                          setRows((list) => list.filter((_, k) => k !== i))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={11}>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <strong>Billable Total: {totals.all.toFixed(2)} hrs</strong>
                    <span style={{ color: "#566" }}>|</span>
                    <span
                      style={{
                        display: "inline-flex",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {Object.entries(totals.perService).map(([k, v]) => (
                        <span key={k} className="pill">
                          {k}: {v.toFixed(2)}h
                        </span>
                      ))}
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Compliance readout */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Weekday Compliance (Template Windows)</div>
            <div className="inline-help">
              Checks for 08:00–09:00 inbound transport (non-billable),
              09:00–15:00 program (billable), and 15:00–16:00 outbound transport
              (non-billable). This is a planning aid only; confirm
              service/billing specifics in your contract and payer manuals.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginTop: 8,
              }}
            >
              {compliance.daily.map((d) => (
                <div
                  key={d.day}
                  className="tag"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    <strong>{d.day}</strong> — {d.detail}
                  </span>
                  <span
                    className={`status-badge ${
                      d.status === "ok"
                        ? "ok"
                        : d.status === "warn"
                        ? "due"
                        : "expired"
                    }`}
                  >
                    {d.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="pill">OK: {compliance.counts.ok}</span>{" "}
              <span className="pill">Warn: {compliance.counts.warn}</span>{" "}
              <span className="pill">Missing: {compliance.counts.missing}</span>
            </div>
          </div>

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

        {/* PDF Preview */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">Weekly Schedule + Note</div>

          <div className="preview-surface" id="aba-schedule-preview">
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
                  Contract: {period.start || "—"} to {period.end || "—"}
                  {period.weekOf ? ` • Week of ${period.weekOf}` : ""}
                </div>
              </div>
              <span className="file-pill">Generated Preview</span>
            </header>

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
                <strong>Member ID:</strong> {client.memberId || "—"}
              </div>
            </div>

            <table className="aba-grid">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Service</th>
                  <th>Ratio</th>
                  <th>Billable</th>
                  <th>Location</th>
                  <th>Staff</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Hours</th>
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
                      Add rows to populate schedule.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={i}>
                      <td>{r.day}</td>
                      <td>{r.service}</td>
                      <td>{r.ratio}</td>
                      <td>{r.billable ? "Yes" : "No"}</td>
                      <td>{r.location}</td>
                      <td>{r.staff}</td>
                      <td>{r.start}</td>
                      <td>{r.end}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {Number(r.hours || 0).toFixed(2)}
                      </td>
                      <td>{r.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={10}>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <strong>
                        Billable Total: {totals.all.toFixed(2)} hrs
                      </strong>
                      <span style={{ color: "#566" }}>|</span>
                      <span
                        style={{
                          display: "inline-flex",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        {Object.entries(totals.perService).map(([k, v]) => (
                          <span key={k} className="pill">
                            {k}: {v.toFixed(2)}h
                          </span>
                        ))}
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                Session Note (ABA)
              </div>
              <table className="aba-grid" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <th style={{ width: 220 }}>Targets / Programs</th>
                    <td>{targets || "—"}</td>
                  </tr>
                  <tr>
                    <th>Procedures</th>
                    <td>{procedures || "—"}</td>
                  </tr>
                  <tr>
                    <th>Reinforcement</th>
                    <td>{reinforcement || "—"}</td>
                  </tr>
                  <tr>
                    <th>Behavior Observed</th>
                    <td>{behaviorObs || "—"}</td>
                  </tr>
                  <tr>
                    <th>Data Summary</th>
                    <td>{dataSummary || "—"}</td>
                  </tr>
                  <tr>
                    <th>Parent/Caregiver Training (min)</th>
                    <td>{parentTraining || 0}</td>
                  </tr>
                  <tr>
                    <th>BCBA Supervision (min)</th>
                    <td>{supervision || 0}</td>
                  </tr>
                  <tr>
                    <th>Additional Note</th>
                    <td>{noteFree || "—"}</td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginTop: 8,
                }}
              >
                <div>
                  <strong>Staff Signature:</strong> __________________________
                </div>
                <div>
                  <strong>Date:</strong> __________________
                </div>
              </div>
            </div>

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
