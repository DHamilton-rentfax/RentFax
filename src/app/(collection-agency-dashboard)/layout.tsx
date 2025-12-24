import { ReactNode } from "react";

export default function CollectionAgencyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-semibold">
          RentFAX — Collection Agency Portal
        </h1>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
