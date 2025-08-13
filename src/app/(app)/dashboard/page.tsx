'use client';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Users,
  FileText,
  ShieldQuestion,
  PlusCircle,
  Upload,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function StatCard({ title, value, link, linkText }: { title: string; value: string | number, link: string, linkText: string }) {
  return (
    <Card>
      <CardHeader>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Link href={link} className="text-xs text-muted-foreground hover:underline">
          {linkText}
        </Link>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
          <p className="text-muted-foreground">An overview of your rental operations.</p>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline">
                <Link href="/admin/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                </Link>
            </Button>
            <Button asChild>
                <Link href="/renters/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Renter
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Renters" value="53" link="/dashboard/renters" linkText="View all renters" />
        <StatCard title="Incidents" value="17" link="/dashboard/incidents" linkText="Review recent incidents" />
        <StatCard title="Active Disputes" value="4" link="/dashboard/disputes" linkText="Manage open disputes" />
        <StatCard title="Total Revenue" value="$45,231" link="/dashboard/analytics" linkText="+20.1% from last month" />
      </div>

    </div>
  );
}
