import React from 'react';
import styles from './styles.module.css';

interface LoadingButtonProps {
  onClick: () => void;
  loading: boolean;
  text: string;
  disabled?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ 
  onClick, 
  loading, 
  text, 
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={styles.nextButton}
    >
      {loading ? (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default LoadingButton; 