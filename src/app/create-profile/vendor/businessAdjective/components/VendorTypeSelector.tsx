import styles from '../styles.module.css';

interface VendorTypeSelectorProps {
  vendorType: "Food Vendor" | "Market Vendor" | null;
  setVendorType: (type: string) => void;
}

export const VendorTypeSelector = ({ vendorType, setVendorType }: VendorTypeSelectorProps) => {
  return (
    <div className={styles.formGroup}>
      <h2 className={styles.label}>What kind of vendor are you?</h2>
      <div className={styles.radioGroup}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="vendorType"
            value="Food Vendor"
            className={styles.radioInput}
            checked={vendorType === "Food Vendor"}
            onChange={(e) => setVendorType(e.target.value)}
          />
          Food Vendor
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="vendorType"
            value="Market Vendor"
            className={styles.radioInput}
            checked={vendorType === "Market Vendor"}
            onChange={(e) => setVendorType(e.target.value)}
          />
          Market Vendor
        </label>
      </div>
    </div>
  );
}; 