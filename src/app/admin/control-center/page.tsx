import SyncPlansButton from "@/components/admin/SyncPlansButton";

export default function ControlCenter() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Control Center</h1>
      <p className="mb-4">Use the tools below to manage your application.</p>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <h2 class="text-lg font-semibold">Stripe Plan Synchronization</h2>
        <p class="text-sm text-muted-foreground mb-2">Manually trigger a sync to align Firestore user plans with Stripe subscriptions.</p>
        <SyncPlansButton />
      </div>
    </div>
  );
}
