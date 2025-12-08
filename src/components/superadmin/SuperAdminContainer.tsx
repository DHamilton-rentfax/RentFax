export default function SuperAdminContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto">{children}</div>
    </div>
  );
}
