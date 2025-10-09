import FAQItem from '@/components/public/FAQItem'

export default function HelpPage() {
  const faqs = [
    { q: 'How do I dispute a report?', a: 'After verification, log in and click “Disputes” to upload evidence and communicate with admins.' },
    { q: 'Is my data private?', a: 'Yes. RentFAX stores all information in encrypted Firestore collections accessible only by authorized parties.' },
    { q: 'What does AI risk scoring mean?', a: 'AI calculates a confidence score based on duplicate identifiers, payment history, and resolution outcomes.' },
    { q: 'Can I delete my account?', a: 'Yes. Contact support@rentfax.com from your verified email to request full data deletion.' },
  ]
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10">Help Center / FAQ</h1>
      <div className="bg-white p-6 rounded-xl shadow">
        {faqs.map((f,i)=><FAQItem key={i} q={f.q} a={f.a}/>)}
      </div>
    </div>
  )
}
