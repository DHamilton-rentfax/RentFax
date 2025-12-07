export function DrawerHeader({ title, description }: {
  title?: string;
  description?: string;
}) {
  return (
    <div>
      {title && (
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      )}
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}