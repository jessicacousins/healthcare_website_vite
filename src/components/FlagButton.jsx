import React from "react";
import { useSession } from "../context/SessionContext.jsx";

export default function FlagButton({ id, label = "Flag" }) {
  const { flagged, toggleFlag } = useSession();
  const isActive = flagged.has(id);
  return (
    <button
      className={`btn ${isActive ? "warn" : "ghost"}`}
      aria-pressed={isActive}
      onClick={() => toggleFlag(id)}
      title={isActive ? "Unflag" : "Flag for quick access"}
    >
      {isActive ? "Unflag" : "Flag"}
    </button>
  );
}
