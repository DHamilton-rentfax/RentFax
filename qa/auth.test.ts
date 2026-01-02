import request from "supertest";
import { getAdminToken, getUserToken } from "./utils/tokens";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

jest.setTimeout(15000); // Prevent hangs in CI / Firebase auth

describe("API Authentication and Authorization", () => {
  describe("/api/admin/ledger/query", () => {
    it("returns 401 for requests without a token", async () => {
      const res = await request(API_URL)
        .post("/api/admin/ledger/query")
        .send({});

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Unauthorized");
    });

    it("returns 403 for non-admin users", async () => {
      const userToken = await getUserToken();

      const res = await request(API_URL)
        .post("/api/admin/ledger/query")
        .set("Authorization", `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.error).toBe("Forbidden");
    });

    it("allows admin users to query the ledger", async () => {
      const adminToken = await getAdminToken();

      const res = await request(API_URL)
        .post("/api/admin/ledger/query")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ limit: 1 });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.entries)).toBe(true);
    });
  });

  describe("/api/admin/ledger/export", () => {
    it("returns 401 for export without a token", async () => {
      const res = await request(API_URL)
        .post("/api/admin/ledger/export")
        .send({});

      expect(res.status).toBe(401);
    });

    it("returns 403 for export with non-admin token", async () => {
      const userToken = await getUserToken();

      const res = await request(API_URL)
        .post("/api/admin/ledger/export")
        .set("Authorization", `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(403);
    });

    it("exports CSV for admin users", async () => {
      const adminToken = await getAdminToken();

      const res = await request(API_URL)
        .post("/api/admin/ledger/export")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.header["content-type"]).toContain("text/csv");

      // Validate CSV structure
      const lines = res.text.split("\n");
      expect(lines[0]).toContain("createdAt");
      expect(lines[0]).toContain("action");
      expect(lines.length).toBeGreaterThanOrEqual(1);
    });
  });
});
