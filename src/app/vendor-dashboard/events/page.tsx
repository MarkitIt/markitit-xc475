import React from "react";

const UpcomingEvents = () => {
  const events = [
    { id: 1, name: "Vendor Expo 2025", date: "March 15, 2025" },
    { id: 2, name: "Local Market Fair", date: "April 5, 2025" },
  ];

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
      <ul>
        {events.map((event) => (
          <li key={event.id} className="text-sm text-gray-700 border-b py-2">
            {event.name} - {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
