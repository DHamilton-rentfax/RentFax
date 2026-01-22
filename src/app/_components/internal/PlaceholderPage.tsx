type Props = {
  title: string;
  description?: string;
};

export default function PlaceholderPage({ title, description }: Props) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
}