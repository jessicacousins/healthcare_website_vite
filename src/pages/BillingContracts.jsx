import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

const DEFAULT_UNITS = 15;

function money(n) {
  if (n === null || n === undefined || isNaN(n)) return "$0.00";
  const f = Number.parseFloat(n);
  return f.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function BillingContracts() {
  // Branding logos
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const onLogoChange = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(r.result.toString());
    r.readAsDataURL(file);
  };

  // Client 
  const [client, setClient] = useState({
    name: "",
    masshealthId: "",
    ddsId: "",
    dob: "",
  });

  // Global default units for new lines
  const [defaultUnits, setDefaultUnits] = useState(DEFAULT_UNITS);

  // Contract lines
  const [rows, setRows] = useState(() => [
    {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      payer: "MassHealth",
      contractId: "",
      serviceCode: "",
      modifier: "",
      rate: "",
      units: DEFAULT_UNITS,
      dos: "",
      provider: "",
      notes: "",
    },
  ]);

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now() + Math.random()),
        payer: "MassHealth",
        contractId: "",
        serviceCode: "",
        modifier: "",
        rate: "",
        units: defaultUnits,
        dos: "",
        provider: "",
        notes: "",
      },
    ]);

  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  const update = (id, key, val) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: val } : r))
    );

  // Totals
  const totals = useMemo(() => {
    let grand = 0;
    const withTotals = rows.map((r) => {
      const rate = Number.parseFloat(r.rate || 0) || 0;
      const units = Number.parseFloat(r.units || 0) || 0;
      const line = rate * units;
      grand += line;
      return { ...r, _lineTotal: line };
    });
    return { rows: withTotals, grand };
  }, [rows]);

  const fileName = useMemo(() => {
    const base = client.name?.trim()
      ? client.name.trim().replace(/\s+/g, "_")
      : "Billing_Sheet";
    return `${base}.pdf`;
  }, [client.name]);

  const clearAll = () => {
    setOrgName("");
    setLogoSrc("");
    setClient({ name: "", masshealthId: "", ddsId: "", dob: "" });
    setDefaultUnits(DEFAULT_UNITS);
    setRows([
      {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        payer: "MassHealth",
        contractId: "",
        serviceCode: "",
        modifier: "",
        rate: "",
        units: DEFAULT_UNITS,
        dos: "",
        provider: "",
        notes: "",
      },
    ]);
  };

  const exportPdf = async () => {
    await downloadElementAsPDF("billing-preview", fileName);
  };

  return (
    <div className="layout">
      <div className="grid grid-2">
        {/* LEFT: Editor */}
        <section className="card">
          <div className="kicker">Tool</div>
          <div className="h1">DDS & MassHealth Billing (Simple)</div>
          <p className="inline-help">
            Add contract lines with payer, service, rate, and units (default{" "}
            {DEFAULT_UNITS}). Totals are calculated client-side. Export a PDF
            and file it in your billing system.
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

          {/* Client */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Client</div>
            <div className="grid grid-4">
              <input
                className="input"
                placeholder="Client name"
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="MassHealth ID (if any)"
                value={client.masshealthId}
                onChange={(e) =>
                  setClient({ ...client, masshealthId: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="DDS ID (if any)"
                value={client.ddsId}
                onChange={(e) =>
                  setClient({ ...client, ddsId: e.target.value })
                }
              />
              <input
                className="input"
                type="date"
                placeholder="DOB"
                value={client.dob}
                onChange={(e) => setClient({ ...client, dob: e.target.value })}
              />
            </div>
          </div>

          {/* Defaults */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Defaults</div>
            <div className="grid grid-3">
              <div>
                <div className="label">Default units for new lines</div>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1"
                  value={defaultUnits}
                  onChange={(e) => setDefaultUnits(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Lines */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Contract Lines</div>
            {totals.rows.map((r) => (
              <div
                key={r.id}
                className="card"
                style={{ padding: 12, marginBottom: 8 }}
              >
                <div className="grid grid-4">
                  <div>
                    <div className="label">Payer</div>
                    <select
                      className="select"
                      value={r.payer}
                      onChange={(e) => update(r.id, "payer", e.target.value)}
                    >
                      <option value="MassHealth">MassHealth</option>
                      <option value="DDS">DDS</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <div className="label">Contract / Program ID</div>
                    <input
                      className="input"
                      value={r.contractId}
                      onChange={(e) =>
                        update(r.id, "contractId", e.target.value)
                      }
                      placeholder="e.g., STABIL-XX-2025"
                    />
                  </div>
                  <div>
                    <div className="label">Service Code</div>
                    <input
                      className="input"
                      value={r.serviceCode}
                      onChange={(e) =>
                        update(r.id, "serviceCode", e.target.value)
                      }
                      placeholder="e.g., T2019"
                    />
                  </div>
                  <div>
                    <div className="label">Modifier(s)</div>
                    <input
                      className="input"
                      value={r.modifier}
                      onChange={(e) => update(r.id, "modifier", e.target.value)}
                      placeholder="e.g., U1, U2"
                    />
                  </div>

                  <div>
                    <div className="label">Rate (per unit)</div>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={r.rate}
                      onChange={(e) => update(r.id, "rate", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <div className="label">Units</div>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      step="1"
                      value={r.units}
                      onChange={(e) => update(r.id, "units", e.target.value)}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <div className="label">Date of Service</div>
                    <input
                      className="input"
                      type="date"
                      value={r.dos}
                      onChange={(e) => update(r.id, "dos", e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="label">Provider (optional)</div>
                    <input
                      className="input"
                      value={r.provider}
                      onChange={(e) => update(r.id, "provider", e.target.value)}
                      placeholder="Rendering provider"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <input
                      className="input"
                      value={r.notes}
                      onChange={(e) => update(r.id, "notes", e.target.value)}
                      placeholder="Notes (authorization ref, location, etc.)"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      gridColumn: "1 / -1",
                    }}
                  >
                    <div className="inline-help">Line total:</div>
                    <div className="money">{money(r._lineTotal)}</div>
                    <button
                      className="btn warn"
                      onClick={() => removeRow(r.id)}
                      style={{ marginLeft: "auto" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button className="btn ok" onClick={addRow}>
              Add contract line
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
            <button className="btn ghost" onClick={clearAll}>
              Clear
            </button>
            <span className="inline-help">
              Client-side only. Export and bill in your official system.
            </span>
          </div>
        </section>

        {/* RIGHT: Preview */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">Billing Sheet — Preview</div>

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
                <h2 style={{ margin: 0 }}>DDS & MassHealth Billing (Simple)</h2>
                {orgName && (
                  <div style={{ color: "#566", fontSize: 12 }}>{orgName}</div>
                )}
              </div>
              <span className="file-pill">Generated Preview</span>
            </header>

            <section style={{ display: "grid", gap: 8 }}>
              <Row label="Client" value={client.name} />
              <Row label="MassHealth ID" value={client.masshealthId} />
              <Row label="DDS ID" value={client.ddsId} />
              <Row label="DOB" value={client.dob} />
            </section>

            <div style={{ overflowX: "auto", marginTop: 8 }}>
              <table
                className="table billing-table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#fff",
                }}
              >
                <thead>
                  <tr>
                    {[
                      "Payer",
                      "Contract/Program",
                      "Service",
                      "Modifier",
                      "DOS",
                      "Units",
                      "Rate",
                      "Line Total",
                      "Provider",
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
                  {totals.rows.map((r) => (
                    <tr key={r.id}>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.payer}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.contractId || "—"}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.serviceCode || "—"}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.modifier || "—"}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.dos || "—"}
                      </td>
                      <td
                        className="num"
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.units || 0}
                      </td>
                      <td
                        className="num"
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {money(Number.parseFloat(r.rate || 0))}
                      </td>
                      <td
                        className="num"
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                          fontWeight: 600,
                        }}
                      >
                        {money(r._lineTotal)}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "6px",
                        }}
                      >
                        {r.provider || "—"}
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
                      colSpan="7"
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
                      className="num"
                      style={{
                        padding: "8px 6px",
                        borderTop: "1px solid #ccc",
                        fontWeight: 700,
                      }}
                    >
                      {money(totals.grand)}
                    </td>
                    <td
                      colSpan="2"
                      style={{ borderTop: "1px solid #ccc" }}
                    ></td>
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
