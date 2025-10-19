import React, { useState } from "react";
import FormFieldEditor from "../components/FormFieldEditor.jsx";
import FormPreview from "../components/FormPreview.jsx";
import { downloadElementAsPDF } from "../util/pdf.js";

export default function FormBuilder() {
  const [title, setTitle] = useState("Client Intake Form");
  const [fields, setFields] = useState([
    { id: "n1", label: "Client Name", type: "text", required: true },
    { id: "n2", label: "Date of Birth", type: "date", required: true },
    { id: "n3", label: "Primary Contact", type: "text", required: false },
    {
      id: "n4",
      label: "Consent to Share Info",
      type: "checkbox",
      required: false,
    },
    { id: "n5", label: "Notes", type: "textarea", required: false },
  ]);

  const addField = (f) => setFields((prev) => [...prev, f]);
  const remove = (id) => setFields((prev) => prev.filter((x) => x.id !== id));
  const moveUp = (idx) => {
    if (idx <= 0) return;
    setFields((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };
  const moveDown = (idx) => {
    if (idx >= fields.length - 1) return;
    setFields((prev) => {
      const next = [...prev];
      [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
      return next;
    });
  };

  const exportPdf = async () => {
    await downloadElementAsPDF(
      "form-preview",
      `${title.replace(/\s+/g, "_")}.pdf`
    );
  };

  return (
    <div className="layout">
      <div className="grid grid-2">
        <section className="card">
          <div className="kicker">Builder</div>
          <div className="h1">Form Structure</div>
          <div style={{ margin: "12px 0" }}>
            <div className="label">Form Title</div>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <FormFieldEditor onAdd={addField} />

          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Fields</div>
            {!fields.length && (
              <p className="inline-help">
                Add your first field using the editor above.
              </p>
            )}
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 8,
              }}
            >
              {fields.map((f, i) => (
                <li key={f.id} className="card" style={{ padding: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div>
                      <strong>{f.label}</strong>{" "}
                      <span className="inline-help">
                        ({f.type}
                        {f.required ? ", required" : ""})
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn ghost"
                        onClick={() => moveUp(i)}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className="btn ghost"
                        onClick={() => moveDown(i)}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        className="btn warn"
                        onClick={() => remove(f.id)}
                        title="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
              All actions are client-side only.
            </span>
          </div>
        </section>

        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">Live Form</div>
          <FormPreview title={title} fields={fields} />
        </section>
      </div>
    </div>
  );
}
