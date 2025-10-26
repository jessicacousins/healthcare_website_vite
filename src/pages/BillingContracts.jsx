import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

const INITIAL_ROWS = 10;

// --- Regulated presets (per 15 minutes) ------------------------------
// Source: 101 CMR 415.00 §415.03 (current through Register 1550, June 20, 2025)
const PRESET_RATES = [
  {
    payer: "DDS",
    label: "CBDS Level A (per 15 min)",
    code: "CBDS-A",
    unit: 15,
    unitLabel: "15-min",
    rate: 15.02,
    notes: "101 CMR 415.00 §415.03(A)",
  },
  {
    payer: "DDS",
    label: "CBDS Level B (per 15 min)",
    code: "CBDS-B",
    unit: 15,
    unitLabel: "15-min",
    rate: 8.62,
    notes: "101 CMR 415.00 §415.03(B)",
  },
  {
    payer: "DDS",
    label: "CBDS Level C (per 15 min)",
    code: "CBDS-C",
    unit: 15,
    unitLabel: "15-min",
    rate: 6.16,
    notes: "101 CMR 415.00 §415.03(C)",
  },
  {
    payer: "DDS",
    label: "CBDS Level D (per 15 min)",
    code: "CBDS-D",
    unit: 15,
    unitLabel: "15-min",
    rate: 5.28,
    notes: "101 CMR 415.00 §415.03(D)",
  },
  {
    payer: "DDS",
    label: "CBDS Level I (per 15 min)",
    code: "CBDS-I",
    unit: 15,
    unitLabel: "15-min",
    rate: 11.32,
    notes: "101 CMR 415.00 §415.03(I)",
  },
  {
    payer: "DDS",
    label: "CBDS Level W (per 15 min)",
    code: "CBDS-W",
    unit: 15,
    unitLabel: "15-min",
    rate: 7.01,
    notes: "101 CMR 415.00 §415.03(W)",
  },
  {
    payer: "DDS",
    label: "Active Treatment – Adult NF (per 15 min)",
    code: "CBDS-AT-Adult",
    unit: 15,
    unitLabel: "15-min",
    rate: 17.82,
    notes: "Adult NF Active Treatment",
  },
  {
    payer: "DDS",
    label: "Active Treatment – Pediatric NF (per 15 min)",
    code: "CBDS-AT-Peds",
    unit: 15,
    unitLabel: "15-min",
    rate: 21.02,
    notes: "Pediatric NF Active Treatment",
  },

  // MassHealth Day Hab placeholders (paste JSON to set real rates)
  {
    payer: "MassHealth",
    label: "Day Hab – Community LOW (H2014, per 15 min)",
    code: "DH-Low",
    unit: 15,
    unitLabel: "15-min",
    rate: 0,
    notes: "Update from 101 CMR 348.00",
  },
  {
    payer: "MassHealth",
    label: "Day Hab – Community MODERATE (H2014-TF, per 15 min)",
    code: "DH-Mod",
    unit: 15,
    unitLabel: "15-min",
    rate: 0,
    notes: "Update from 101 CMR 348.00",
  },
  {
    payer: "MassHealth",
    label: "Day Hab – Community HIGH (H2014-TG, per 15 min)",
    code: "DH-High",
    unit: 15,
    unitLabel: "15-min",
    rate: 0,
    notes: "Update from 101 CMR 348.00",
  },
  {
    payer: "MassHealth",
    label: "Day Hab – NF one-to-two/three (H2014-U1, per 15 min)",
    code: "DH-U1",
    unit: 15,
    unitLabel: "15-min",
    rate: 0,
    notes: "Update from 101 CMR 348.00",
  },
  {
    payer: "MassHealth",
    label: "Day Hab – NF one-to-one (H2014-U2, per 15 min)",
    code: "DH-U2",
    unit: 15,
    unitLabel: "15-min",
    rate: 0,
    notes: "Update from 101 CMR 348.00",
  },
];

// Example paste JSON:
/*
[
  {"code":"DH-Low","rate":3.65},
  {"code":"DH-Mod","rate":4.62},
  {"code":"DH-High","rate":5.99},
  {"code":"DH-U1","rate":5.77},
  {"code":"DH-U2","rate":10.40}
]
*/

