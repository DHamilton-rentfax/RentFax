import {
  ref,
  uploadBytes,
  getDownloadURL,
  updateMetadata,
} from "firebase/storage";
import { User } from "firebase/auth";

import { storage, auth } from "@/firebase/client";

export const uploadEvidenceFiles = async (
  disputeId: string,
  files: File[],
  user: User,
): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of files) {
    const storageRef = ref(
      storage,
      `evidence/${disputeId}/${Date.now()}-${file.name}`,
    );

    // Set metadata during upload
    await uploadBytes(storageRef, file, {
      customMetadata: {
        actorUid: user.uid,
        actorEmail: user.email || "unknown",
      },
    });

    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }
  return urls;
};
