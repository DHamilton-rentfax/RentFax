'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const addOnGroups = [
  {
    title: "Fraud & Risk Tools",
    items: [
      { name: "Smart Monitoring", price: "$49 / mo", description: "Live alerts on renter data changes and new fraud signals." },
      { name: "AI Dispute Draft Assistant", price: "$19 / mo", description: "Automatically generate dispute letters with AI." },
      { name: "Advanced AI Risk Reports", price: "$39 / mo", description: "In-depth risk analysis powered by our AI engine." },
    ],
  },
  {
    title: "Analytics & Insights",
    items: [
      { name: "Insights+ Add-On", price: "$29 / mo", description: "Regional analytics and behavioral trends for your portfolio." },
      { name: "Portfolio Insights Dashboard", price: "$79 / mo", description: "A comprehensive dashboard for your entire portfolio." },
    ],
  },
];

export default function AddOnDrawer({ isOpen, onClose, enabledAddOns, onToggleAddOn }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-lg border-l border-gray-200"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Add-Ons</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-8 overflow-y-auto h-[calc(100%-73px)]">
            {addOnGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-lg font-medium text-gray-700 mb-4">{group.title}</h3>
                <div className="space-y-4">
                  {group.items.map((addon) => (
                    <div key={addon.name} className="flex items-start justify-between p-4 border rounded-xl">
                      <div>
                        <h4 className="font-semibold text-gray-800">{addon.name}</h4>
                        <p className="text-sm text-gray-500 max-w-xs">{addon.description}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                         <span className="font-semibold text-gray-800">{addon.price}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={enabledAddOns.includes(addon.name)}
                            onChange={() => onToggleAddOn(addon.name)}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
