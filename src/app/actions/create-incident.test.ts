import { createIncident } from "./create-incident";
import { adminDB } from "@/firebase/server";
import { sendIncidentAlertEmail } from "@/lib/emails/sendIncidentAlert";

// Mock dependencies
jest.mock("@/firebase/server");
jest.mock("@/lib/emails/sendIncidentAlert");

describe("createIncident Server Action", () => {
  // Create typed mocks for easier use
  const mockedAdminDB = adminDB as jest.Mocked<typeof adminDB>;
  const mockedSendEmail = sendIncidentAlertEmail as jest.Mock;

  const mockRenterId = "renter-123";
  const mockIncidentInput = {
    renterId: mockRenterId,
    type: "LATE_RENT",
    description: "Rent was not paid on time.",
  };

  // Define mock objects for the Firestore structure
  const mockRenterDocRef = {
    get: jest.fn(),
    collection: jest.fn(),
  };
  const mockIncidentsCollectionRef = {
    doc: jest.fn(),
  };
  const mockIncidentDocRef = {
    id: "incident-456",
    set: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset and configure mocks for a clean slate before each test
    (mockedAdminDB.collection as jest.Mock).mockReturnValue({
      doc: () => mockRenterDocRef,
    });
    (mockRenterDocRef.collection as jest.Mock).mockReturnValue(
      mockIncidentsCollectionRef,
    );
    (mockIncidentsCollectionRef.doc as jest.Mock).mockReturnValue(
      mockIncidentDocRef,
    );
  });

  it("should create an incident and send an email notification", async () => {
    // Arrange: Mock a successful path
    mockRenterDocRef.get.mockResolvedValue({
      exists: true,
      data: () => ({ email: "test@example.com" }),
    });
    mockIncidentDocRef.set.mockResolvedValue(undefined);

    // Act: Call the server action
    const result = await createIncident(mockIncidentInput);

    // Assert: Verify the outcomes
    expect(result.success).toBe(true);
    expect(mockedAdminDB.collection).toHaveBeenCalledWith("renters");
    expect(mockRenterDocRef.get).toHaveBeenCalled();
    expect(mockIncidentDocRef.set).toHaveBeenCalled();
    expect(mockedSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
        id: "incident-456",
      }),
    );
  });

  it("should return an error if the renter is not found", async () => {
    // Arrange: Mock a scenario where the renter does not exist
    mockRenterDocRef.get.mockResolvedValue({ exists: false });

    // Act
    const result = await createIncident(mockIncidentInput);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("Renter not found");
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it("should return a validation error for invalid input", async () => {
    // Arrange: Use input that will fail Zod validation
    const invalidInput = { ...mockIncidentInput, description: "" };

    // Act
    const result = await createIncident(invalidInput);

    // Assert: Check for the specific validation error
    expect(result.success).toBe(false);
    expect(result.error).toBe("Description is required");
    expect(mockedSendEmail).not.toHaveBeenCalled();
    expect(mockedAdminDB.collection).not.toHaveBeenCalled(); // Ensure no DB call was made
  });
});
