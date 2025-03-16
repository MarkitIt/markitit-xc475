import Link from 'next/link';

interface EventProps {
  event: {
    id: string;
    name: string;
    image: string;
    date: string;
    location: {
      city: string;
      state: string;
    };
  };
}

export function EventCard({ event }: EventProps) {
  return (
    <Link href={`/event-profile/${event.id}`}>
      <div className="rounded-lg overflow-hidden shadow-md bg-white">
        <div className="h-48 bg-gray-200">
          {event.image && (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
          <p className="text-gray-800 text-lg">{`${event.location.city}, ${event.location.state}`}</p>
          <p className="text-gray-600">{event.date}</p>
        </div>
      </div>
    </Link>
  );
} 