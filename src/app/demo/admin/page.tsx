import { SlidersHorizontal, Key, ShieldCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminPage() {
    const [apiKey, setApiKey] = useState('rf_sk_demo_******************');
    const [retentionDays, setRetentionDays] = useState(90);

  return (
    <>
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <SlidersHorizontal size={36} className="text-emerald-600" /> Admin Settings
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
            Manage your workspace’s security, API access, and data retention policies.
        </p>

        {/* API Settings */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><Key/> API Key Management</h2>
            <p className="text-gray-600 mb-4">Manage your API keys for programmatic access to RentFAX services.</p>
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-200 font-mono text-sm"
                />
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition w-full sm:w-auto">
                    Regenerate Key
                </button>
            </div>
        </div>

        {/* Security Settings */}
         <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><ShieldCheck/> Security</h2>
             <div className="flex items-center justify-between border-b border-gray-100 py-3">
                 <div>
                    <p className="font-medium text-gray-800">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-gray-500">Require all users to set up 2FA for enhanced security.</p>
                 </div>
                 <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                </label>
             </div>
              <div className="flex items-center justify-between pt-4">
                 <div>
                    <p className="font-medium text-gray-800">Enforce SSO</p>
                    <p className="text-sm text-gray-500">Require all users to log in via a single sign-on provider.</p>
                 </div>
                 <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
             </div>
        </div>

        {/* Data Retention */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><Trash2/> Data Retention Policy</h2>
            <p className="text-gray-600 mb-4">Set how long reports and applicant data should be stored.</p>
             <div className="flex flex-col sm:flex-row gap-4 items-center">
                <p className="text-gray-700">Automatically delete data after:</p>
                <input
                    type="number"
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-48"
                />
                <span className="text-gray-700">days</span>
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition w-full sm:w-auto ml-auto">
                    Save Policy
                </button>
            </div>
        </div>

        <style jsx>{`
            .switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 28px;
            }
            .switch input { 
                opacity: 0;
                width: 0;
                height: 0;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
            }
            input:checked + .slider {
                background-color: #10B981; /* emerald-600 */
            }
            input:checked + .slider:before {
                transform: translateX(22px);
            }
            .slider.round { border-radius: 34px; }
            .slider.round:before { border-radius: 50%; }
        `}</style>
    </>
  );
}
