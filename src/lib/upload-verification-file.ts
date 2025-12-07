import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/client";

export async function uploadVerificationFile(
  token: string,
  type: string,
  file: File
) {
  const path = `identity-verifications/${token}/${type}-${Date.now()}`;

  const fileRef = ref(storage, path);

  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
}
