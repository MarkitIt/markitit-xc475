"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVendor } from "@/context/VendorContext";
import styles from "../../styles.module.css";

const eventTypes = [
  "College pop-ups",
  "Indoor markets",
  "Outdoor festivals",
  "Holiday fairs",
  "Private corporate events",
  "Other",
];

const cities = [
  "Atlanta",
  "Austin",
  "Baltimore",
  "Boston",
  "Charlotte",
  "Chicago",
  "Cleveland",
  "Dallas",
  "Denver",
  "Detroit",
  "Houston",
  "Las Vegas",
  "Los Angeles",
  "Miami",
  "Minneapolis",
  "Nashville",
  "New Orleans",
  "New York City",
  "Oakland",
  "Orlando",
  "Philadelphia",
  "Phoenix",
  "Pittsburgh",
  "Portland",
  "Raleigh",
  "Richmond",
  "San Antonio",
  "San Diego",
  "San Francisco",
  "San Jose",
  "Seattle",
  "St. Louis",
  "Tampa",
  "Washington DC",
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "No preference",
];

const eventSizes = [
  { label: "Small (under 25 vendors)", value: "small" },
  { label: "Medium (25–75 vendors)", value: "medium" },
  { label: "Large (75–150 vendors)", value: "large" },
  { label: "Mega Events (150+ vendors / festivals)", value: "mega" },
];

const customerTypes = [
  "Students / College Crowd",
  "Families",
  "Young Professionals",
  "Tourists",
  "Local Regulars",
  "High-Income Shoppers",
  "Budget-Conscious Shoppers",
  "Trendsetters / Influencers",
  "Art Collectors / Design Enthusiasts",
  "Foodies / Culinary Explorers",
  "Health & Wellness Enthusiasts",
  "Eco-Conscious / Sustainable Shoppers",
  "Spiritual / Holistic Audiences",
  "Fashion-Focused Customers",
  "Parents & Kids",
  "Pet Owners",
  "BIPOC Communities",
  "LGBTQ+ Community",
  "Elderly / Retired Shoppers",
  "Remote Workers / Digital Nomads",
  "Festival-Goers / Music Lovers",
  "Travelers & Expats",
  "Gift Shoppers / Holiday Buyers",
];

export default function PreferencesPage() {
  const router = useRouter();
  const { vendor, updateVendor } = useVendor();
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [travelRadius, setTravelRadius] = useState<number>(25);
  const [hasSetup, setHasSetup] = useState<"yes" | "no" | "depends" | null>(
    null,
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [eventSize, setEventSize] = useState<string>("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [otherEventType, setOtherEventType] = useState("");
  const [otherCity, setOtherCity] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = async () => {
    updateVendor({
      ...vendor,
      eventPreference: selectedEventTypes,
      cities: selectedCities,
      travelRadius: travelRadius,
      hasOwnSetup:
        hasSetup === "yes" ? true : hasSetup === "no" ? false : "depends",
      schedule: {
        preferredDays: selectedDays,
      },
      preferredEventSize: eventSize,
      demographic: selectedCustomers,
    });

    setIsExiting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/create-profile/vendor/media");
  };

  const toggleSelection = (
    array: string[],
    setArray: (value: string[]) => void,
    item: string,
  ) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const getDistanceLabel = (radius: number) => {
    if (radius <= 20) return "Stay local!";
    if (radius <= 200) return "In and around my state";
    if (radius <= 2000) return "I don't mind some distance";
    return "Coast to coast!";
  };

  return (
    <div
      className={`${styles.container} ${isExiting ? styles.slideOut : styles.slideIn}`}
    >
      <div className={styles.stepIndicator}>
        <span className={styles.stepIcon}>▲</span>
        <span className={styles.stepIcon}>★</span>
        <span className={styles.stepIcon}>⌂</span>
        <span className={`${styles.stepIcon} ${styles.active}`}>●</span>
        <span className={styles.stepIcon}>⟶</span>
      </div>

      <p className={styles.stepText}>Step 06/08</p>
      <h1 className={styles.title}>Event Needs & Preferences</h1>
      <p className={styles.subtitle}>Used to tailor recommendations</p>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            What kind of events are you most interested in?*
          </label>
          <div className={styles.checkboxGrid}>
            {eventTypes.map((type) => (
              <label key={type} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedEventTypes.includes(type)}
                  onChange={() =>
                    toggleSelection(
                      selectedEventTypes,
                      setSelectedEventTypes,
                      type,
                    )
                  }
                  className={styles.checkbox}
                />
                {type}
              </label>
            ))}
            {selectedEventTypes.includes("Other") && (
              <input
                type="text"
                value={otherEventType}
                onChange={(e) => setOtherEventType(e.target.value)}
                placeholder="Please specify"
                className={styles.input}
              />
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            What cities/regions are you open to vending in?*
          </label>
          <div className={styles.checkboxGrid}>
            {cities.map((city) => (
              <label key={city} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city)}
                  onChange={() =>
                    toggleSelection(selectedCities, setSelectedCities, city)
                  }
                  className={styles.checkbox}
                />
                {city}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            How far are you willing to travel for an event?*
          </label>
          <p className={styles.description}>Maximum travel distance in miles</p>
          <div className={styles.sliderContainer}>
            <div className={styles.sliderTrack} />
            <div
              className={styles.sliderRange}
              style={{
                left: "0%",
                right: `${100 - ((travelRadius - 5) / (3000 - 5)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={5}
              max={3000}
              value={travelRadius}
              onChange={(e) => setTravelRadius(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>
          <div className={styles.sliderValue}>
            <span>{travelRadius} miles</span>
            <span className={styles.distanceLabel}>
              {getDistanceLabel(travelRadius)}
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Do you have your own table/set up?*
          </label>
          <div className={styles.pillButtonContainer}>
            <button
              className={`${styles.pillButton} ${hasSetup === "yes" ? styles.selected : ""}`}
              onClick={() => setHasSetup("yes")}
              type="button"
            >
              Yes
            </button>
            <button
              className={`${styles.pillButton} ${hasSetup === "no" ? styles.selected : ""}`}
              onClick={() => setHasSetup("no")}
              type="button"
            >
              No
            </button>
            <button
              className={`${styles.pillButton} ${hasSetup === "depends" ? styles.selected : ""}`}
              onClick={() => setHasSetup("depends")}
              type="button"
            >
              Depends on the event
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Days of the week*</label>
          <div className={styles.checkboxGrid}>
            {daysOfWeek.map((day) => (
              <label key={day} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() =>
                    toggleSelection(selectedDays, setSelectedDays, day)
                  }
                  className={styles.checkbox}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            What size of events do you usually vend at?*
          </label>
          <div className={styles.pillButtonContainer}>
            {eventSizes.map((size) => (
              <button
                key={size.value}
                className={`${styles.pillButton} ${eventSize === size.value ? styles.selected : ""}`}
                onClick={() => setEventSize(size.value)}
                type="button"
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            What kind of customers do you usually attract?*
          </label>
          <div className={styles.checkboxGrid}>
            {customerTypes.map((type) => (
              <label key={type} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(type)}
                  onChange={() =>
                    toggleSelection(
                      selectedCustomers,
                      setSelectedCustomers,
                      type,
                    )
                  }
                  className={styles.checkbox}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.nextButton}
            onClick={handleNext}
            disabled={
              !selectedEventTypes.length ||
              !selectedCities.length ||
              !hasSetup ||
              !selectedDays.length ||
              !eventSize ||
              !selectedCustomers.length
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
