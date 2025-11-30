"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const TenantThemeContext = createContext<any>(null);

export function TenantThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    const cookie = Cookies.get("tenant_data");
    if (cookie) {
      try {
        const parsed = JSON.parse(cookie);
        setTheme(parsed);
      } catch (e) {
        console.error("Bad tenant cookie", e);
      }
    }
  }, []);

  return (
    <TenantThemeContext.Provider value={theme}>
      {children}
    </TenantThemeContext.Provider>
  );
}

export const useTenantTheme = () => useContext(TenantThemeContext);
