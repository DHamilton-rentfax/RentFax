
import { NextResponse } from "next/server";
import { adminStorage } from "@/firebase/server";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const postId = formData.get("postId") as string;

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = `blog-images/${postId}/${uuid()}`;

  const bucket = adminStorage.bucket();
  const fileRef = bucket.file(filePath);

  await fileRef.save(buffer, {
    metadata: { contentType: file.type },
  });

  const url = await fileRef.getSignedUrl({
    action: "read",
    expires: "03-01-2030",
  });

  return NextResponse.json({ url: url[0] });
}
