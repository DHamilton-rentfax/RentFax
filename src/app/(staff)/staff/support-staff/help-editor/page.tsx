import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center Editor | RentFAX",
  description:
    "Create and manage Help Center articles for RentFAX support staff.",
};

export default function HelpEditorPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-4">
        Help Center Editor
      </h1>

      <p className="text-gray-600 mb-8 max-w-2xl">
        This internal tool allows support staff to create, edit, and publish
        Help Center articles for RentFAX users.
      </p>

      <div className="rounded-lg border border-dashed p-8 text-gray-500">
        Help article editor UI coming soon.
      </div>
    </main>
  );
}
