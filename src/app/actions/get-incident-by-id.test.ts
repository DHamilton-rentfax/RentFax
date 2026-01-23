import { adminDb } from "@/firebase/server";

import { getIncidentById } from "./get-incident-by-id";

// Mock the adminDb for testing purposes
jest.mock("@/firebase/server", () => ({
  adminDb: {
    collectionGroup: jest.fn(),
  },
}));

// Before each test, clear mock history
beforeEach(() => {
  jest.clearAllMocks();
});

describe("getIncidentById Server Action", () => {
  it("should return null when no incident is found", async () => {
    // Mock the Firestore response for an empty collection
    const collectionGroupMock = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ empty: true, docs: [] }),
    };
    (adminDb.collectionGroup as jest.Mock).mockReturnValue(collectionGroupMock);

    const incident = await getIncidentById("non-existent-id");

    expect(incident).toBeNull();
    expect(adminDb.collectionGroup).toHaveBeenCalledWith("incidents");
    expect(collectionGroupMock.where).toHaveBeenCalledWith(
      "id",
      "==",
      "non-existent-id",
    );
  });

  it("should correctly fetch and process a single incident", async () => {
    // Define mock data that simulates a Firestore document
    const mockIncident = {
      id: "incident-123",
      data: () => ({
        type: "Late Rent",
        status: "open",
        description: "Tenant has not paid rent for the current month.",
        createdAt: { toDate: () => new Date("2023-11-15T12:00:00Z") },
        evidence: ["link1", "link2"],
      }),
      ref: { parent: { parent: { id: "renter-XYZ" } } },
    };

    // Mock the Firestore response
    const collectionGroupMock = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ empty: false, docs: [mockIncident] }),
    };
    (adminDb.collectionGroup as jest.Mock).mockReturnValue(collectionGroupMock);

    // Execute the action
    const incident = await getIncidentById("incident-123");

    // Assertions
    expect(adminDb.collectionGroup).toHaveBeenCalledWith("incidents");
    expect(collectionGroupMock.where).toHaveBeenCalledWith(
      "id",
      "==",
      "incident-123",
    );
    expect(incident).not.toBeNull();
    expect(incident).toEqual({
      id: "incident-123",
      renterId: "renter-XYZ",
      type: "Late Rent",
      status: "open",
      description: "Tenant has not paid rent for the current month.",
      createdAt: new Date("2023-11-15T12:00:00Z").toISOString(),
      evidence: ["link1", "link2"],
    });
  });

  it("should handle errors gracefully and return null", async () => {
    // Mock a failure in the Firestore query
    const collectionGroupMock = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockRejectedValue(new Error("Firestore query failed")), // Simulate an error
    };
    (adminDb.collectionGroup as jest.Mock).mockReturnValue(collectionGroupMock);

    // Mock console.error to prevent logging during tests
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const incident = await getIncidentById("any-id");

    // Assertions
    expect(incident).toBeNull(); // Should return null on error
    expect(consoleErrorSpy).toHaveBeenCalled(); // Ensure error was logged

    // Restore original console.error
    consoleErrorSpy.mockRestore();
  });
});