function currency(n) {
  if (n === 0 || n === null || n === undefined || Number.isNaN(+n))
    return "$0.00";
  return Number(n).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

function blankRow() {
  return {
    client: "",
    payer: "",
    desc: "",
    code: "",
    units: 15,
    unitLabel: "15-min",
    rate: 0,
    total: 0,
    notes: "",
  };
}

export default function BillingContracts() {
  // Branding (appears on PDF)
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const onLogoChange = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(String(r.result));
    r.readAsDataURL(file);
  };

  // Optional statement period
  const [header, setHeader] = useState({ statement: "", preparedBy: "" });

  // Rows: preset to 10 empty lines
  const [rows, setRows] = useState(() =>
    Array.from({ length: INITIAL_ROWS }, blankRow)
  );

  const [preset, setPreset] = useState("");
  const [importJson, setImportJson] = useState("");

  const addEmptyRows = (n = 1) => {
    setRows((r) => [...r, ...Array.from({ length: n }, blankRow)]);
  };

  const addPreset = () => {
    const item = PRESET_RATES.find((p) => p.code === preset);
    if (!item) return;
    const newRow = {
      client: "",
      payer: item.payer,
      desc: item.label,
      code: item.code,
      units: 15, // default 15 units
      unitLabel: item.unitLabel,
      rate: item.rate,
      total: +(15 * item.rate).toFixed(2),
      notes: item.notes,
    };
    setRows((r) => [...r, newRow]);
  };

  const pasteRates = () => {
    try {
      const payload = JSON.parse(importJson);
      if (!Array.isArray(payload))
        return alert("JSON must be an array of { code, rate }.");
      const updates = new Map(
        payload.map((x) => [String(x.code), Number(x.rate)])
      );
      for (const p of PRESET_RATES) {
        if (updates.has(p.code)) p.rate = updates.get(p.code);
      }
      alert(
        "Rates updated for this session. Use the Preset dropdown to add lines with updated values."
      );
    } catch {
      alert("Invalid JSON.");
    }
  };

  const updateRow = (idx, patch) => {
    setRows((r) => {
      const next = [...r];
      const item = { ...next[idx], ...patch };
      const rate = parseFloat(item.rate) || 0;
      const units = parseFloat(item.units) || 0;
      item.total = +(rate * units).toFixed(2);
      next[idx] = item;
      return next;
    });
  };

  const removeRow = (idx) => setRows((r) => r.filter((_, i) => i !== idx));
  const grand = useMemo(
    () => rows.reduce((acc, r) => acc + (parseFloat(r.total) || 0), 0),
    [rows]
  );

  // File name for PDF
  const pdfName = useMemo(() => {
    const firstClient = rows.map((r) => r.client).find(Boolean);
    const base = firstClient
      ? firstClient.trim().replace(/\s+/g, "_")
      : "Billing_Sheet";
    return `${base}.pdf`;
  }, [rows]);

  const exportPdf = async () => {
    await downloadElementAsPDF("billing-preview", pdfName);
  };

  return (
    <div className="layout">
      <div className="grid grid-2">
        {/* LEFT: Editor */}
        <section className="card">
          <div className="kicker">Billing</div>
          <div className="h1">Billing Contracts (DDS & MassHealth)</div>
          <p className="inline-help">
            Client-side only. No storage. Starts with 10 rows for multi-client
            entry. Use presets to auto-fill DDS per-15-min rates, or paste
            current MassHealth Day Hab rates (JSON). Export to PDF.
          </p>

          {/* Header / Branding */}
          <div className="card" style={{ marginTop: 8 }}>
            <div className="kicker">Header</div>
            <div className="grid grid-3">
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
                <div className="label">Statement Period</div>
                <input
                  className="input"
                  value={header.statement}
                  onChange={(e) =>
                    setHeader({ ...header, statement: e.target.value })
                  }
                  placeholder="e.g., Sept 2025"
                />
              </div>
              <div>
                <div className="label">Prepared By</div>
                <input
                  className="input"
                  value={header.preparedBy}
                  onChange={(e) =>
                    setHeader({ ...header, preparedBy: e.target.value })
                  }
                  placeholder="Name / Title"
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
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

          {/* Presets / Import */}
          <div className="card" style={{ marginTop: 12 }}>
            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr auto", gap: 12 }}
            >
              <div>
                <div className="label">Add preset (regulated)</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <select
                    className="input"
                    value={preset}
                    onChange={(e) => setPreset(e.target.value)}
                  >
                    <option value="">Choose…</option>
                    <optgroup label="DDS — 101 CMR 415.00 (CBDS)">
                      {PRESET_RATES.filter((p) => p.payer === "DDS").map(
                        (p) => (
                          <option key={p.code} value={p.code}>
                            {p.label} — {currency(p.rate)}
                          </option>
                        )
                      )}
                    </optgroup>
                    <optgroup label="MassHealth — 101 CMR 348.00 (Day Habilitation)">
                      {PRESET_RATES.filter((p) => p.payer === "MassHealth").map(
                        (p) => (
                          <option key={p.code} value={p.code}>
                            {p.label} {p.rate ? `— ${currency(p.rate)}` : ""}
                          </option>
                        )
                      )}
                    </optgroup>
                  </select>
                  <button
                    className="btn ok"
                    onClick={addPreset}
                    disabled={!preset}
                  >
                    Add preset
                  </button>
                </div>
                <p className="inline-help" style={{ marginTop: 6 }}>
                  DDS CBDS values pre-loaded. Paste current Day Hab rates below
                  if needed.
                </p>
              </div>
              <div>
                <details>
                  <summary className="btn ghost">
                    Paste/Update Day Hab rates (JSON)
                  </summary>
                  <div style={{ marginTop: 8 }}>
                    <textarea
                      className="input"
                      rows={6}
                      placeholder='[{"code":"DH-Low","rate":3.65},{"code":"DH-Mod","rate":4.62}]'
                      value={importJson}
                      onChange={(e) => setImportJson(e.target.value)}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <button className="btn" onClick={pasteRates}>
                        Apply
                      </button>
                      <button
                        className="btn ghost"
                        onClick={() => setImportJson("")}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Add empty rows controls */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Rows</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn" onClick={() => addEmptyRows(1)}>
                Add 1 empty row
              </button>
              <button className="btn" onClick={() => addEmptyRows(10)}>
                Add 10 empty rows
              </button>
            </div>
            <p className="inline-help" style={{ marginTop: 6 }}>
              Starts with {INITIAL_ROWS} rows. Use these buttons to add more
              blank lines for additional clients/contracts.
            </p>
          </div>

          {/* Editable table */}
          <div className="card" style={{ marginTop: 12 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Payer</th>
                  <th>Description</th>
                  <th>Code</th>
                  <th>Units</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  <th>Total</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={idx}>
                    <td style={{ whiteSpace: "nowrap" }}>{idx + 1}</td>
                    <td>
                      <input
                        className="input"
                        value={r.client}
                        onChange={(e) =>
                          updateRow(idx, { client: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.payer}
                        onChange={(e) =>
                          updateRow(idx, { payer: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.desc}
                        onChange={(e) =>
                          updateRow(idx, { desc: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.code}
                        onChange={(e) =>
                          updateRow(idx, { code: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        type="number"
                        min="0"
                        step="1"
                        value={r.units}
                        onChange={(e) =>
                          updateRow(idx, { units: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={r.unitLabel}
                        onChange={(e) =>
                          updateRow(idx, { unitLabel: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={r.rate}
                        onChange={(e) =>
                          updateRow(idx, { rate: e.target.value })
                        }
                      />
                    </td>
                    <td>{currency(r.total)}</td>
                    <td>
                      <input
                        className="input"
                        value={r.notes}
                        onChange={(e) =>
                          updateRow(idx, { notes: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn danger"
                        onClick={() => removeRow(idx)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={8} />
                  <td>
                    <strong>{currency(grand)}</strong>
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
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

        {/* RIGHT: Preview (PDF source) */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">Billing — Preview</div>

          <div className="preview-surface" id="billing-preview">
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
                <h2 style={{ margin: 0 }}>DDS & MassHealth Billing</h2>
                {orgName && (
                  <div style={{ color: "#566", fontSize: 12 }}>{orgName}</div>
                )}
                {header.statement && (
                  <div style={{ color: "#566", fontSize: 12 }}>
                    Statement: {header.statement}
                  </div>
                )}
                {header.preparedBy && (
                  <div style={{ color: "#566", fontSize: 12 }}>
                    Prepared by: {header.preparedBy}
                  </div>
                )}
              </div>
              <span className="file-pill">Generated Preview</span>
            </header>

            <div style={{ overflowX: "auto" }}>
              <table
                className="table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#fff",
                }}
              >
                <thead>
                  <tr>
                    {[
                      "#",
                      "Client",
                      "Payer",
                      "Description",
                      "Code",
                      "Units",
                      "Unit",
                      "Rate",
                      "Line Total",
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
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {i + 1}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.client || "—"}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.payer || "—"}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.desc || "—"}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.code || "—"}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.units || 0}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.unitLabel || "15-min"}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                          textAlign: "right",
                        }}
                      >
                        {currency(r.rate)}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        {currency(r.total)}
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
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: "8px 6px",
                        textAlign: "right",
                        borderTop: "1px solid #ccc",
                        color: "#223",
                        fontWeight: 600,
                      }}
                    >
                      Grand Total
                    </td>
                    <td
                      style={{
                        padding: "8px 6px",
                        borderTop: "1px solid #ccc",
                        textAlign: "right",
                        fontWeight: 700,
                      }}
                    >
                      {currency(grand)}
                    </td>
                    <td style={{ borderTop: "1px solid #ccc" }}></td>
                  </tr>
                </tfoot>
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
