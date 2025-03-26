import { theme } from '@/styles/theme';
import { FiSearch } from 'react-icons/fi';

interface EventSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const EventSearchBar = ({ 
  placeholder = "What event are you searching for?",
  onSearch 
}: EventSearchBarProps) => {
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
          }}
        />
      </div>
    </div>
  );
}; 