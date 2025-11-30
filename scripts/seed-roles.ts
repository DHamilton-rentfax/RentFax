import { adminDB } from "../src/firebase/server"; // Adjust path as needed
import { DefaultRoleMap } from "../src/types";

async function seedRoles() {
  console.log("Seeding Firestore with default roles...");

  const rolesCollection = adminDB.collection("roles");

  for (const roleKey in DefaultRoleMap) {
    if (Object.prototype.hasOwnProperty.call(DefaultRoleMap, roleKey)) {
      const role = DefaultRoleMap[roleKey as keyof typeof DefaultRoleMap];
      try {
        await rolesCollection.doc(roleKey).set(role);
        console.log(`Successfully seeded role: ${role.name}`);
      } catch (error) {
        console.error(`Error seeding role ${role.name}:`, error);
      }
    }
  }

  console.log("Role seeding complete.");
}

seedRoles().catch(console.error);
