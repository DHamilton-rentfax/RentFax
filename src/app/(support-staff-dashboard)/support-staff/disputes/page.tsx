import DisputeList from "../components/DisputeList";

export const metadata = {
  title: "Support Disputes | RentFAX",
};

export default function DisputesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Disputes</h1>
      <DisputeList />
    </div>
  );
}
