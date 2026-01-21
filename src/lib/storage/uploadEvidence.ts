// Placeholder for Firebase Storage upload
export const uploadEvidence = async ({
  file,
  incidentId,
  renterId,
}: {
  file: File;
  incidentId: string;
  renterId?: string;
}) => {
  console.log("Uploading file to mock storage:", file.name);
  await new Promise(resolve => setTimeout(resolve, 1000));

  const storagePath = `evidence/${incidentId}/${file.name}`;
  const downloadURL = `https://firebasestorage.googleapis.com/v0/b/rentfax-dev.appspot.com/o/${encodeURIComponent(
    storagePath
  )}?alt=media`;

  return { storagePath, downloadURL };
};
