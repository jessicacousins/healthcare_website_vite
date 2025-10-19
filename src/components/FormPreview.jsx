import React from "react";

export default function FormPreview({ title, fields }) {
  return (
    <div className="preview-surface" id="form-preview">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>{title || "Untitled Form"}</h2>
        <span className="file-pill">Generated Preview</span>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {fields.map((f) => (
          <div key={f.id} style={{ display: "grid", gap: 6 }}>
            <label className="label" style={{ color: "#334", fontSize: 11 }}>
              {f.label}
              {f.required ? " *" : ""}
            </label>
            {f.type === "text" && <input className="input" placeholder="" />}
            {f.type === "textarea" && (
              <textarea className="textarea" rows={4} />
            )}
            {f.type === "checkbox" && (
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" /> Check if applicable
              </label>
            )}
            {f.type === "date" && <input className="input" type="date" />}
            {f.type === "select" && (
              <select className="select">
                {(f.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
            {f.type === "signature" && (
              <div
                style={{ height: 50, borderBottom: "1px solid #999" }}
                aria-label="Signature line"
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, fontSize: 12, color: "#666" }}>
        <em>Note: This preview is ephemeral and not saved.</em>
      </div>
    </div>
  );
}
