import { adminDb } from "@/firebase/server";

export async function getAllPublishedPosts() {
  const snapshot = await adminDb
    .collection("blogPosts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt,
    };
  });
}
