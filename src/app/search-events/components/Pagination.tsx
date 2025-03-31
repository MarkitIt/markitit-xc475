import styles from '../styles.module.css';
import { theme } from '@/styles/theme';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xxl
  }}>
    {Array.from({ length: totalPages }).map((_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index + 1)}
        style={{
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          borderRadius: theme.borderRadius.md,
          border: 'none',
          cursor: 'pointer',
          fontFamily: theme.typography.fontFamily.primary,
          fontWeight: theme.typography.fontWeight.medium,
          backgroundColor: currentPage === index + 1 
            ? theme.colors.primary.sand 
            : theme.colors.background.white,
          color: currentPage === index + 1 
            ? theme.colors.primary.black 
            : theme.colors.text.primary,
          transition: 'all 0.2s ease',
        }}
      >
        {index + 1}
      </button>
    ))}
  </div>
); 