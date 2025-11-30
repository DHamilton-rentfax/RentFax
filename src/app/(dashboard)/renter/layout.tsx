import RenterNavbar from "@/components/renter/RenterNavbar";

export default function RenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RenterNavbar />
      <main className="pt-20 bg-gray-50 min-h-screen">{children}</main>
    </>
  );
}
