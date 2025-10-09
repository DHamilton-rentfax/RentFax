export default function HowItWorks() {
  const steps = [
    { title: '1. Verify Renter Identity', desc: 'Landlords or companies verify renter identity through secure RentFAX verification links.' },
    { title: '2. Submit Incident Reports', desc: 'Companies can log payment issues or behavior reports with supporting evidence.' },
    { title: '3. Renter Review & Dispute', desc: 'Renters receive instant notifications and can upload documentation to dispute reports.' },
    { title: '4. AI Risk Analysis', desc: 'Our AI Fraud Detection Engine evaluates duplicate data, risk patterns, and renter history.' },
    { title: '5. Resolution & Transparency', desc: 'Final outcomes and resolutions are stored securely in the renter’s digital profile.' },
  ]
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10">How RentFAX Works</h1>
      <div className="space-y-8">
        {steps.map((s,i)=>(
          <div key={i} className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-xl mb-2">{s.title}</h2>
            <p className="text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
