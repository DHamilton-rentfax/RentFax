'use client';

const Timeline = ({ events }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-4">Timeline</h3>
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={index} className="flex space-x-4">
          <div className="w-1/4 text-gray-500">{new Date(event.date).toLocaleDateString()}</div>
          <div className="flex-1">
            <p className="font-semibold">{event.title}</p>
            <p className="text-gray-600">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Timeline;
