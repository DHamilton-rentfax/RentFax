'use client';

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';

import { db, storage } from '@/firebase/client';

export default function UploadPhotosSection({ assetId }: any) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const storageRef = ref(storage, `assets/${assetId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await updateDoc(doc(db, 'assets', assetId), { photos: arrayUnion(url) });
    setLoading(false);
    alert('Photo uploaded!');
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-2">Photos</h2>
      <input type="file" onChange={handleUpload} disabled={loading} />
      {loading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
    </div>
  );
}
