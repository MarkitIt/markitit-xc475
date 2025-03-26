'use client';

import { useState, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { theme } from '@/styles/theme';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ 
  placeholder = "What event are you searching for?",
  onSearch 
}: SearchBarProps) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.colors.background.white,
          border: '1px solid #E2E8F0',
          borderRadius: theme.borderRadius.full,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        }}
      >
        <FiSearch 
          size={20} 
          style={{ 
            color: theme.colors.text.secondary,
            marginRight: theme.spacing.sm,
          }} 
        />
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch?.(e.target.value)}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.primary,
            '::placeholder': {
              color: theme.colors.text.secondary,
            }
          }}
        />
      </div>
    </div>
  );
};

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