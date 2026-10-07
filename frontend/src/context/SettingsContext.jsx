import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const refresh = () => api.get("/settings").then((r) => setSettings(r.data)).catch(() => {});
  useEffect(() => { refresh(); }, []);
  return (
    <SettingsContext.Provider value={{ settings: settings || {}, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
