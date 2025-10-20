import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSession } from "../context/SessionContext.jsx";
import SessionBadge from "./SessionBadge.jsx";

export default function Navbar() {
  const { searchQuery, setSearchQuery, flagged } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (e) => {
    e.preventDefault();

    if (location.pathname !== "/templates") navigate("/templates");
  };

  return (
    <div className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand" aria-label="Healthcare Tools Hub Home">
          <div className="brand-badge" aria-hidden="true" />

          <span>Healthcare Tools Hub</span>
        </Link>

        <form
          className="search"
          onSubmit={onSubmit}
          role="search"
          aria-label="Search templates and tools"
        >
          <svg width="16" height="16" aria-hidden="true">
            <circle
              cx="7"
              cy="7"
              r="6"
              stroke="white"
              fill="none"
              strokeOpacity=".4"
            />
            <line
              x1="11.5"
              y1="11.5"
              x2="15.5"
              y2="15.5"
              stroke="white"
              strokeOpacity=".4"
            />
          </svg>
          <input
            placeholder="Search templates, tools, pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="nav-actions">
          <NavLink className="btn ghost" to="/templates">
            Templates
          </NavLink>
          <NavLink className="btn ghost" to="/form-builder">
            Form Builder
          </NavLink>
          <NavLink className="btn ghost" to="/pdf-tools">
            PDF Tools
          </NavLink>
          <NavLink className="btn ghost" to="/admin-tools">
            Admin
          </NavLink>
          <NavLink className="btn ghost" to="/tour-form">
            Tour Form
          </NavLink>
          <NavLink className="btn" to="/case-file-checklist">
            Case File Checklist
          </NavLink>

          <NavLink className="btn" to="/staff-compliance">
            Compliance Checker
          </NavLink>

          <NavLink className="btn ghost" to="/flagged">
            Flagged ({flagged.size})
          </NavLink>

          <SessionBadge />
        </div>
      </div>
    </div>
  );
}
