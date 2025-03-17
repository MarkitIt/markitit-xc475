"use client"

import { useRouter , useParams} from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import '../../../tailwind.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface Event {
  id: string;
  name: string;
  image: string;
  date: string;
  location: {
    city: string;
    state: string;
  };
  description: string;
}

export default function EventReviewPage() {
  const router = useRouter();
  const params = useParams(); 
  const id = params.id as string// Get the id from the URL
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        const docRef = doc(db, 'events', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent(docSnap.data() as Event);
        } else {
          console.log('No such document!');
        }
      };

      fetchEvent();
    }
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleEventsClick = () => {
    router.push(`/event-profile/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      {/* Market Info */}
      <div className="flex items-center gap-4 w-full max-w-2xl">
        <div className="w-16 h-16 bg-gray-300 rounded"></div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{event.name}</h2>
          <div className="flex space-x-1 text-black">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon key={i} icon={faStar} />
            ))}
          </div>
        </div>
        <button className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <FontAwesomeIcon icon={faStar} />
            <span>Follow</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 mt-6 border-b text-gray-600 w-full max-w-2xl">
        <button className="pb-2 cursor-pointer" onClick={handleEventsClick}>Event</button>
        <button className="pb-2 border-b-2 border-black font-semibold cursor-pointer">Reviews</button>
        <button className="pb-2 cursor-pointer">Lorem</button>
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-600 text-sm w-full max-w-2xl text-left">
        {event.description}
      </p>

      {/* Image Cards */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-2xl">
        <div className="h-48 bg-gray-300">
          {event.image && (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="h-48 bg-gray-300"></div>
      </div>
    </div>
  );
}