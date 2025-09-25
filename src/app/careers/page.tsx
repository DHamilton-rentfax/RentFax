'use client';

const jobs = [
  { title: "Frontend Engineer", location: "Remote (US)", type: "Full-time" },
  { title: "Backend Engineer", location: "Remote (Global)", type: "Full-time" },
  { title: "Customer Success Manager", location: "New York, NY", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-900">Careers at RentFAX</h1>
        <p className="mt-4 text-lg text-gray-600">
          Join us in building the future of rental risk intelligence.
        </p>

        <div className="mt-12 space-y-6">
          {jobs.map((job, i) => (
            <div key={i} className="p-6 rounded-xl border shadow-sm hover:shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
              <p className="text-gray-600">{job.location} • {job.type}</p>
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
