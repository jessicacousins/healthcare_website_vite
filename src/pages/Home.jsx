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

        {/*  Disclaimer */}
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

      <div style={{ marginTop: 18 }} className="grid grid-3">
        <div className="card">
          <div className="kicker">Create</div>
          <div className="h1">Build Fillable Forms</div>
          <p className="inline-help">
            Compose intake, consent, incident, or audit forms and export to PDF.
          </p>
        </div>
        <div className="card">
          <div className="kicker">Convert</div>
          <div className="h1">Merge & Make PDFs</div>
          <p className="inline-help">
            Combine PDFs, turn images or text into PDFs—all client-side.
          </p>
        </div>
        <div className="card">
          <div className="kicker">Manage</div>
          <div className="h1">Admin Utilities</div>
          <p className="inline-help">
            Generate checklists and memos; download and file in your official
            systems.
          </p>
        </div>
      </div>
    </div>
  );
}
