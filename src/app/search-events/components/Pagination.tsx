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
      {(() => {
      const range: number[] = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      const items = [];

      // First page and ellipsis if needed
      if (start > 1) {
        items.push(
          <button
            key={1}
            onClick={() => onPageChange(1)}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              border: 'none',
              cursor: 'pointer',
              fontFamily: theme.typography.fontFamily.primary,
              fontWeight: theme.typography.fontWeight.medium,
              backgroundColor: currentPage === 1
                ? theme.colors.primary.sand
                : theme.colors.background.white,
              color: currentPage === 1
                ? theme.colors.primary.black
                : theme.colors.text.primary,
              transition: 'all 0.2s ease',
            }}
          >
            1
          </button>
        );
        if (start > 2) {
          items.push(<span key="start-ellipsis" style={{
            color: theme.colors.primary.black,
            fontWeight: theme.typography.fontWeight.bold,
            alignSelf: 'center',
            lineHeight: 1.5
          }}>
            ...
          </span>);
        }
      }
      range.forEach((page) => {
        items.push(
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              border: 'none',
              cursor: 'pointer',
              fontFamily: theme.typography.fontFamily.primary,
              fontWeight: theme.typography.fontWeight.medium,
              backgroundColor: currentPage === page
                ? theme.colors.primary.sand
                : theme.colors.background.white,
              color: currentPage === page
                ? theme.colors.primary.black
                : theme.colors.text.primary,
              transition: 'all 0.2s ease',
            }}
          >
            {page}
          </button>
        );
      });

      // Last page and ellipsis if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          items.push(<span key="end-ellipsis" style={{
            color: theme.colors.primary.black,
            fontWeight: theme.typography.fontWeight.bold,
            alignSelf: 'center',
            lineHeight: 1.5
          }}>
            ...
          </span>);
        }
        items.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              border: 'none',
              cursor: 'pointer',
              fontFamily: theme.typography.fontFamily.primary,
              fontWeight: theme.typography.fontWeight.medium,
              backgroundColor: currentPage === totalPages
                ? theme.colors.primary.sand
                : theme.colors.background.white,
              color: currentPage === totalPages
                ? theme.colors.primary.black
                : theme.colors.text.primary,
              transition: 'all 0.2s ease',
            }}
          >
            {totalPages}
          </button>
        );
      }

      return items;
    })()}
  </div>
); 