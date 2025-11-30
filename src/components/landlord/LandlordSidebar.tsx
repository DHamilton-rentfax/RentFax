import Link from "next/link";

const items = [
  { label: "Dashboard", href: "/landlord/dashboard" },
  { label: "Search Renters", href: "/dashboard/search" },
  {
    label: "Create Company Renter",
    href: "/dashboard/renters/new-company",
  },
  { label: "Incidents", href: "/landlord/incidents" },
  { label: "Disputes", href: "/landlord/disputes" },
  { label: "Reports", href: "/landlord/reports" },
  { label: "Payments", href: "/landlord/payments" },
  { label: "Settings", href: "/landlord/settings" },
];

export default function LandlordSidebar() {
  return (
    <div className="h-full flex flex-col p-6 bg-white">
      <h2 className="text-xl font-bold mb-6">LANDLORD</h2>

      <nav className="space-y-2">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium"
          >
            {i.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
