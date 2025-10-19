import React, { useState } from "react";
import { textToPdf } from "../util/pdf.js";

export default function AdminTools() {
  const [checklist, setChecklist] = useState([
    "Staff credentials verified",
    "Service plan current",
    "Emergency contact documented",
    "Incident reporting policy acknowledged",
  ]);
  const [item, setItem] = useState("");
  const [memoTitle, setMemoTitle] = useState("Policy Memo");
  const [memoBody, setMemoBody] = useState(
    `Purpose:
- Outline updates to documentation workflows

Scope:
- Applies to all program staff

Policy:
- Use ephemeral tool for document generation
- Store outputs only in approved systems

Acknowledgement:
- Staff must review and sign in official EHR/EMR`
  );

  const addItem = () => {
    if (!item.trim()) return;
    setChecklist((prev) => [...prev, item.trim()]);
    setItem("");
  };

  const downloadChecklist = async () => {
    const text = `Internal Checklist\n\n${checklist
      .map((c, i) => `${i + 1}. ${c}`)
      .join("\n")}\n`;
    const blob = await textToPdf(text);
    saveBlob(blob, "checklist.pdf");
  };

  const downloadMemo = async () => {
    const text = `${memoTitle}\n\n${memoBody}`;
    const blob = await textToPdf(text);
    saveBlob(blob, `${memoTitle.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="layout">
      <div className="grid grid-2">
        <section className="card">
          <div className="kicker">Admin</div>
          <div className="h1">Internal Checklist</div>
          <div className="label">Add Checklist Item</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="e.g., Verify consent form signed"
            />
            <button className="btn ok" onClick={addItem}>
              Add
            </button>
          </div>
          <ul style={{ marginTop: 12 }}>
            {checklist.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
          <div style={{ marginTop: 12 }}>
            <button className="btn ok" onClick={downloadChecklist}>
              Download Checklist PDF
            </button>
          </div>
        </section>

        <section className="card">
          <div className="kicker">Management</div>
          <div className="h1">Policy Memo</div>
          <div className="label">Title</div>
          <input
            className="input"
            value={memoTitle}
            onChange={(e) => setMemoTitle(e.target.value)}
          />
          <div className="label" style={{ marginTop: 8 }}>
            Body
          </div>
          <textarea
            className="textarea"
            rows={12}
            value={memoBody}
            onChange={(e) => setMemoBody(e.target.value)}
          />
          <div style={{ marginTop: 12 }}>
            <button className="btn ok" onClick={downloadMemo}>
              Download Memo PDF
            </button>
          </div>
        </section>
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <div className="kicker">Reminder</div>
        <p className="inline-help">
          This hub is not a data repository. Download your outputs and store
          them in your organization’s approved system.
        </p>
      </div>
    </div>
  );
}

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
