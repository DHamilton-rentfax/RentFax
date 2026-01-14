import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  logo?: ReactNode;
  title: string;
  subtitle?: string;
  sideTitle?: string;
  sideDescription?: string;
  sidePoints?: string[];
};

export default function AuthLayout({
  children,
  logo,
  title,
  subtitle,
  sideTitle,
  sideDescription,
  sidePoints = [],
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT */}
      <div className="flex flex-col justify-center px-8 py-12">
        {logo && <div className="mb-8">{logo}</div>}

        <h1 className="text-3xl font-bold mb-2">{title}</h1>

        {subtitle && (
          <p className="text-gray-600 mb-8 max-w-md">{subtitle}</p>
        )}

        {children}
      </div>

      {/* RIGHT */}
      <div className="hidden md:flex flex-col justify-center bg-slate-950 px-12 text-white">
        {sideTitle && (
          <h2 className="text-3xl font-semibold mb-4">{sideTitle}</h2>
        )}

        {sideDescription && (
          <p className="text-gray-300 mb-8 max-w-md">
            {sideDescription}
          </p>
        )}

        {Array.isArray(sidePoints) && sidePoints.length > 0 && (
          <ul className="space-y-4 text-gray-200 max-w-md">
            {sidePoints.map((point, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
