"use client";
import { useState } from "react";
import styles from "../create-profile/styles.module.css";

type QuestionKey = "communication" | "placement" | "footTraffic";

const questions: { key: QuestionKey; label: string }[] = [
  {
    key: "communication",
    label: "How was their communication?",
  },
  {
    key: "placement",
    label: "How was the placement of your booth?",
  },
  {
    key: "footTraffic",
    label: "Was the foot traffic accurately described?",
  },
];

export default function RateHostPage() {
  const [ratings, setRatings] = useState<Record<QuestionKey, number>>({
    communication: 0,
    placement: 0,
    footTraffic: 0,
  });
  const [wouldAttend, setWouldAttend] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key as QuestionKey]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the data to your backend
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Rate Blavity Fest</h1>
        {questions.map((q) => (
          <div className={styles.formGroup} key={q.key}>
            <label className={styles.label}>{q.label}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  onClick={() => handleStarClick(q.key, star)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 28,
                    color: ratings[q.key as QuestionKey] >= star ? "#fbbf24" : "#e5e7eb",
                    transition: "color 0.2s",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className={styles.formGroup}>
          <label className={styles.label}>Would you attend this event again?</label>
          <div className={styles.pillButtonContainer}>
            <button
              type="button"
              className={`${styles.pillButton} ${wouldAttend === "yes" ? styles.selected : ""}`}
              onClick={() => setWouldAttend("yes")}
            >
              Yes
            </button>
            <button
              type="button"
              className={`${styles.pillButton} ${wouldAttend === "no" ? styles.selected : ""}`}
              onClick={() => setWouldAttend("no")}
            >
              No
            </button>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Give any more feedback</label>
          <textarea
            className={styles.textarea}
            placeholder="Share anything else about your experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button} disabled={submitted}>
            {submitted ? "Thank you!" : "Submit Rating"}
          </button>
        </div>
      </form>
    </div>
  );
}
