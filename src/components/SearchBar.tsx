'use client';

import { useState, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface SearchBarProps {
  onSearch: (city: string, startDate: string, endDate: string, keywords: string) => void;
}


export function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keywords, setKeywords] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(city, startDate, endDate, keywords);
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        setCity(place.formatted_address); // Set the full address as the city
      }
    }
  };

  return (
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px]">
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input

              placeholder="City or Address"
              className="w-full p-2 border rounded"

            />
          </Autocomplete>
        </div>
        <div className="flex-1 min-w-[200px] flex gap-2">
          <input
            type="date"
            placeholder="Start Date"
            className="w-full p-2 border rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            placeholder="End Date"
            className="w-full p-2 border rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Enter keywords"
            className="w-full p-2 border rounded"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Search
        </button>
      </form>
  );
} 