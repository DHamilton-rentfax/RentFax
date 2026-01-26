// src/lib/auth-admin-middleware.ts

export async function authAdminMiddleware(
  req: Request,
  requiredRoles: string[]
): Promise<{ uid: string; roles: string[] } | null> {
  // DEV MODE: bypassed
  console.log("DEV MODE: authAdminMiddleware bypassed");

  return {
    uid: "dev-admin",
    roles: requiredRoles,
  };
}