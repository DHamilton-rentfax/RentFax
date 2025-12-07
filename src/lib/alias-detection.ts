import { Firestore } from "firebase-admin/firestore";

export async function findAliasMatches(db: Firestore, renter: any) {
  const { fullName, email, phone } = renter;

  const queries = [];

  if (fullName) {
    queries.push(
      db
        .collection("renters")
        .where("searchName", "==", fullName.toLowerCase().trim())
        .get()
    );
  }

  if (email) {
    queries.push(
      db.collection("renters").where("email", "==", email.toLowerCase()).get()
    );
  }

  if (phone) {
    queries.push(
      db.collection("renters").where("phone", "==", phone).get()
    );
  }

  const results = await Promise.all(queries);

  const matches: any[] = [];
  for (const snap of results) snap.forEach((doc) => matches.push(doc.data()));

  // unique
  const unique = matches.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
  );

  return unique;
}
