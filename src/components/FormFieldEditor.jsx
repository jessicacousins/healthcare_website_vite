import React, { useState } from "react";

export default function FormFieldEditor({ onAdd }) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState("");

  const add = () => {
    if (!label.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      label: label.trim(),
      type,
      required,
      options:
        type === "select"
          ? options
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
    });
    setLabel("");
    setRequired(false);
    setOptions("");
  };

  return (
    <div className="card">
      <div className="kicker">Add Field</div>
      <div className="grid grid-3">
        <div>
          <div className="label">Label</div>
          <input
            className="input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Client Name"
          />
        </div>
        <div>
          <div className="label">Type</div>
          <select
            className="select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="textarea">Long Text</option>
            <option value="checkbox">Checkbox</option>
            <option value="date">Date</option>
            <option value="select">Select</option>
            <option value="signature">Signature (line)</option>
          </select>
        </div>
        <div>
          <div className="label">Required</div>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
            Must be completed
          </label>
        </div>
        {type === "select" && (
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="label">Options (comma-separated)</div>
            <input
              className="input"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="Yes,No,N/A"
            />
          </div>
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="btn ok" onClick={add}>
          Add Field
        </button>
      </div>
    </div>
  );
}
