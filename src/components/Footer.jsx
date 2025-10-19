import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="kicker">Privacy & Safety</div>
        <p>
          This site operates entirely in your browser.{" "}
          <strong>
            No backend, no databases, no cookies, and no localStorage
          </strong>
          . Your inputs are never transmitted or saved by this site. It is a
          temporary toolkit for generating documents on your device.
        </p>
        <p className="inline-help">
          Not a medical records system. Not a covered entity repository. Use
          official EHR/EMR for PHI retention. Ensure you follow your
          organization’s HIPAA policies when handling protected health
          information.
        </p>
        <div className="divider"></div>
        <p>
          © {new Date().getFullYear()} Healthcare Tools Hub — Education-grade
          utilities.
        </p>
      </div>
    </footer>
  );
}
