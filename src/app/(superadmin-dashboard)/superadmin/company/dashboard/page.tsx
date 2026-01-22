import { getDashboardData } from "@/app/(superadmin-dashboard)/business/actions/getDashboardData";
import BusinessDashboardHome from "@/components/business-dashboard/BusinessDashboardHome";

export default async function CompanyDashboardPage() {
  const data = await getDashboardData();
  return <BusinessDashboardHome initialData={data} />;
}
