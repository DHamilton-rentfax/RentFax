"use client";

import { motion } from 'framer-motion';
import { FileText, ShieldCheck, BarChart3, CheckSquare } from 'lucide-react';

export default function HowItWorksPageClient() {
  const handleRedirect = (url: string) => {
    window.location.href = url;
  };

  const steps = [
    {
      icon: <FileText className="h-12 w-12 text-blue-600" />,
      title: "1. Submit an Application",
      description: "Landlords, car rental agencies, or equipment lenders initiate a RentFAX report by submitting the applicant's information through our secure portal or API.",
    },
    {
      icon: <ShieldCheck className="h-12 w-12 text-blue-600" />,
      title: "2. AI Verifies & Analyzes",
      description: "Our AI engine instantly cross-references thousands of data points to verify identity, detect fraudulent documents, and analyze behavioral risk factors.",
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
      title: "3. Receive a Renter Trust Index",
      description: "Instead of a simple pass/fail, you get a comprehensive Renter Trust Index (RTI) score, detailing the factors behind our recommendation.",
    },
    {
      icon: <CheckSquare className="h-12 w-12 text-blue-600" />,
      title: "4. Make a Confident Decision",
      description: "Use our actionable intelligence to approve with confidence, request more information, or decline, all while maintaining full FCRA compliance.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="text-center py-20 bg-gray-50">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-[#1A2540] mb-4"
        >
          How RentFAX Works
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          From fraud detection to risk assessment, see how our AI-powered platform provides the intelligence you need to protect your assets.
        </motion.p>
      </section>

      {/* Steps Section */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center text-center md:text-left md:flex-row md:items-start gap-6"
            >
              <div className="flex-shrink-0 bg-blue-100 p-4 rounded-full">{step.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20 text-center">
        <h2 className="text-4xl font-bold text-[#1A2540] mb-4">Ready to Secure Your Rentals?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Run your first report today and see the RentFAX difference. Protect your assets, reduce fraud, and make smarter decisions.
        </p>
        <button
          onClick={() => handleRedirect('https://app.rentfax.io/search?source=how-it-works')}
          className="px-10 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
        >
          Start a Free Search
        </button>
      </section>
    </div>
  );
}