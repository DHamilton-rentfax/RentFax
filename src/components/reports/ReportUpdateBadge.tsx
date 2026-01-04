export function ReportUpdateBadge({ hasUpdate }: { hasUpdate: boolean }) {
  if (!hasUpdate) return null;

  return (
    <span className="ml-2 rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
      New Update Available
    </span>
  );
}
