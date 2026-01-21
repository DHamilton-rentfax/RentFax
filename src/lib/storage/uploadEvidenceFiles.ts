export async function uploadEvidenceFiles(files: File[]) {
  console.log("Uploading files with mock function:", files.map(f => f.name));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const uploads = files.map(file => {
    const path = `evidence/${crypto.randomUUID()}-${file.name}`;
    const url = `https://mock-storage.com/${path}`;

    return {
      name: file.name,
      path,
      url,
      type: file.type,
    };
  });

  return uploads;
}
