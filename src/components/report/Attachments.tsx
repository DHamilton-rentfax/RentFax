interface Incident {
  id: string;
  evidence?: string[];
}

interface Props {
  incidents: Incident[];
}

export function Attachments({ incidents }: Props) {
  const allEvidence = incidents.flatMap((i) => i.evidence || []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Attachments & Evidence
      </h3>
      {allEvidence.length > 0 ? (
        <ul className="list-disc list-inside space-y-2">
          {allEvidence.map((url, i) => (
            <li key={i}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Attachment {i + 1}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No attachments available.</p>
      )}
    </div>
  );
}
