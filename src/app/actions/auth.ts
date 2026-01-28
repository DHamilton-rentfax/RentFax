"use server";

/**
 * SERVER ACTION SAFE AUTH HELPERS
 *
 * IMPORTANT:
 * - No next/headers
 * - No Firebase Admin
 * - This file may be imported by pages
 * - Real auth happens in API routes
 */

export type CurrentUser = {
  uid: string;
  role?: string;
  companyId?: string;
} | null;

/**
 * Stubbed user resolver
 * Real auth should happen via API routes
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  // Intentionally returns null.
  // Auth resolution happens via /api/auth/me
  return null;
}