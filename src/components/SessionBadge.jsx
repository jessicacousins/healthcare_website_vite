import React from "react";

export default function SessionBadge() {
  return (
    <span
      className="tag"
      role="status"
      aria-live="polite"
      title="This site does not store or transmit your inputs."
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 99,
          background: "var(--ok)",
        }}
      />
      Ephemeral Session • No Storage
    </span>
  );
}
