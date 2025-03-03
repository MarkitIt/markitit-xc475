'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string, startDate: string, endDate: string, keywords: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(city, startDate, endDate, keywords);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="City"
          className="w-full p-2 border rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
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