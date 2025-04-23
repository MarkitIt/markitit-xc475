import styles from "../styles.module.css";

interface FormFieldProps {
  label: string;
  id: string;
  type: "text" | "date" | "number";
  placeholder?: string;
  required?: boolean;
  min?: number;
  step?: string;
}

export const FormField = ({
  label,
  id,
  type,
  placeholder,
  required,
  min,
  step,
}: FormFieldProps) => (
  <div className={styles.formField}>
    <label className={styles.label} htmlFor={id}>
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      className={styles.input}
      required={required}
      min={min}
      step={step}
    />
  </div>
);
