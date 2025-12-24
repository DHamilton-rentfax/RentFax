
import { useState } from "react";

export function RenterConfirmationModal({ onConfirm }: { onConfirm: () => void }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
      // logEvent({ eventType: "RENTER_IDENTITY_ACKNOWLEDGED" });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Confirm Identity</h2>
        <p className="mb-6 text-gray-700">Please confirm that this report refers to you and your rental history before proceeding.</p>
        <div className="flex items-center mb-6">
          <input
            id="confirm-checkbox"
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="confirm-checkbox" className="ml-2 block text-sm text-gray-900">
            I confirm this report refers to me and my rental history.
          </label>
        </div>
        <button
          onClick={handleConfirm}
          disabled={!isChecked}
          className={`w-full px-4 py-2 text-white font-semibold rounded-lg ${
            isChecked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
