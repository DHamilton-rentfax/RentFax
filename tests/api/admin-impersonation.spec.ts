it("starts and exits impersonation safely", async () => {
  const token = await getSuperAdminToken();

  const start = await fetch("/api/admin/impersonate/start", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orgId: "org_test", reason: "support" }),
  });

  expect(start.status).toBe(200);

  const status = await fetch("/api/admin/impersonate/status", {
    headers: { authorization: `Bearer ${token}` },
  });

  const data = await status.json();
  expect(data.active).toBe(true);

  await fetch("/api/admin/impersonate/exit", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
  });

  const after = await fetch("/api/admin/impersonate/status", {
    headers: { authorization: `Bearer ${token}` },
  });

  expect((await after.json()).active).toBe(false);
});
