import { hasActiveConsent } from "./hasActiveConsent";
import { adminDb } from "@/firebase/server";

jest.mock("@/firebase/server", () => {
  const getMock = jest.fn();

  const queryMock = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: getMock,
  };

  return {
    adminDb: {
      collection: jest.fn(() => queryMock),
    },
    __getMock: getMock,
    __queryMock: queryMock,
  };
});

const { __getMock: mockGet, __queryMock: query } = require("@/firebase/server");

describe("hasActiveConsent", () => {
  const orgId = "org-123";
  const renterId = "renter-abc";

  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReset();
    query.where.mockClear();
    query.orderBy.mockClear();
    query.limit.mockClear();
  });

  it("returns true when an APPROVED request exists", async () => {
    mockGet.mockResolvedValue({
      empty: false,
      docs: [{ id: "req1", data: () => ({ status: "APPROVED" }) }],
    });

    const result = await hasActiveConsent(orgId, renterId);

    expect(result).toBe(true);
    expect(adminDb.collection).toHaveBeenCalledWith("memberIdRequests");
    expect(query.where).toHaveBeenCalledWith("orgId", "==", orgId);
    expect(query.where).toHaveBeenCalledWith("renterId", "==", renterId);
  });

  it("returns false when no requests exist (empty snapshot)", async () => {
    mockGet.mockResolvedValue({ empty: true, docs: [] });

    const result = await hasActiveConsent(orgId, renterId);

    expect(result).toBe(false);
  });

  it("fails closed and logs when Firestore throws", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Firestore failure");

    mockGet.mockRejectedValue(error);

    const result = await hasActiveConsent(orgId, renterId);

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith("Consent check failed:", error);

    consoleSpy.mockRestore();
  });
});