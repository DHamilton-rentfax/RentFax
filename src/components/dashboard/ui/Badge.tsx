export function Badge({
  type,
  children,
}: {
  type: "success" | "warning" | "error";
  children: React.ReactNode;
}) {
  const colors = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-1 text-xs rounded-md font-medium ${colors[type]}`}>
      {children}
    </span>
  );
}
