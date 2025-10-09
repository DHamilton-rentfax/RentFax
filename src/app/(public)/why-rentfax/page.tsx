export default function WhyRentFAX() {
  const points = [
    { title: 'Transparency for Everyone', desc: 'RentFAX creates fairness in the rental industry through verified, tamper-proof data.' },
    { title: 'AI-Powered Protection', desc: 'Our AI detects duplicates, fake submissions, and patterns of fraudulent activity.' },
    { title: 'Built for Renters & Companies', desc: 'Both sides gain insight, accountability, and clear documentation for every interaction.' },
    { title: 'Secure & Compliant', desc: 'All records are encrypted, access-controlled, and GDPR/CCPA compliant.' },
  ]
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10">Why RentFAX Exists</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {points.map((p,i)=>(
          <div key={i} className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-2">{p.title}</h2>
            <p className="text-gray-600">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
