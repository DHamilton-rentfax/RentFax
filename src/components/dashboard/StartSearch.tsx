'use client';

interface StartSearchProps {
  onStart: () => void;
}

export default function StartSearch({ onStart }: StartSearchProps) {
  return (
    <div className="text-center">
      <h2 className="text-lg font-medium">Start a new renter verification</h2>
      <p className="mt-2 text-gray-500">Click the button below to begin a new search.</p>
      <div className="mt-6">
        <button
          onClick={onStart}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Start Search
        </button>
      </div>
    </div>
  );
}
