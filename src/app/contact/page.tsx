"use client";

import { useState } from "react";
import { LifeBuoy, Search, ArrowRight } from "lucide-react";

const allDocs = [
  { slug: "getting-started", title: "Getting Started" },
  { slug: "renter-reports", title: "Renter Reports" },
  { slug: "disputes", title: "Disputes" },
  { slug: "compliance", title: "Compliance" },
];

export default function ContactPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactMethod, setContactMethod] = useState("support"); // 'support' or 'sales'

  const filteredDocs = allDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold">Contact & Support</h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-600">
          Have a question? We're here to help. Find answers in our docs or get in touch with our team.
        </p>
      </section>

      {/* Support & Sales Section */}
      <section className="pb-24 max-w-4xl mx-auto px-6">
        <div className="bg-white p-8 rounded-xl shadow-md border">
          
          {/* Knowledge Base Search */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold flex items-center mb-4">
              <LifeBuoy className="h-7 w-7 text-emerald-600 mr-3" />
              Search Knowledge Base
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search for articles... (e.g. 'disputes')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            {searchTerm && (
              <div className="mt-4 space-y-2">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map(doc => (
                    <a key={doc.slug} href={`/docs/${doc.slug}`} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-emerald-100">
                      <span>{doc.title}</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500">No results found.</p>
                )}
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            
            <div className="flex border-b mb-6">
                <button onClick={() => setContactMethod('support')} className={`px-6 py-2 font-medium ${contactMethod === 'support' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'}`}>Support</button>
                <button onClick={() => setContactMethod('sales')} className={`px-6 py-2 font-medium ${contactMethod === 'sales' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'}`}>Sales</button>
            </div>

            <form>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-lg" />
                <input type="email" placeholder="Your Email" className="w-full p-3 border rounded-lg" />
              </div>
              <input type="text" placeholder="Subject" className="w-full p-3 border rounded-lg mb-4" />
              <textarea placeholder={`How can our ${contactMethod} team help you?`} rows={5} className="w-full p-3 border rounded-lg mb-4"></textarea>
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

    </main>
  );
}
