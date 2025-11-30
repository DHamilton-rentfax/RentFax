
import { PublicDataProvider, PublicDataResult } from "./PublicDataProvider";

export class PiplProvider implements PublicDataProvider {
  async search(input: any): Promise<PublicDataResult> {
    try {
      // REAL API integration (swap with real endpoint)
      // const response = await fetch("https://api.pipl.com/search", { ... })

      // MOCK until we turn API on:
      return {
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        address: input.address,
        aliases: ["Johnathan Doe", "J Doe"],
        dob: "1989-04-20",
        age: 36,
        associatedPeople: ["Jane Doe", "Michael Doe"],
        addresses: [input.address, "123 Previous Lane"],
        matchScore: 88,
        raw: { mock: true, input },
      };
    } catch (error) {
      console.error("PiplProvider error:", error);
      return {
        matchScore: 0,
        raw: null,
      };
    }
  }
}
