import React from "react";

export default function FormPreview({
  title,
  fields,
  logoSrc,
  orgName,
  intake,
}) {
  const checklist = intake?.checklist || {};
  const insurance = intake?.insurance || {};
  const identifiers = intake?.identifiers || {};
  const consents = intake?.consents || {};
  const contacts = intake?.contacts || [{}, {}];
  const assessments = intake?.assessments || {};

  const Box = ({ checked }) => (
    <span
      style={{
        display: "inline-block",
        width: 14,
        height: 14,
        border: "1px solid #888",
        borderRadius: 2,
        marginRight: 6,
        textAlign: "center",
        lineHeight: "14px",
        fontWeight: 700,
        fontSize: 11,
      }}
    >
      {checked ? "✓" : " "}
    </span>
  );

  const FieldRow = ({ label, value }) => (
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

  return (
    <div className="preview-surface" id="form-preview">
      {/* Header / Branding */}
      <div
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
          <h2 style={{ margin: 0 }}>{title || "Untitled Form"}</h2>
          {orgName && (
            <div style={{ color: "#566", fontSize: 12 }}>{orgName}</div>
          )}
        </div>
        <span className="file-pill">Generated Preview</span>
      </div>

      {/* Dynamic user-defined fields block */}
      {Array.isArray(fields) && fields.length > 0 && (
        <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
          {fields.map((f) => (
            <div key={f.id} style={{ display: "grid", gap: 6 }}>
              <label
                style={{
                  color: "#334",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                }}
              >
                {f.label}
                {f.required ? " *" : ""}
              </label>
              {f.type === "text" && (
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: 10,
                    borderRadius: 8,
                    minHeight: 22,
                  }}
                />
              )}
              {f.type === "textarea" && (
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: 10,
                    borderRadius: 8,
                    minHeight: 80,
                  }}
                />
              )}
              {f.type === "checkbox" && (
                <div>
                  <Box checked={false} /> Check if applicable
                </div>
              )}
              {f.type === "date" && (
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: 10,
                    borderRadius: 8,
                    minHeight: 22,
                  }}
                />
              )}
              {f.type === "select" && (
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: 10,
                    borderRadius: 8,
                    minHeight: 22,
                  }}
                />
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
      )}

      {/* Intake sections (optional) */}
      {intake && (
        <div style={{ marginTop: 16, display: "grid", gap: 16 }}>
          {/* Records Required Checklist */}
          <section>
            <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
              Required Records (Before Service)
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                gap: 8,
              }}
            >
              {Object.entries(checklist).map(([k, v]) => (
                <label
                  key={k}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Box checked={!!v} /> <span>{k}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Insurance & Identifiers */}
          <section>
            <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
              Insurance & Identifiers
            </h3>
            <div style={{ display: "grid", gap: 8 }}>
              <FieldRow
                label="Payer / Plan"
                value={[insurance.payer, insurance.planType]
                  .filter(Boolean)
                  .join(" — ")}
              />
              <FieldRow label="Policy #" value={insurance.policyNumber} />
              <FieldRow label="Group #" value={insurance.groupNumber} />
              <FieldRow label="Medicare #" value={insurance.medicareNumber} />
              <FieldRow label="Medicaid #" value={insurance.medicaidNumber} />
              <FieldRow label="SSN" value={identifiers.ssn} />
              <FieldRow
                label="Birth Certificate on File"
                value={identifiers.birthCertificateOnFile ? "Yes" : "No"}
              />
            </div>
          </section>

          {/* Consents */}
          <section>
            <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>Consents</h3>
            <div style={{ display: "grid", gap: 6 }}>
              <div>
                <Box checked={!!consents.pcp} /> Release to Primary Care
                Provider (PCP)
                {consents.pcp && consents.guardianName
                  ? ` — ${consents.guardianName}`
                  : ""}
              </div>
              <div>
                <Box checked={!!consents.guardian} /> Guardian Consent
                {consents.guardian && consents.guardianName
                  ? ` — ${consents.guardianName}`
                  : ""}
              </div>
              <div>
                <Box checked={!!consents.healthcareProxy} /> Healthcare Proxy
                Consent
                {consents.healthcareProxy && consents.proxyName
                  ? ` — ${consents.proxyName}`
                  : ""}
              </div>
              <div>
                <Box checked={!!consents.generalCare} /> Consent for Care
              </div>
            </div>
          </section>

          {/* Emergency Contacts */}
          <section>
            <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
              Emergency Contacts
            </h3>
            <div style={{ display: "grid", gap: 8 }}>
              <FieldRow
                label="Contact 1"
                value={[
                  contacts[0]?.name,
                  contacts[0]?.relation,
                  contacts[0]?.phone,
                ]
                  .filter(Boolean)
                  .join(" — ")}
              />
              <FieldRow
                label="Contact 2"
                value={[
                  contacts[1]?.name,
                  contacts[1]?.relation,
                  contacts[1]?.phone,
                ]
                  .filter(Boolean)
                  .join(" — ")}
              />
            </div>
          </section>

          {/* Assessments & Protocols */}
          <section>
            <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
              Assessments & Protocols
            </h3>
            <div style={{ display: "grid", gap: 8 }}>
              <FieldRow
                label="Functional Assessment Date"
                value={assessments.functionalDate}
              />
              <FieldRow
                label="Risk Assessment Date"
                value={assessments.riskDate}
              />
              <FieldRow label="Allergies" value={assessments.allergies} />
              <FieldRow
                label="Mobility Needs"
                value={assessments.mobilityNeeds}
              />
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#334",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    marginBottom: 4,
                  }}
                >
                  Critical Protocols
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                    gap: 6,
                  }}
                >
                  <div>
                    <Box checked={!!assessments.behaviorPlan} /> Behavior Plan
                  </div>
                  <div>
                    <Box checked={!!assessments.seizureProtocol} /> Seizure
                    Protocol
                  </div>
                  <div>
                    <Box checked={!!assessments.medAdminProtocol} /> Medication
                    Administration Protocol
                  </div>
                </div>
              </div>
              <FieldRow
                label="Other Protocols"
                value={assessments.otherProtocols}
              />
            </div>
          </section>
        </div>
      )}

      <div style={{ marginTop: 18, fontSize: 12, color: "#666" }}>
        <em>Generated locally. This preview is not saved or transmitted.</em>
      </div>
    </div>
  );
}
