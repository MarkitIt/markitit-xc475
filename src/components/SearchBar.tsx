'use client';

import { useState, useRef, useEffect } from 'react';
import { theme } from '@/styles/theme';
import { Autocomplete } from '@react-google-maps/api';

interface SearchBarProps {
  onSearch: (city: string, startDate: string, endDate: string, keywords: string) => void;
  // searchQuery: string; // Add searchQuery as a prop
  // setSearchQuery: (query: string) => void; // Add setSearchQuery as a prop
  // events: any[]; // Add events as a prop
}

export function SearchBar({ onSearch}: SearchBarProps) {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keywords, setKeywords] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Handle searchQuery changes
  // useEffect(() => {
  //   if (searchQuery &&  events.length > 0) {
  //     setKeywords(searchQuery); // Set keywords to searchQuery
  //     handleSubmitPre(searchQuery); // Trigger search with updated city

  //   }
  // }, [searchQuery,  setSearchQuery,events]);



  // const handleSubmitPre = (query?: string) => {
  //   onSearch(city, startDate, endDate, query || keywords); // Use query if provided, otherwise use keywords
  // };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch(city, startDate, endDate, keywords);
    // setSearchQuery(''); 
  };

  const inputStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.primary.beige}`,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: '0.9rem',
    backgroundColor: theme.colors.background.white,
    color: theme.colors.text.primary,
    outline: 'none',
    width: '100%',
    height: '40px',
  };

  const buttonStyle = {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    border: 'none',
    backgroundColor: theme.colors.primary.sand,
    color: theme.colors.primary.black,
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    height: '40px',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        gap: theme.spacing.sm,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background.white,
        borderRadius: theme.borderRadius.lg,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
      }}
    >
      <div style={{ flex: '1 1 200px' }}>
        <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={inputStyle}
          />
        </Autocomplete>
      </div>

      <div style={{ flex: '1 1 150px' }}>
        <input
          type="text"
          placeholder="From (mm/dd/yyyy)"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ flex: '1 1 150px' }}>
        <input
          type="text"
          placeholder="To (mm/dd/yyyy)"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ flex: '1 1 200px' }}>
        <input
          type="text"
          placeholder="Keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ flex: '0 0 auto' }}>
        <button type="submit" style={buttonStyle}>
          Search
        </button>
      </div>
    </form>
  );
}