import { theme } from '@/styles/theme';
import { FiSearch } from 'react-icons/fi';
import { useState } from 'react';

interface EventSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const EventSearchBar = ({
  placeholder = "What event are you searching for?",
  onSearch,
}: EventSearchBarProps) => {
  const [inputValue, setInputValue] = useState(''); // State to manage input value

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      const query = inputValue.trim();
      if (onSearch && query) {
        onSearch(query); // Trigger the search with the query
      }
    }
  };

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
          value={inputValue} // Bind input value to state
          onChange={(e) => setInputValue(e.target.value)} // Update state on input change
          onKeyDown={handleKeyDown} // Trigger search on Enter key
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.primary,
          }}
        />
      </div>
    </div>
  );
};
