import { faker } from "@faker-js/faker";

export interface Renter {
  id: string;
  name: string;
  email: string;
  status: "Good Standing" | "High Risk" | "Pending";
  riskScore: number;
  totalIncidents: number;
  imageUrl: string;
  licenseNumber: string;
  licenseState: string;
  dob: string;
}

export interface Rental {
  id: string;
  renterId: string;
  vehicle: string;
  startAt: string;
  endAt: string;
  status: "active" | "completed" | "cancelled" | "overdue";
}

export interface Incident {
  id: string;
  rentalId: string;
  type: "Damage" | "Late Return" | "Non-Payment" | "Smoking" | "Other";
  description: string;
  date: string;
  amount: number;
  resolved: boolean;
}

const createMockRenter = (): Renter => {
  const riskScore = faker.number.int({ min: 10, max: 100 });
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    status: riskScore > 75 ? "High Risk" : "Good Standing",
    riskScore,
    totalIncidents: faker.number.int({ min: 0, max: 5 }),
    imageUrl: `https://placehold.co/64x64.png?text=${faker.person.initials()}`,
    licenseNumber: faker.string.alphanumeric(8).toUpperCase(),
    licenseState: faker.location.state({ abbreviated: true }),
    dob: faker.date.birthdate().toISOString().split("T")[0],
  };
};

const createMockRental = (renterId: string): Rental => {
  const startAt = faker.date.recent({ days: 30 });
  const endAt = faker.date.future({ refDate: startAt });
  return {
    id: faker.string.uuid(),
    renterId,
    vehicle: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    status: faker.helpers.arrayElement([
      "active",
      "completed",
      "cancelled",
      "overdue",
    ]),
  };
};

const createMockIncident = (rentalId: string): Incident => {
  return {
    id: faker.string.uuid(),
    rentalId,
    type: faker.helpers.arrayElement([
      "Damage",
      "Late Return",
      "Non-Payment",
      "Smoking",
      "Other",
    ]),
    description: faker.lorem.sentence(),
    date: faker.date.recent({ days: 10 }).toISOString(),
    amount: faker.number.float({ min: 50, max: 1000, precision: 0.01 }),
    resolved: faker.datatype.boolean(),
  };
};

export const generateMockData = (
  type: "renters" | "rentals" | "incidents" | "all",
  count: number = 10,
) => {
  if (type === "renters") {
    return Array.from({ length: count }, createMockRenter);
  }

  if (type === "all") {
    const renters = Array.from({ length: count }, createMockRenter);
    const rentals = renters.flatMap((renter) =>
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
        createMockRental(renter.id),
      ),
    );
    const incidents = rentals.flatMap((rental) =>
      Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () =>
        createMockIncident(rental.id),
      ),
    );
    return { renters, rentals, incidents };
  }

  return [];
};
