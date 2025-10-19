import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * Ephemeral session context:
 * - searchQuery: global quick search query string
 * - flagged: in-memory set of ids (clears on reload)
 *  NO localStorage / NO backend 
 */
const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [flagged, setFlagged] = useState(() => new Set());

  const toggleFlag = (id) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const value = useMemo(
    () => ({ searchQuery, setSearchQuery, flagged, toggleFlag }),
    [searchQuery, flagged]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
