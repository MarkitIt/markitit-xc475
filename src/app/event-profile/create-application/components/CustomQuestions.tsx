import { FiPlus } from 'react-icons/fi';
import styles from '../styles.module.css';
import { CustomQuestionField } from './CustomQuestionField';

interface CustomQuestionsProps {
  questions: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export const CustomQuestions = ({ questions, onAdd, onRemove }: CustomQuestionsProps) => (
  <div className={styles.section}>
    <div className='flex flex-col items-center mb-6'>
      <h2 className={styles.sectionTitle}>
        Custom Questions
      </h2>
      <p className={styles.subtitle}>
        Add custom questions that will appear on a separate page of the application. 
        Applicants will need to complete these questions before submitting.
      </p>
      <button
        type='button'
        onClick={onAdd}
        className={styles.addButton}
      >
        <FiPlus /> Add Question
      </button>
    </div>

    {questions.length === 0 ? (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateText}>
          No custom questions added yet.
        </p>
      </div>
    ) : (
      <div className='space-y-6'>
        {questions.map((_, index) => (
          <CustomQuestionField
            key={index}
            index={index}
            onDelete={() => onRemove(index)}
          />
        ))}
      </div>
    )}
  </div>
); 