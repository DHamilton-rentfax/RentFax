import { POST } from "./route";
import { adminDb } from "@/firebase/server";
import { verifyApprovalToken } from "@/lib/memberId/generateApprovalToken";
import { enqueueMemberIdNotification } from "@/lib/notifications/enqueueMemberIdNotification";
import { firestore } from 'firebase-admin';

// Mock dependencies (firebase-admin is now mocked globally in jest.setup.ts)
jest.mock("@/firebase/server");
jest.mock("@/lib/memberId/generateApprovalToken");
jest.mock("@/lib/notifications/enqueueMemberIdNotification");

// Create typed mock references
const mockVerifyToken = verifyApprovalToken as jest.Mock;
const mockEnqueueNotification = enqueueMemberIdNotification as jest.Mock;
const mockRunTransaction = adminDb.runTransaction as jest.Mock;
const mockCollection = adminDb.collection as jest.Mock;


describe("POST /api/member-id/respond", () => {
  const requestId = "req-123";
  const token = "valid-token";
  const renterId = "renter-abc";
  const orgName = "Test Org";

  let tx: { get: jest.Mock; update: jest.Mock };
  let requestDocRef: object;
  let renterDocRef: object;

  beforeEach(() => {
    jest.clearAllMocks();

    mockVerifyToken.mockReturnValue(true);

    requestDocRef = { path: `memberIdRequests/${requestId}` };
    renterDocRef = { path: `renters/${renterId}` };

    mockCollection.mockImplementation((name: string) => {
      return {
        doc: (id: string) => {
            if (name === 'memberIdRequests') return requestDocRef;
            if (name === 'renters') return renterDocRef;
            return { path: `${name}/${id}` };
        }
      };
    });

    tx = { get: jest.fn(), update: jest.fn() };
    mockRunTransaction.mockImplementation(async (fn) => fn(tx));
  });

  it("approves a PENDING request", async () => {
    tx.get.mockResolvedValue({
      exists: true,
      data: () => ({
        status: "PENDING",
        expiresAt: { toMillis: () => Date.now() + 10_000 },
        renterId,
        orgName,
      }),
    });

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ requestId, token, action: "approve" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("APPROVED");
    expect(tx.update).toHaveBeenCalledWith(requestDocRef, expect.objectContaining({ status: "APPROVED" }));
    expect(mockEnqueueNotification).toHaveBeenCalledWith(requestId, renterId, orgName, "APPROVED");
  });

  it("denies a PENDING request and increments fraud signal", async () => {
    tx.get.mockResolvedValue({
      exists: true,
      data: () => ({
        status: "PENDING",
        expiresAt: { toMillis: () => Date.now() + 10_000 },
        renterId,
        orgName,
      }),
    });

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ requestId, token, action: "deny" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("DENIED");
    expect(tx.update).toHaveBeenCalledWith(requestDocRef, expect.objectContaining({ status: "DENIED" }));
    // Test that the fraud signal is being updated, without being brittle about the exact mock implementation
    expect(tx.update).toHaveBeenCalledWith(renterDocRef, expect.objectContaining({ fraudSignals: expect.anything() }));
    expect(mockEnqueueNotification).toHaveBeenCalledWith(requestId, renterId, orgName, "DENIED");
  });

  it("handles an expired request by setting status to EXPIRED", async () => {
    tx.get.mockResolvedValue({
      exists: true,
      data: () => ({
        status: "PENDING",
        expiresAt: { toMillis: () => Date.now() - 1 },
      }),
    });

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ requestId, token, action: "approve" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("EXPIRED");
    expect(tx.update).toHaveBeenCalledWith(requestDocRef, expect.objectContaining({ status: "EXPIRED" }));
  });
});