import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  value: string;
  href: string;
}

export default function DashboardCard({ title, value, href }: DashboardCardProps) {
  return (
    <Link href={href} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </Link>
  );
}
