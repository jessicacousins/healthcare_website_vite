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
  const pcpHistory = intake?.pcpHistory || [];
  const diagnoses = intake?.diagnoses || "";
  const medications = intake?.medications || [];
  const adl = intake?.adl || {};
  const careNeeds = intake?.careNeeds || "";
  const currentServices = intake?.currentServices || {};
  const trauma = intake?.trauma || {};

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

  const ServiceItem = ({ label, value }) =>
    value ? (
      <div>
        <Box checked={true} /> {label}
      </div>
    ) : null;

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

          {/* NEW — Past PCPs */}
          {pcpHistory?.length ? (
            <section>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
                Past Primary Care Providers
              </h3>
              <div style={{ display: "grid", gap: 6 }}>
                {pcpHistory.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #ddd",
                      padding: 10,
                      borderRadius: 8,
                      background: "#fff",
                    }}
                  >
                    {[p?.name, p?.practice, p?.phone]
                      .filter(Boolean)
                      .join(" — ") || "—"}
                    {(p?.from || p?.to) && (
                      <div style={{ color: "#555", fontSize: 12 }}>
                        Dates: {p?.from || "?"} – {p?.to || "?"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* NEW — Diagnoses */}
          {diagnoses && diagnoses.trim() ? (
            <section>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
                Diagnoses
              </h3>
              <div
                style={{
                  border: "1px solid #ddd",
                  padding: 10,
                  borderRadius: 8,
                  background: "#fff",
                  whiteSpace: "pre-wrap",
                }}
              >
                {diagnoses}
              </div>
            </section>
          ) : null}

          {/* NEW — Medications Table */}
          {medications?.length ? (
            <section>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
                Medications
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                    background: "#fff",
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "Name",
                        "Dose",
                        "Route",
                        "Frequency",
                        "Purpose",
                        "Prescriber",
                        "Start",
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
                    {medications.map((m, i) => (
                      <tr key={i}>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          {m?.name || "—"}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          {m?.dose || "—"}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          {m?.route || "—"}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          {m?.frequency || "—"}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          {m?.purpose || "—"}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          {m?.prescriber || "—"}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #eee",
                            padding: "6px",
                          }}
                        >
                          {m?.start || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {/* NEW — ADL Assistance */}
          {Object.keys(adl).length ? (
            <section>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
                ADL Assistance
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                  gap: 8,
                }}
              >
                {Object.entries(adl).map(([k, v]) => (
                  <FieldRow
                    key={k}
                    label={k.replace(/^\w/, (c) => c.toUpperCase())}
                    value={v}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {/* NEW — Type of Care Needed */}
          {careNeeds && careNeeds.trim() ? (
            <section>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
                Type of Care Needed
              </h3>
              <div
                style={{
                  border: "1px solid #ddd",
                  padding: 10,
                  borderRadius: 8,
                  background: "#fff",
                  whiteSpace: "pre-wrap",
                }}
              >
                {careNeeds}
              </div>
            </section>
          ) : null}

          {/* NEW — Current Services */}
          {Object.values(currentServices).some(Boolean) ? (
            <section>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
                Current Services
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                  gap: 6,
                }}
              >
                <ServiceItem
                  label="Home Health"
                  value={currentServices.homeHealth}
                />
                <ServiceItem
                  label="Physical Therapy"
                  value={currentServices.physicalTherapy}
                />
                <ServiceItem
                  label="Occupational Therapy"
                  value={currentServices.occupationalTherapy}
                />
                <ServiceItem
                  label="Speech Therapy"
                  value={currentServices.speechTherapy}
                />
                <ServiceItem
                  label="Behavioral Therapy"
                  value={currentServices.behavioralTherapy}
                />
                <ServiceItem
                  label="Skilled Nursing"
                  value={currentServices.skilledNursing}
                />
                <ServiceItem
                  label="Case Management"
                  value={currentServices.caseManagement}
                />
                <ServiceItem
                  label="Transportation"
                  value={currentServices.transportation}
                />
                <ServiceItem
                  label="Day Program"
                  value={currentServices.dayProgram}
                />
                {currentServices.other && (
                  <div>
                    <Box checked={true} /> Other —{" "}
                    {currentServices.otherDetail || "—"}
                  </div>
                )}
              </div>
              {currentServices.serviceNotes && (
                <div style={{ marginTop: 8 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#334",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      marginBottom: 4,
                    }}
                  >
                    Notes
                  </div>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      padding: 10,
                      borderRadius: 8,
                      background: "#fff",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {currentServices.serviceNotes}
                  </div>
                </div>
              )}
            </section>
          ) : null}

          {/* NEW — Trauma-Informed Care */}
          {trauma.triggers || trauma.calmingStrategies || trauma.notes ? (
            <section>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>
                Trauma-Informed Care
              </h3>
              <FieldRow label="Known Triggers" value={trauma.triggers} />
              <FieldRow
                label="Calming Strategies"
                value={trauma.calmingStrategies}
              />
              <FieldRow
                label="Notes (for staff awareness)"
                value={trauma.notes}
              />
            </section>
          ) : null}
        </div>
      )}

      <div style={{ marginTop: 18, fontSize: 12, color: "#666" }}>
        <em>Generated locally. This preview is not saved or transmitted.</em>
      </div>
    </div>
  );
}
