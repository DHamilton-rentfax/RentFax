export function IncidentTimeline({ events }) {
  return (
    <ol className="relative border-l border-gray-300 ml-4">
      {events.map((e, i) => (
        <li key={i} className="mb-6 ml-4">
          <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-1.5" />
          <p className="font-bold">{e.action}</p>
          <p className="text-gray-600 text-sm">
            {new Date(e.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-700 text-sm">{e.description}</p>
        </li>
      ))}
    </ol>
  );
}
