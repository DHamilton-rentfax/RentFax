"use server";

import { getAdminDb } from "@/firebase/server";

import { logAuditEvent } from "./log-audit";

export async function publishBlog(blogId: string, adminEmail: string) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const blogRef = adminDb.collection("blogs").doc(blogId);
    await blogRef.update({
      published: true,
      publishedAt: new Date().toISOString(),
    });

    await logAuditEvent({
      action: "BLOG_PUBLISHED",
      targetBlog: blogId,
      changedBy: adminEmail,
    });

    return { success: true };
  } catch (err) {
    console.error("Error publishing blog:", err);
    return { success: false, error: (err as Error).message };
  }
}
