import { Card } from "@/components/ui/card";

interface Props {
  data: any;
}

export default function SummaryCards({ data }: Props) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      <Card className="p-5 shadow-sm">
        <p className="text-gray-600 text-sm">Credits Remaining</p>
        <p className="text-2xl font-semibold text-[#1A2540]">
          {data?.credits ?? 0}
        </p>
      </Card>

      <Card className="p-5 shadow-sm">
        <p className="text-gray-600 text-sm">Recent Searches</p>
        <p className="text-2xl font-semibold text-[#1A2540]">
          {data?.recentSearchCount ?? 0}
        </p>
      </Card>

      <Card className="p-5 shadow-sm">
        <p className="text-gray-600 text-sm">Incidents Logged</p>
        <p className="text-2xl font-semibold text-[#1A2540]">
          {data?.incidentCount ?? 0}
        </p>
      </Card>

      <Card className="p-5 shadow-sm">
        <p className="text-gray-600 text-sm">Verification Requests</p>
        <p className="text-2xl font-semibold text-[#1A2540]">
          {data?.verificationCount ?? 0}
        </p>
      </Card>

    </div>
  );
}