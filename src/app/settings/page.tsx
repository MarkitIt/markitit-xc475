"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import { SettingsNavigation } from "./components/SettingsNavigation";
import { ProfileSettings } from "./components/ProfileSettings";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleProfileSave = (data: { displayName: string; email: string }) => {
    // Implement save functionality
    console.log("Saving profile data:", data);
  };

  return (
    <main className="global-background">
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>

        <div className={styles.layout}>
          <SettingsNavigation
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />

          {activeSection === "profile" && (
            <ProfileSettings
              initialData={{
                displayName: "John Doe",
                email: "john@example.com",
              }}
              onSave={handleProfileSave}
            />
          )}

          {/* Add other sections as needed */}
        </div>
      </div>
    </main>
  );
}
