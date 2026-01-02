"use client";
import { useEffect, useState } from "react";

export default function PropertyDetail({ params }) {
  const [units, setUnits] = useState([]);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetch(`/api/properties/${params.propertyId}`)
      .then(r => r.json())
      .then(data => {
        setProperty(data.property);
        setUnits(data.units);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{property?.name}</h1>
      <p>{property?.address}</p>

      <h2 className="text-xl font-bold mt-6">Units</h2>

      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Status</th>
            <th>Renter</th>
            <th>Incidents</th>
          </tr>
        </thead>

        <tbody>
          {units.map((u) => (
            <tr key={u.unitId} className="border-b">
              <td>{u.number}</td>
              <td>{u.status}</td>
              <td>{u.renterName || "Vacant"}</td>
              <td>{u.incidentCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
