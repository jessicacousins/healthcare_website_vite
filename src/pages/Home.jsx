import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="layout">
      <div className="grid grid-2">
        {/* Welcome / Hero */}
        <section className="card hero">
          <div className="kicker">Welcome</div>
          <h1 className="hero-title">Healthcare Tools Hub</h1>

          <p className="hero-lede">
            A focused, education-grade toolkit for healthcare operations.
            Everything runs <strong>in your browser</strong>—no servers, no
            databases, no cookies, and no localStorage. Generate forms, convert
            PDFs, and produce admin documents with confidence.
          </p>

          <div className="badge-line">
            <span className="pill">Ephemeral • No Storage</span>
            <span className="pill">Client-Side Only</span>
            <span className="pill">Print & PDF Ready</span>
          </div>

          <div className="divider gradient"></div>

          <div className="hero-actions">
            <Link className="btn primary" to="/form-builder">
              Open Form Builder
            </Link>
            <Link className="btn" to="/pdf-tools">
              Open PDF Tools
            </Link>
            <Link className="btn" to="/templates">
              Browse Templates
            </Link>
            <Link className="btn" to="/admin-tools">
              Admin Tools
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="card disclaimer">
          <div className="kicker">Disclaimer</div>
          <h2 className="disclaimer-title">Not a Records System</h2>

          <p className="disclaimer-text">
            This site does <strong>not</strong> store, transmit, or retain
            Protected Health Information (PHI). It is a transient utility only.
            Download your outputs and file them in your organization’s approved
            systems.
          </p>

          <ul className="list-check">
            <li>Ephemeral: state resets on refresh</li>
            <li>No backend and no local persistence</li>
            <li>All conversions run locally in your browser</li>
          </ul>

          <div className="notice">
            Use your official EHR/EMR for PHI retention and signatures per
            policy.
          </div>
        </section>
      </div>

      {/* Core feature tiles */}
      <div style={{ marginTop: 18 }} className="grid grid-3">
        <div className="card">
          <div className="kicker">Create</div>
          <div className="h1">Build Fillable Forms</div>
          <p className="inline-help">
            Compose intake, consent, incident, or audit forms and export to PDF.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link className="btn" to="/form-builder">
              Open Form Builder
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="kicker">Convert</div>
          <div className="h1">Merge & Make PDFs</div>
          <p className="inline-help">
            Combine PDFs, turn images or text into PDFs—all client-side.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link className="btn" to="/pdf-tools">
              Open PDF Tools
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="kicker">Manage</div>
          <div className="h1">Admin Utilities</div>
          <p className="inline-help">
            Generate checklists and memos; download and file in your official
            systems.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link className="btn" to="/admin-tools">
              Open Admin Tools
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }} className="grid grid-3">
        <div className="card">
          <div className="kicker">Starter Blueprint</div>
          <div className="h1">Tour Form</div>
          <p className="inline-help">
            Capture pre-intake details during a program tour: client/guardian,
            contact info, priority, diagnoses, meds, ADLs, current services, and
            trauma-informed care—then export to PDF.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            <Link className="btn ok" to="/tour-form">
              Open Tour Form
            </Link>
            <Link className="btn ghost" to="/templates">
              More Blueprints
            </Link>
          </div>
        </div>
        <div className="card">
          <div className="kicker">HR & Compliance</div>
          <div className="h1">Staff Credential Checker</div>
          <p className="inline-help">
            Track CPR/MAP/CORI, OSHA/HIPAA, license expirations, and
            role-specific items. See due/expired at a glance and download a
            summary PDF.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link className="btn ok" to="/staff-compliance">
              Open Compliance Checker
            </Link>
          </div>
        </div>
        <div className="card">
          <div className="kicker">Readiness</div>
          <div className="h1">Case File Checklist</div>
          <p className="inline-help">
            MassHealth/department-run baseline checklist (identity, clinical,
            consents, plans, meds, safety, services) with a progress bar and PDF
            export. Paper or digital sources both supported.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link className="btn ok" to="/case-file-checklist">
              Open Case File Checklist
            </Link>
          </div>
        </div>
        {/* Home & Environmental Safety Assessment */}
        <div className="card">
          <div className="kicker">Home Safety</div>
          <div className="h1">Home & Environmental Safety</div>
          <p className="inline-help">
            Assess home readiness across environment, bathroom, kitchen, egress,
            mobility/DME, and risk factors. Mark N/A, track readiness %, and
            export to PDF.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link className="btn ok" to="/home-safety">
              Open Home Safety Assessment
            </Link>
          </div>
        </div>
        {/*  Billing */}
        <div className="card">
          <div className="kicker">Billing</div>
          <div className="h1">DDS & MassHealth Billing</div>
          <p className="inline-help">
            Add contract lines (payer, service, rate, <strong>15 units</strong>{" "}
            default), auto-calc line and grand totals, and export to PDF.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link className="btn ok" to="/billing">
              Open Billing Contracts
            </Link>
          </div>
        </div>
        /* Medication MAP */
        <div className="card">
          <div className="kicker">Medication</div>
          <div className="h1">MAP Generator</div>
          <p className="inline-help">
            Build a monthly MAP (med+time x day grid), add logo/header, initials
            key, PRN log — then export to PDF.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link className="btn ok" to="/mar">
              Open MAP Generator
            </Link>
          </div>
        </div>
        {/*  ABA Schedule */}
        <div className="card">
          <div className="kicker">ABA</div>
          <div className="h1">Schedule + Note</div>
          <p className="inline-help">
            Build a weekly ABA service schedule (with totals) and attach a
            structured session note. Export to PDF.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link className="btn ok" to="/aba-schedule">
              Open ABA Schedule
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
