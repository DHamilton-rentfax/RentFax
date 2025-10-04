import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot, query, orderBy, where, getDocs } from "firebase/firestore";
import DemoTrends from "./DemoTrends";
import ExportControls from "./ExportControls";
import { getDemoTrendData } from "@/app/actions/get-demo-trends";

interface DemoEvent {
  id: string;
  event: string;
  data?: { [key: string]: any };
  createdAt: Date;
}

// Helper to calculate percentage and avoid division by zero
const calcPercent = (part: number, total: number): string => {
  if (!total || total === 0) return "0%";
  return ((part / total) * 100).toFixed(1) + "%";
};

export default function DemoAnalytics() {
  const [events, setEvents] = useState<DemoEvent[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  // Funnel States
  const [renterVisits, setRenterVisits] = useState(0);
  const [companyVisits, setCompanyVisits] = useState(0);
  const [renterConversions, setRenterConversions] = useState(0);
  const [companyConversions, setCompanyConversions] = useState(0);
  const [renterTrials, setRenterTrials] = useState(0);
  const [companyTrials, setCompanyTrials] = useState(0);
  const [renterPaid, setRenterPaid] = useState(0);
  const [companyPaid, setCompanyPaid] = useState(0);

  // Listen to demo events
  useEffect(() => {
    const q = query(collection(db, "demoAnalytics"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventList: DemoEvent[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        eventList.push({
          id: doc.id,
          event: data.event,
          data: data.data,
          createdAt: data.createdAt.toDate(),
        });
      });
      setEvents(eventList);

      // Calculate visits and conversions from events
      setRenterVisits(eventList.filter((e) => e.event === "demo_renter_report_viewed").length);
      setCompanyVisits(eventList.filter((e) => e.event === "demo_company_dashboard_viewed").length);
      setRenterConversions(eventList.filter((e) => e.event === "demo_conversion" && e.data?.source === "RENTER").length);
      setCompanyConversions(eventList.filter((e) => e.event === "demo_conversion" && e.data?.source === "COMPANY").length);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user-based funnel data (trials and paid)
  useEffect(() => {
    async function fetchUserFunnelData() {
      // Renter Trials
      const renterTrialQuery = query(collection(db, "users"), where("plan", "==", "RENTER_TRIAL"));
      const renterTrialSnap = await getDocs(renterTrialQuery);
      setRenterTrials(renterTrialSnap.size);

      // Company Trials
      const companyTrialQuery = query(collection(db, "users"), where("plan", "==", "COMPANY_TRIAL"));
      const companyTrialSnap = await getDocs(companyTrialQuery);
      setCompanyTrials(companyTrialSnap.size);

      // Renter Paid
      const renterPaidQuery = query(
        collection(db, "users"),
        where("source", "==", "RENTER"),
        where("demoConversion", "==", true),
        where("subscription.status", "==", "active")
      );
      const renterPaidSnap = await getDocs(renterPaidQuery);
      setRenterPaid(renterPaidSnap.size);

      // Company Paid
      const companyPaidQuery = query(
        collection(db, "users"),
        where("source", "==", "COMPANY"),
        where("demoConversion", "==", true),
        where("subscription.status", "==", "active")
      );
      const companyPaidSnap = await getDocs(companyPaidQuery);
      setCompanyPaid(companyPaidSnap.size);
    }
    fetchUserFunnelData();
  }, []);

  useEffect(() => {
    async function fetchTrendData() {
      const res = await getDemoTrendData();
      setTrendData(res);
    }
    fetchTrendData();
  }, []);


  const funnelData = {
    renterVisits,
    companyVisits,
    renterConversions,
    companyConversions,
    renterTrials,
    companyTrials,
    renterPaid,
    companyPaid,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Renter Funnel */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">👤 Renter Funnel</h3>
          <ul className="space-y-2 text-gray-800">
            <li>
              Visits: {renterVisits}
            </li>
            <li>
              Conversions: {renterConversions} 
              <span className="text-sm text-gray-500 ml-2">
                ({calcPercent(renterConversions, renterVisits)})
              </span>
            </li>
            <li>
              Trials: {renterTrials} 
              <span className="text-sm text-gray-500 ml-2">
                ({calcPercent(renterTrials, renterConversions)})
              </span>
            </li>
            <li>
              Paid: {renterPaid} 
              <span className="text-sm text-gray-500 ml-2">
                ({calcPercent(renterPaid, renterTrials)})
              </span>
            </li>
          </ul>
        </div>

        {/* Company Funnel */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">🏢 Company Funnel</h3>
          <ul className="space-y-2 text-gray-800">
            <li>
              Visits: {companyVisits}
            </li>
            <li>
              Conversions: {companyConversions} 
              <span className="text-sm text-gray-500 ml-2">
                ({calcPercent(companyConversions, companyVisits)})
              </span>
            </li>
            <li>
              Trials: {companyTrials} 
              <span className="text-sm text-gray-500 ml-2">
                ({calcPercent(companyTrials, companyConversions)})
              </span>
            </li>
            <li>
              Paid: {companyPaid} 
              <span className="text-sm text-gray-500 ml-2">
                ({calcPercent(companyPaid, companyTrials)})
              </span>
            </li>
          </ul>
        </div>
      </div>

      <ExportControls chartData={trendData} funnelData={funnelData} />

      <DemoTrends data={trendData} />

      <div>
        <h2 className="text-2xl font-bold mt-8">Recent Demo Events</h2>
        <ul className="space-y-2 mt-4">
          {events.map((e) => (
            <li key={e.id} className="p-3 bg-gray-50 rounded-lg text-sm">
              <span className="font-semibold">{e.event}</span>
              <span className="text-gray-500 ml-2">{e.createdAt.toLocaleString()}</span>
              {e.data && <pre className="mt-1 text-xs bg-gray-100 p-2 rounded">{JSON.stringify(e.data, null, 2)}</pre>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
