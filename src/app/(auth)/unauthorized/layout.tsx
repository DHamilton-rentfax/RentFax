
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "white",
  colorScheme: "light",
};

export default function UnauthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
