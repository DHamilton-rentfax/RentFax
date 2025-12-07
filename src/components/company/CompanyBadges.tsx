"use client";

export default function CompanyBadges({ badges }: { badges: string[] }) {
  if (!badges || badges.length === 0)
    return <p className="text-sm text-muted-foreground">No badges yet.</p>;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {badges.map((b) => (
        <span
          key={b}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
        >
          {b.replace(/_/g, " ")}
        </span>
      ))}
    </div>
  );
}
