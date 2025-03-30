import styles from '../styles.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
  <div className={styles.pagination}>
    {Array.from({ length: totalPages }).map((_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index + 1)}
        className={`${styles.pageButton} ${
          currentPage === index + 1 ? styles.pageButtonActive : styles.pageButtonInactive
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>
); 