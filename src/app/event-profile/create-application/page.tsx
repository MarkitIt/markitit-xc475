"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import { FormField } from "./components/FormField";
import { StandardFields } from "./components/StandardFields";
import { CustomQuestions } from "./components/CustomQuestions";

const standardFields = [
  { id: "business-name", label: "Business Name" },
  { id: "contact-name", label: "Contact Name" },
  { id: "email", label: "Email Address" },
  { id: "phone", label: "Phone Number" },
  { id: "website", label: "Website" },
  { id: "social-media", label: "Social Media Links" },
];

export default function CreateApplicationPage() {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId],
    );
  };

  const handleAddCustomQuestion = () => {
    setCustomQuestions((prev) => [...prev, {}]);
  };

  const handleRemoveCustomQuestion = (index: number) => {
    setCustomQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Create Application Form</h1>
        <p className={styles.subtitle}>
          Set up your vendor application form with the information you need from
          applicants
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Event Information</h2>

            <FormField
              label="Event Name"
              id="event-name"
              type="text"
              placeholder="Enter your event name"
            />

            <div className={styles.gridContainer}>
              <FormField
                label="Event Date"
                id="event-date"
                type="date"
                required
              />
              <FormField
                label="Application Deadline"
                id="application-deadline"
                type="date"
                required
              />
            </div>

            <div className={styles.gridContainer}>
              <FormField
                label="Booth Cost ($)"
                id="booth-cost"
                type="number"
                placeholder="0.00"
                min={0}
                step="0.01"
                required
              />
              <FormField
                label="Location"
                id="location"
                type="text"
                placeholder="Event location"
                required
              />
            </div>
          </div>

          <StandardFields
            fields={standardFields}
            selectedFields={selectedFields}
            onToggle={handleFieldToggle}
          />

          <CustomQuestions
            questions={customQuestions}
            onAdd={handleAddCustomQuestion}
            onRemove={handleRemoveCustomQuestion}
          />

          <div className="flex justify-center">
            <div style={{ width: "50%" }}>
              <button type="submit" className={styles.button}>
                Create Application
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
