"use client";

import Link from "next/link";

export default function AuthLayout({
  logo,
  title,
  subtitle,
  children,
  sideTitle,
  sideDescription,
  sidePoints,
}: {
  logo: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  sideTitle: string;
  sideDescription: string;
  sidePoints: string[];
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT — AUTH */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 bg-white">
        <div className="mb-10">{logo}</div>

        <Link
          href="/"
          className="mb-8 text-sm text-gray-500 hover:text-black"
        >
          ← Back to home
        </Link>

        <h1 className="text-3xl font-semibold text-gray-900">
          {title}
        </h1>
        <p className="mt-2 mb-8 text-gray-500 max-w-md">
          {subtitle}
        </p>

        {children}
      </div>

      {/* RIGHT — VALUE / TRUST */}
      <div className="flex flex-col justify-center px-10 lg:px-20 bg-gradient-to-br from-slate-950 to-slate-800 text-white">
        <h2 className="text-3xl font-semibold mb-4">
          {sideTitle}
        </h2>

        <p className="text-gray-300 max-w-md mb-8">
          {sideDescription}
        </p>

        <ul className="space-y-4 text-gray-200 max-w-md">
          {sidePoints.map((point, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-sm text-gray-400 max-w-md">
          RentFAX is building the trust layer for the rental economy.
        </div>
      </div>
    </div>
  );
}
