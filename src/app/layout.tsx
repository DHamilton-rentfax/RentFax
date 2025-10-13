import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentFAX",
  description:
    "AI-powered renter verification and risk intelligence for rental companies and individuals worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="x-deployment-commit-sha"
          content={process.env.NEXT_PUBLIC_GIT_COMMIT_SHA}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
