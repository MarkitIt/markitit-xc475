import { FiTrash2 } from 'react-icons/fi';
import styles from '../styles.module.css';

interface CustomQuestionFieldProps {
  index: number;
  onDelete: (index: number) => void;
}

export const CustomQuestionField = ({ index, onDelete }: CustomQuestionFieldProps) => (
  <div className={styles.checkboxContainer}>
    <div className='flex justify-between items-start mb-4'>
      <input
        type='text'
        placeholder='Enter your question'
        className={styles.input}
        style={{ flex: 1, marginRight: '1rem' }}
      />
      <button
        type='button'
        onClick={() => onDelete(index)}
        className={styles.button}
        style={{ 
          width: 'auto', 
          padding: '0.5rem',
          backgroundColor: '#ef4444'
        }}
      >
        <FiTrash2 size={20} />
      </button>
    </div>
    <textarea
      placeholder='Enter any additional details or instructions for this question'
      className={styles.input}
      style={{ minHeight: '100px', resize: 'vertical' }}
    />
  </div>
); 