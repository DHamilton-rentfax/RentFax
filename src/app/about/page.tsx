'use client';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center">About RentFAX</h1>
        <p className="mt-6 text-lg text-gray-600 text-center max-w-3xl mx-auto">
          RentFAX was built to protect rental businesses with smarter risk intelligence.  
          From AI-powered scoring to transparent renter dispute resolution, we’re reimagining
          how trust is built in rentals.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-2xl font-bold text-indigo-600">Our Mission</h3>
            <p className="mt-4 text-gray-600">
              To create the most reliable renter-risk scoring system that helps operators
              grow safely and confidently.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-indigo-600">Our Vision</h3>
            <p className="mt-4 text-gray-600">
              A world where rentals are frictionless, safe, and secure for both businesses
              and customers.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-indigo-600">Our Values</h3>
            <p className="mt-4 text-gray-600">
              Integrity, transparency, innovation — these drive everything we do at RentFAX.
            </p>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Meet the Team</h2>
          <p className="mt-4 text-gray-600">
            Backed by seasoned entrepreneurs, engineers, and advisors, we’re building the future of rentals.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-12">
            <div className="p-6 bg-white rounded-xl shadow">
              <img
                src="/team-ceo.jpg"
                alt="CEO"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-gray-900">K. Michael</h3>
              <p className="text-sm text-gray-600">CEO & Founder</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <img
                src="/team-vp.jpg"
                alt="VP"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-gray-900">Dominique Hamilton</h3>
              <p className="text-sm text-gray-600">VP, Strategy</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <img
                src="/team-advisor.jpg"
                alt="Advisor"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-gray-900">Javier Almeida</h3>
              <p className="text-sm text-gray-600">Advisor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
