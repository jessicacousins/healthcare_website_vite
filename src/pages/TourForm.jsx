import React, { useState, useMemo } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

export default function TourForm() {
  const [clientName, setClientName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [location, setLocation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [notes, setNotes] = useState("");
  const [tourGuide, setTourGuide] = useState("");
  const [priority, setPriority] = useState("Medium"); // High | Medium | Low

  const fileName = useMemo(() => {
    const base = clientName?.trim()
      ? clientName.trim().replace(/\s+/g, "_")
      : "Tour_Form";
    return `${base}_Tour_Form.pdf`;
  }, [clientName]);

  const clear = () => {
    setClientName("");
    setGuardianName("");
    setLocation("");
    setContactPhone("");
    setContactEmail("");
    setBirthday("");
    setNotes("");
    setTourGuide("");
    setPriority("Medium");
  };

  const exportPdf = async () => {
    await downloadElementAsPDF("tour-preview", fileName);
  };

  return (
    <div className="layout">
      <section className="card">
        <div className="kicker">Form</div>
        <div className="h1">Tour Form</div>
        <p className="inline-help">
          Ephemeral form. Nothing is saved or transmitted. Download your PDF and
          store it in your approved system.
        </p>

        <div className="grid grid-2" style={{ marginTop: 12 }}>
          <div>
            <div className="label">Client Name *</div>
            <input
              className="input"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="label">Guardian Name</div>
            <input
              className="input"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
            />
          </div>

          <div>
            <div className="label">Location *</div>
            <input
              className="input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="label">Birthday *</div>
            <input
              className="input"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="label">Contact Phone *</div>
            <input
              className="input"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(555) 555-5555"
              required
            />
          </div>

          <div>
            <div className="label">Contact Email</div>
            <input
              className="input"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div className="label">Notes</div>
            <textarea
              className="textarea"
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Context, accommodations, scheduling, etc."
            />
          </div>

          <div>
            <div className="label">Toured By (Staff)</div>
            <input
              className="input"
              value={tourGuide}
              onChange={(e) => setTourGuide(e.target.value)}
              placeholder="Staff name"
            />
          </div>

          <fieldset className="card" style={{ padding: 12 }}>
            <legend className="label">Priority</legend>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="radio"
                  name="priority"
                  value="High"
                  checked={priority === "High"}
                  onChange={(e) => setPriority(e.target.value)}
                />
                High
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="radio"
                  name="priority"
                  value="Medium"
                  checked={priority === "Medium"}
                  onChange={(e) => setPriority(e.target.value)}
                />
                Medium
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="radio"
                  name="priority"
                  value="Low"
                  checked={priority === "Low"}
                  onChange={(e) => setPriority(e.target.value)}
                />
                Low
              </label>
            </div>
          </fieldset>
        </div>

        <div
          style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <button className="btn ok" onClick={exportPdf}>
            Download PDF
          </button>
          <button className="btn ghost" onClick={clear} type="button">
            Clear
          </button>
          <span className="inline-help">
            PDF is rendered locally from the preview below.
          </span>
        </div>
      </section>

      {/* Printable Preview */}
      <section className="card" style={{ marginTop: 18 }}>
        <div className="kicker">Preview</div>
        <div className="h1">Tour Form — Preview</div>

        <div className="preview-surface" id="tour-preview">
          <h2 style={{ marginTop: 0 }}>Tour Form</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <Field label="Client Name" value={clientName} />
            <Field label="Guardian Name" value={guardianName} />
            <Field label="Location" value={location} />
            <Field label="Birthday" value={birthday} />
            <Field label="Contact Phone" value={contactPhone} />
            <Field label="Contact Email" value={contactEmail} />
            <Field label="Toured By (Staff)" value={tourGuide} />
            <Field label="Priority" value={priority} />
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "#334",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                }}
              >
                Notes
              </div>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  minHeight: 80,
                  border: "1px solid #ddd",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                {notes || "—"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, fontSize: 12, color: "#666" }}>
            <em>
              Generated locally. This preview is not saved or transmitted.
            </em>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
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
        {value?.trim() ? value : "—"}
      </div>
    </div>
  );
}
