import { getServerSession } from "next-auth";

export async function getAuthUser() {
  const session = await getServerSession();
  if (!session?.user) return null;
  return session.user; // must include role + uid in token claims
}
