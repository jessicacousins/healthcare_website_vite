import React, { useState } from "react";
import FormFieldEditor from "../components/FormFieldEditor.jsx";
import FormPreview from "../components/FormPreview.jsx";
import { downloadElementAsPDF } from "../util/pdf.js";

export default function FormBuilder() {
  // ---------- Branding ----------
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");

  // ---------- Title & custom fields ----------
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

  // ---------- Intake: Records Required (defaults) ----------
  const defaultChecklist = {
    "Photo ID": false,
    "Birth Certificate": false,
    "Social Security Card": false,
    "Insurance Card (front/back)": false,
    "Medicaid Eligibility": false,
    "Medicare Eligibility": false,
    "HIPAA Notice Acknowledged": false,
    "Release of Information (PCP)": false,
    "Healthcare Proxy Document": false,
    "Guardian Documentation": false,
    "Emergency Contacts On File": false,
    "Assessments Completed": false,
    "Care Protocols On File": false,
    "Medication List / MAR": false,
  };
  const [checklist, setChecklist] = useState(defaultChecklist);
  const toggleChecklist = (k) =>
    setChecklist((prev) => ({ ...prev, [k]: !prev[k] }));

  // ---------- Intake: Insurance & Identifiers ----------
  const [insurance, setInsurance] = useState({
    payer: "",
    planType: "",
    policyNumber: "",
    groupNumber: "",
    medicareNumber: "",
    medicaidNumber: "",
  });
  const [identifiers, setIdentifiers] = useState({
    ssn: "",
    birthCertificateOnFile: false,
  });

  // ---------- Intake: Consents ----------
  const [consents, setConsents] = useState({
    pcp: false,
    guardian: false,
    healthcareProxy: false,
    generalCare: false,
    guardianName: "",
    proxyName: "",
  });

  // ---------- Intake: Emergency Contacts ----------
  const [contacts, setContacts] = useState([
    { name: "", relation: "", phone: "" },
    { name: "", relation: "", phone: "" },
  ]);
  const updateContact = (i, key, val) =>
    setContacts((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: val };
      return next;
    });

  // ---------- Intake: Assessments & Protocols ----------
  const [assessments, setAssessments] = useState({
    functionalDate: "",
    riskDate: "",
    allergies: "",
    mobilityNeeds: "",
    behaviorPlan: false,
    seizureProtocol: false,
    medAdminProtocol: false,
    otherProtocols: "",
  });

  // ---------- Custom builder controls ----------
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

  const onLogoChange = async (file) => {
    if (!file) return setLogoSrc("");
    const reader = new FileReader();
    reader.onload = () => setLogoSrc(reader.result.toString());
    reader.readAsDataURL(file);
  };

  return (
    <div className="layout">
      <div className="grid grid-2">
        {/* LEFT: Builder Panels */}
        <section className="card">
          <div className="kicker">Builder</div>
          <div className="h1">Form Structure</div>

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

          {/* Title */}
          <div style={{ margin: "12px 0" }}>
            <div className="label">Form Title</div>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Intake Essentials */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Client Intake Essentials</div>
            <div className="grid grid-2">
              {/* Insurance */}
              <div>
                <div className="label">Insurance</div>
                <input
                  className="input"
                  placeholder="Payer / Plan (e.g., BCBS PPO)"
                  value={insurance.payer}
                  onChange={(e) =>
                    setInsurance({ ...insurance, payer: e.target.value })
                  }
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="Plan Type"
                  value={insurance.planType}
                  onChange={(e) =>
                    setInsurance({ ...insurance, planType: e.target.value })
                  }
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="Policy #"
                  value={insurance.policyNumber}
                  onChange={(e) =>
                    setInsurance({ ...insurance, policyNumber: e.target.value })
                  }
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="Group #"
                  value={insurance.groupNumber}
                  onChange={(e) =>
                    setInsurance({ ...insurance, groupNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <div className="label">Medicare / Medicaid</div>
                <input
                  className="input"
                  placeholder="Medicare #"
                  value={insurance.medicareNumber}
                  onChange={(e) =>
                    setInsurance({
                      ...insurance,
                      medicareNumber: e.target.value,
                    })
                  }
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="Medicaid #"
                  value={insurance.medicaidNumber}
                  onChange={(e) =>
                    setInsurance({
                      ...insurance,
                      medicaidNumber: e.target.value,
                    })
                  }
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="SSN (ephemeral)"
                  value={identifiers.ssn}
                  onChange={(e) =>
                    setIdentifiers({ ...identifiers, ssn: e.target.value })
                  }
                  style={{ marginBottom: 8 }}
                />
                <label
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    checked={identifiers.birthCertificateOnFile}
                    onChange={(e) =>
                      setIdentifiers({
                        ...identifiers,
                        birthCertificateOnFile: e.target.checked,
                      })
                    }
                  />
                  Birth Certificate on file
                </label>
              </div>
            </div>
          </div>

          {/* Consents */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Consents</div>
            <div className="grid grid-2">
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={consents.pcp}
                  onChange={(e) =>
                    setConsents({ ...consents, pcp: e.target.checked })
                  }
                />
                Release to PCP
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={consents.generalCare}
                  onChange={(e) =>
                    setConsents({ ...consents, generalCare: e.target.checked })
                  }
                />
                Consent for Care
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={consents.guardian}
                  onChange={(e) =>
                    setConsents({ ...consents, guardian: e.target.checked })
                  }
                />
                Guardian Consent
              </label>
              <input
                className="input"
                placeholder="Guardian Name"
                value={consents.guardianName}
                onChange={(e) =>
                  setConsents({ ...consents, guardianName: e.target.value })
                }
              />
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={consents.healthcareProxy}
                  onChange={(e) =>
                    setConsents({
                      ...consents,
                      healthcareProxy: e.target.checked,
                    })
                  }
                />
                Healthcare Proxy Consent
              </label>
              <input
                className="input"
                placeholder="Proxy Name"
                value={consents.proxyName}
                onChange={(e) =>
                  setConsents({ ...consents, proxyName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Emergency contacts */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Emergency Contacts</div>
            <div className="grid grid-2">
              <div>
                <div className="label">Contact 1</div>
                <input
                  className="input"
                  placeholder="Name"
                  value={contacts[0].name}
                  onChange={(e) => updateContact(0, "name", e.target.value)}
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="Relation"
                  value={contacts[0].relation}
                  onChange={(e) => updateContact(0, "relation", e.target.value)}
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="Phone"
                  value={contacts[0].phone}
                  onChange={(e) => updateContact(0, "phone", e.target.value)}
                />
              </div>
              <div>
                <div className="label">Contact 2</div>
                <input
                  className="input"
                  placeholder="Name"
                  value={contacts[1].name}
                  onChange={(e) => updateContact(1, "name", e.target.value)}
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="Relation"
                  value={contacts[1].relation}
                  onChange={(e) => updateContact(1, "relation", e.target.value)}
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="Phone"
                  value={contacts[1].phone}
                  onChange={(e) => updateContact(1, "phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Assessments & Protocols */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Assessments & Protocols</div>
            <div className="grid grid-2">
              <div>
                <div className="label">Assessment Dates</div>
                <input
                  className="input"
                  type="date"
                  placeholder="Functional Assessment"
                  value={assessments.functionalDate}
                  onChange={(e) =>
                    setAssessments({
                      ...assessments,
                      functionalDate: e.target.value,
                    })
                  }
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  type="date"
                  placeholder="Risk Assessment"
                  value={assessments.riskDate}
                  onChange={(e) =>
                    setAssessments({ ...assessments, riskDate: e.target.value })
                  }
                />
              </div>
              <div>
                <div className="label">Health / Supports</div>
                <input
                  className="input"
                  placeholder="Allergies"
                  value={assessments.allergies}
                  onChange={(e) =>
                    setAssessments({
                      ...assessments,
                      allergies: e.target.value,
                    })
                  }
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="Mobility Needs"
                  value={assessments.mobilityNeeds}
                  onChange={(e) =>
                    setAssessments({
                      ...assessments,
                      mobilityNeeds: e.target.value,
                    })
                  }
                />
              </div>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={assessments.behaviorPlan}
                  onChange={(e) =>
                    setAssessments({
                      ...assessments,
                      behaviorPlan: e.target.checked,
                    })
                  }
                />
                Behavior Plan
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={assessments.seizureProtocol}
                  onChange={(e) =>
                    setAssessments({
                      ...assessments,
                      seizureProtocol: e.target.checked,
                    })
                  }
                />
                Seizure Protocol
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={assessments.medAdminProtocol}
                  onChange={(e) =>
                    setAssessments({
                      ...assessments,
                      medAdminProtocol: e.target.checked,
                    })
                  }
                />
                Medication Administration Protocol
              </label>
              <div style={{ gridColumn: "1 / -1" }}>
                <input
                  className="input"
                  placeholder="Other Protocols"
                  value={assessments.otherProtocols}
                  onChange={(e) =>
                    setAssessments({
                      ...assessments,
                      otherProtocols: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Required Records Checklist */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="kicker">Required Records (Before Service)</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                gap: 8,
              }}
            >
              {Object.keys(checklist).map((k) => (
                <label
                  key={k}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={!!checklist[k]}
                    onChange={() => toggleChecklist(k)}
                  />
                  {k}
                </label>
              ))}
            </div>
          </div>

          {/* Custom Fields  */}
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

        {/* RIGHT: Live PDF Preview */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">Live Form</div>
          <FormPreview
            title={title}
            fields={fields}
            logoSrc={logoSrc}
            orgName={orgName}
            intake={{
              checklist,
              insurance,
              identifiers,
              consents,
              contacts,
              assessments,
            }}
          />
        </section>
      </div>
    </div>
  );
}
