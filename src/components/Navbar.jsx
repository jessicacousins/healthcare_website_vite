import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSession } from "../context/SessionContext.jsx";

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useSession();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main">
      <div className="nav-inner">
        {/* Brand */}
        <Link to="/" className="brand" onClick={close} aria-label="Home">
          <span className="brand-badge" aria-hidden="true" />
          <span>Healthcare Tools</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links desktop-only">
          <NavLink className="nav-link" to="/templates">
            Templates
          </NavLink>
          <NavLink className="nav-link" to="/form-builder">
            Form Builder
          </NavLink>
          <NavLink className="nav-link" to="/pdf-tools">
            PDF Tools
          </NavLink>
          <NavLink className="nav-link" to="/admin-tools">
            Admin
          </NavLink>
          <NavLink className="nav-link" to="/tour-form">
            Tour Form
          </NavLink>
          <NavLink className="nav-link" to="/staff-compliance">
            Compliance
          </NavLink>
          <NavLink className="nav-link" to="/case-file-checklist">
            Case Files
          </NavLink>
          <NavLink className="nav-link" to="/home-safety">
            Home Safety
          </NavLink>
        </div>

        {/* Desktop search */}
        <div className="nav-actions desktop-only">
          <div className="search" role="search">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21 20.3l-4.2-4.2a7 7 0 10-1.4 1.4L20.3 21 21 20.3zM5 11a6 6 0 1112 0A6 6 0 015 11z"
              />
            </svg>
            <input
              aria-label="Search templates"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="nav-toggle mobile-only"
          aria-label="Open menu"
          aria-controls="nav-drawer"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>

      {/* Drawer */}
      <div
        id="nav-drawer"
        className={`nav-drawer ${open ? "show" : ""}`}
        onClick={close}
      >
        <div
          className="nav-drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-head">
            <div className="brand small">
              <span className="brand-badge" aria-hidden="true" />
              <span>Healthcare Tools</span>
            </div>
            <button
              className="nav-close"
              aria-label="Close menu"
              onClick={close}
            >
              ×
            </button>
          </div>

          <div className="drawer-search">
            <div className="search" role="search">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M21 20.3l-4.2-4.2a7 7 0 10-1.4 1.4L20.3 21 21 20.3zM5 11a6 6 0 1112 0A6 6 0 015 11z"
                />
              </svg>
              <input
                aria-label="Search templates"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="drawer-links">
            <NavLink className="nav-link" to="/" onClick={close}>
              Home
            </NavLink>
            <NavLink className="nav-link" to="/templates" onClick={close}>
              Templates
            </NavLink>
            <NavLink className="nav-link" to="/form-builder" onClick={close}>
              Form Builder
            </NavLink>
            <NavLink className="nav-link" to="/pdf-tools" onClick={close}>
              PDF Tools
            </NavLink>
            <NavLink className="nav-link" to="/admin-tools" onClick={close}>
              Admin
            </NavLink>
            <NavLink className="nav-link" to="/tour-form" onClick={close}>
              Tour Form
            </NavLink>
            <NavLink
              className="nav-link"
              to="/staff-compliance"
              onClick={close}
            >
              Compliance
            </NavLink>
            <NavLink
              className="nav-link"
              to="/case-file-checklist"
              onClick={close}
            >
              Case Files
            </NavLink>
          </div>

          <div className="drawer-footer">
            <div className="inline-help">
              Ephemeral • No storage • Client-side only
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
