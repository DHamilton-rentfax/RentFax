"use client";

export default function IncidentForm({ onAdd }: any) {
  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-semibold">Add Incident</h3>

      <select id="type">
        <option value="extended_possession">Extended Possession</option>
        <option value="damage">Damage</option>
        <option value="accident">Accident</option>
        <option value="unauthorized_driver">Unauthorized Driver</option>
      </select>

      <input id="details" placeholder="Factual description only" />

      <button
        onClick={() =>
          onAdd({
            type: (document.getElementById("type") as any).value,
            description: (document.getElementById("details") as any).value
          })
        }
        className="bg-gray-800 text-white px-3 py-2"
      >
        Add Incident
      </button>
    </div>
  );
}