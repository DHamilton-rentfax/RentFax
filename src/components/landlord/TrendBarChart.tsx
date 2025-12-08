"use client";

// Placeholder for a real chart library
export default function TrendBarChart({ title, data }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="flex justify-around items-end h-40 bg-gray-50 p-4 rounded">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div 
              className="bg-blue-400 mx-auto"
              style={{ 
                height: `${(item.incidents || item.disputes) * 10}px`, // Arbitrary scaling
                width: '30px' 
              }}
            ></div>
            <p className="text-xs mt-1">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
