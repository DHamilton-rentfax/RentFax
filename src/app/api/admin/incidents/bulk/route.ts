export async function POST(req: Request) {
  const { ids, action } = await req.json();

  for (const id of ids) {
    await updateDoc(doc(db, "incidents", id), {
      status: action === "close" ? "closed" : action,
      updatedAt: serverTimestamp()
    });
  }

  return NextResponse.json({ success: true });
}
