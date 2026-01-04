import { firestore } from "firebase-admin";

describe("Firebase Admin Mock", () => {
    it("exposes FieldValue.increment", () => {
        expect(typeof firestore.FieldValue.increment).toBe("function");
    });
});
