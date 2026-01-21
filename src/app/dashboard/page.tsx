import { redirect } from "next/navigation";

/**
 * This page is now a simple entry point.
 * - Session checks are handled by middleware
 * - Role-based routing is centralized in /post-auth
 */
export default function DashboardPage() {
  redirect("/post-auth");
}
