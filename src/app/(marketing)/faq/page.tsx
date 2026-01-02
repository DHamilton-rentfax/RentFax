import { adminDb } from "@/firebase/server";

export default async function FAQPage() {
  const snap = await adminDb
    .collection("faqs")
    .where("status", "==", "approved")
    .orderBy("askedCount", "desc")
    .get();

  const faqs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Frequently Asked Questions</h1>

      {faqs.length === 0 ? (
        <p className="text-gray-600">No frequently asked questions are available at the moment. Check back later!</p>
      ) : (
        <div className="space-y-6">
          {faqs.map(faq => (
            <div key={faq.id} className="border-b last:border-b-0 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
