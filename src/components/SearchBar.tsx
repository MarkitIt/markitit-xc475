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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(city, startDate, endDate, keywords);
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
