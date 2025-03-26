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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(city, startDate, endDate, keywords);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Keywords"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
} 