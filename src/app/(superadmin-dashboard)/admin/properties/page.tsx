"use client";
import { useEffect, useState } from "react";

export default function PropertiesDashboard() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("/api/properties/list")
      .then(r => r.json())
      .then(setList);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Properties</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((p) => (
          <div key={p.propertyId} className="p-6 border rounded-lg shadow">
            <h2 className="text-xl font-bold">{p.name}</h2>
            <p className="text-gray-600">{p.address}</p>

            <a
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
              href={`/admin/properties/${p.propertyId}`}
            >
              View Property →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
