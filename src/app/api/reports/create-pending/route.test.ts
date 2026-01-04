import { POST } from "./route";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/firebase/server";
import { hasActiveConsent } from "@/lib/memberId/hasActiveConsent";
import { getEffectiveOrgId } from "@/lib/auth/getEffectiveOrgId";

jest.mock("next/headers", () => ({ cookies: jest.fn() }));

jest.mock("@/firebase/server", () => {
  return {
    adminAuth: {
      verifySessionCookie: jest.fn(),
    },
    adminDb: {
      collection: jest.fn(),
      runTransaction: jest.fn(),
    },
  };
});

jest.mock("@/lib/memberId/hasActiveConsent", () => ({
  hasActiveConsent: jest.fn(),
}));

jest.mock("@/lib/auth/getEffectiveOrgId", () => ({
  getEffectiveOrgId: jest.fn(),
}));

const mockCookies = cookies as jest.Mock;
const mockVerifySessionCookie = adminAuth.verifySessionCookie as jest.Mock;
const mockHasActiveConsent = hasActiveConsent as jest.Mock;
const mockGetEffectiveOrgId = getEffectiveOrgId as jest.Mock;

const mockCollection = adminDb.collection as jest.Mock;
const mockRunTransaction = adminDb.runTransaction as jest.Mock;

describe("POST /api/reports/create-pending", () => {
  const renterId = "test-renter";
  const sessionCookie = "valid-cookie";
  const decodedToken = { uid: "admin-123", orgId: "test-org" };

  let reportsDocRef: { id: string; set: jest.Mock };
  let reportsSetMock: jest.Mock;
  let txGetMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCookies.mockReturnValue({
      get: jest.fn((name: string) =>
        name === "__session" ? { value: sessionCookie } : undefined
      ),
    });

    mockVerifySessionCookie.mockResolvedValue(decodedToken);
    mockGetEffectiveOrgId.mockResolvedValue("test-org");

    reportsSetMock = jest.fn().mockResolvedValue(undefined);
    reportsDocRef = { id: "new-report-id", set: reportsSetMock };

    txGetMock = jest.fn();

    mockRunTransaction.mockImplementation(async (fn: any) => {
        const tx = {
            get: txGetMock,
            set: (ref: any, data: any) => ref.set(data),
        };
        return fn(tx);
    });
    
    // Default successful verification
    const identityRequestsCollection = {
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({ 
            empty: false, 
            docs: [{ id: 'verification-id' }]
        }),
    };

    const reportsCollection = {
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnValue(reportsDocRef),
        get: jest.fn(), // This will be configured per-test
    };

    mockCollection.mockImplementation((name: string) => {
        if (name === 'identityRequests') return identityRequestsCollection;
        if (name === 'reports') return reportsCollection;
        return {};
    });
  });

  it("creates a pending report when consent is granted and no pending report exists", async () => {
    mockHasActiveConsent.mockResolvedValue(true);

    // Mock transaction reads:
    // 1. NOT_VERIFIED check (passes)
    // 2. PENDING_EXISTS check (passes - no existing report)
    // 3. PENDING_LIMIT check (passes - not at limit)
    txGetMock.mockResolvedValue({ empty: true }); // for PENDING_EXISTS
    txGetMock.mockResolvedValueOnce({ empty: false, docs: [{id: 'verification-id'}] }); // for NOT_VERIFIED
    txGetMock.mockResolvedValueOnce({ empty: true }); // for PENDING_EXISTS
    txGetMock.mockResolvedValueOnce({ size: 0 }); // for PENDING_LIMIT

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ renterId }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.reportId).toBe("new-report-id");
    expect(reportsSetMock).toHaveBeenCalledTimes(1);
  });

  it("returns 409 if a pending report already exists", async () => {
    mockHasActiveConsent.mockResolvedValue(true);

    // Mock transaction reads:
    // 1. NOT_VERIFIED check (passes)
    // 2. PENDING_EXISTS check (fails - a report exists)
    txGetMock.mockResolvedValueOnce({ empty: false, docs: [{id: 'verification-id'}] });
    txGetMock.mockResolvedValueOnce({ empty: false, docs: [{id: 'existing-report'}] });

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ renterId }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(409);
    expect(body.error).toBe("A pending report already exists for this renter");
    expect(reportsSetMock).not.toHaveBeenCalled();
  });

  it("returns 429 if pending report limit is exceeded", async () => {
    mockHasActiveConsent.mockResolvedValue(true);

    // Mock transaction reads:
    // 1. NOT_VERIFIED check (passes)
    // 2. PENDING_EXISTS check (passes)
    // 3. PENDING_LIMIT check (fails)
    txGetMock.mockResolvedValueOnce({ empty: false, docs: [{id: 'verification-id'}] });
    txGetMock.mockResolvedValueOnce({ empty: true });
    txGetMock.mockResolvedValueOnce({ size: 3 }); // MAX_PENDING_REPORTS is 3

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ renterId }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(429);
    expect(body.error).toBe("Pending report limit reached");
    expect(reportsSetMock).not.toHaveBeenCalled();
  });
});