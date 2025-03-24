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
  rank?: number;
  showRank?: boolean;
}

export function EventCardHost({ event, rank, showRank }: EventProps) {
  return (
    <Link href={`/application/host/${event.id}/vendor-manage`}>
      <div className="rounded-lg overflow-hidden shadow-md bg-white relative">
        {showRank && rank && rank <= 20 && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
            #{rank}
          </div>
        )}
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