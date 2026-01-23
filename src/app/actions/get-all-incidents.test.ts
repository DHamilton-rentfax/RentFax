import { adminDb } from "@/firebase/server";

import { getAllIncidents } from "./get-all-incidents";

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

describe("getAllIncidents Server Action", () => {
  it("should return an empty array when no incidents are found", async () => {
    // Mock the Firestore response for an empty collection
    const collectionGroupMock = {
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ empty: true, docs: [] }),
    };
    (adminDb.collectionGroup as jest.Mock).mockReturnValue(collectionGroupMock);

    const incidents = await getAllIncidents();

    expect(incidents).toEqual([]);
    expect(adminDb.collectionGroup).toHaveBeenCalledWith("incidents");
    expect(collectionGroupMock.orderBy).toHaveBeenCalledWith(
      "createdAt",
      "desc",
    );
  });

  it("should correctly fetch and process incidents", async () => {
    // Define mock data that simulates Firestore documents
    const mockIncidents = [
      {
        id: "incident-1",
        data: () => ({
          type: "Late Rent",
          status: "open",
          createdAt: { toDate: () => new Date("2023-10-26T10:00:00Z") },
        }),
        ref: { parent: { parent: { id: "renter-A" } } },
      },
      {
        id: "incident-2",
        data: () => ({
          type: "Property Damage",
          status: "resolved",
          createdAt: { toDate: () => new Date("2023-10-25T15:30:00Z") },
        }),
        ref: { parent: { parent: { id: "renter-B" } } },
      },
    ];

    // Mock the Firestore response
    const collectionGroupMock = {
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ empty: false, docs: mockIncidents }),
    };
    (adminDb.collectionGroup as jest.Mock).mockReturnValue(collectionGroupMock);

    // Execute the action
    const incidents = await getAllIncidents();

    // Assertions
    expect(adminDb.collectionGroup).toHaveBeenCalledWith("incidents");
    expect(collectionGroupMock.orderBy).toHaveBeenCalledWith(
      "createdAt",
      "desc",
    );
    expect(incidents).toHaveLength(2);

    // Check the first incident
    expect(incidents[0]).toEqual({
      id: "incident-1",
      renterId: "renter-A",
      type: "Late Rent",
      status: "open",
      createdAt: new Date("2023-10-26T10:00:00Z").toISOString(),
    });

    // Check the second incident
    expect(incidents[1]).toEqual({
      id: "incident-2",
      renterId: "renter-B",
      type: "Property Damage",
      status: "resolved",
      createdAt: new Date("2023-10-25T15:30:00Z").toISOString(),
    });
  });

  it("should handle errors gracefully and return an empty array", async () => {
    // Mock a failure in the Firestore query
    const collectionGroupMock = {
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn().mockRejectedValue(new Error("Firestore query failed")), // Simulate an error
    };
    (adminDb.collectionGroup as jest.Mock).mockReturnValue(collectionGroupMock);

    // Mock console.error to prevent logging during tests
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const incidents = await getAllIncidents();

    // Assertions
    expect(incidents).toEqual([]); // Should return empty array on error
    expect(consoleErrorSpy).toHaveBeenCalled(); // Ensure error was logged

    // Restore original console.error
    consoleErrorSpy.mockRestore();
  });
});
