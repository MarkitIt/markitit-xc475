import styles from "../styles.module.css";

interface FormFieldProps {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  isTextArea?: boolean;
  placeholder?: string;
}

export const FormField = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  isTextArea,
  placeholder,
}: FormFieldProps) => (
  <div>
    <div>
      {label}
      {required && <span className={styles.required}>*</span>}
    </div>
    {isTextArea ? (
      <textarea
        className={styles.textArea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        className={styles.formField}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);
