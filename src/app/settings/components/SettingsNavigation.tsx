import styles from "../styles.module.css";

interface SettingsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const SettingsNavigation = ({
  activeSection,
  onSectionChange,
}: SettingsNavigationProps) => {
  const sections = [
    { id: "profile", label: "Profile Settings" },
    { id: "account", label: "Account Settings" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className={styles.navigation}>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`${styles.navButton} ${
            activeSection === section.id
              ? styles.navButtonActive
              : styles.navButtonInactive
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
};
