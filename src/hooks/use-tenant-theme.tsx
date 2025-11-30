"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export interface TenantTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface TenantInfo {
  id: string;
  name: string;
  logoUrl?: string;
  theme?: TenantTheme;
  domain?: string | null;
  status?: string;
}

interface UseTenantThemeResult {
  loading: boolean;
  error: string | null;
  tenant: TenantInfo | null;
  theme: TenantTheme;
}

const DEFAULT_THEME: TenantTheme = {
  primary: "#111827", // slate-900
  secondary: "#4B5563", // gray-600
  background: "#FFFFFF",
  text: "#111827",
};

export function useTenantTheme(tenantId?: string | string[]): UseTenantThemeResult {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [theme, setTheme] = useState<TenantTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState<boolean>(!!tenantId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    const id = Array.isArray(tenantId) ? tenantId[0] : tenantId;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const ref = doc(db, "companies", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("Company not found");
          setTenant(null);
          setTheme(DEFAULT_THEME);
          return;
        }

        const data = snap.data() as any;

        const tenantInfo: TenantInfo = {
          id,
          name: data.name || "Company",
          logoUrl: data.logoUrl,
          domain: data.domain || null,
          status: data.status,
          theme: data.theme,
        };

        setTenant(tenantInfo);

        const themeData: TenantTheme = {
          primary: data.theme?.primary || DEFAULT_THEME.primary,
          secondary: data.theme?.secondary || DEFAULT_THEME.secondary,
          background: data.theme?.background || DEFAULT_THEME.background,
          text: data.theme?.text || DEFAULT_THEME.text,
        };

        setTheme(themeData);
      } catch (err: any) {
        console.error("Error loading tenant theme:", err);
        setError("Failed to load company theme");
        setTenant(null);
        setTheme(DEFAULT_THEME);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tenantId]);

  return { loading, error, tenant, theme };
}
