"use client";

import { useState, useRef } from "react";
import { theme } from "@/styles/theme";
import { Autocomplete } from "@react-google-maps/api";

interface SearchBarProps {
  onSearch: (
    city: string,
    startDate: string,
    endDate: string,
    keywords: string,
  ) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keywords, setKeywords] = useState("");
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

  return (
    <form onSubmit={handleSubmit} className="search-container search-form">
      <div className="search-field">
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        >
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
          />
        </Autocomplete>
      </div>

      <div className="search-field">
        <input
          type="text"
          placeholder="From (mm/dd/yyyy)"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="search-field">
        <input
          type="text"
          placeholder="To (mm/dd/yyyy)"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="search-field">
        <input
          type="text"
          placeholder="Keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="search-input"
        />
      </div>

      <div>
        <button type="submit" className="search-button">
          Search
        </button>
      </div>
    </form>
  );
}
