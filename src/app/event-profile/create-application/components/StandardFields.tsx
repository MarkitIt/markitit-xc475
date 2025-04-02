import styles from '../styles.module.css';

interface StandardField {
  id: string;
  label: string;
}

interface StandardFieldsProps {
  fields: StandardField[];
  selectedFields: string[];
  onToggle: (fieldId: string) => void;
}

export const StandardFields = ({ fields, selectedFields, onToggle }: StandardFieldsProps) => (
  <div className={styles.section}>
    <h2 className={styles.sectionTitle}>
      Standard Application Fields
    </h2>
    <p className={styles.subtitle}>
      Select the information you want to collect from vendors.
    </p>

    <div className={styles.checkboxContainer}>
      <div className='flex flex-col'>
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className={styles.checkboxItem}>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id={field.id}
                  checked={selectedFields.includes(field.id)}
                  onChange={() => onToggle(field.id)}
                  className={styles.checkbox}
                />
              </div>
              <label htmlFor={field.id} className={styles.label}>
                {field.label}
              </label>
            </div>
            {index < fields.length - 1 && <div className={styles.divider} />}
          </div>
        ))}
      </div>
    </div>
  </div>
); 