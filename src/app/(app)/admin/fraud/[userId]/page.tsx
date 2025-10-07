// ✅ Do not extend PageProps or any Promise type — define your own props interface
interface FraudPageProps {
  params: {
    userId: string;
  };
}

// ✅ The function can be async if it fetches data
export default async function FraudPage({ params }: FraudPageProps) {
  const { userId } = params;

  // Example placeholder for your logic:
  // const userDoc = await db.collection("fraud_reports").doc(userId).get();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Fraud Analysis for User: {userId}
      </h1>
      <p className="text-muted-foreground">
        This page displays detailed fraud signals, alerts, and manual review
        notes for the selected user.
      </p>
    </main>
  );
}
