"use client";

import { useState, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { FormField } from './components/FormField';
import styles from './styles.module.css';
import { onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection,doc,setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApplicationProfileContext } from "../../context/CreateEventProfileContext";
import { auth, db } from "../../lib/firebase";

export default function CreateEventPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const {
    uid, setUid,
    category, setCategory,
    date, setDate,
    description, setDescription,
    event_unique_id, setEventUniqueId,
    location, setLocation,
    name, setName,
    price, setPrice,
    venue, setVenue,
    vendor_id, setVendor_id,
  } = useApplicationProfileContext();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);
  

  const handleNextStepClick = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const generatedVendorId = "Markits"; // Default vendor ID
    const generatedEventUniqueId = `${name}-${generatedVendorId}-${location.city}-${date}`;

    setVendor_id(generatedVendorId);
    setEventUniqueId(generatedEventUniqueId);
    setUid([user.uid]);

    const eventData = {
        uid: user.uid,
        category,
        date,
        description,
        event_unique_id: generatedEventUniqueId,
        location, // Includes city and state
        name,
        price,
        venue,
        vendor_id: generatedVendorId,
    };

    if (name && location.city && location.state &&
      date && description  && category.length > 0
    ) {
      // Add the event to the "events" collection
      const eventDocRef = await addDoc(collection(db, "events"), eventData);
      console.log("Event document written with ID: ", eventDocRef.id);

      // Create a corresponding vendorApply document
      const vendorApplyData = {
        eventId: eventDocRef.id, // Use the event document ID
        hostId: user.uid, // The host's user ID
        vendorId: [], // Initialize with an empty array of vendors
      };

      const vendorApplyDocRef = doc(db, "vendorApply", eventDocRef.id); // Use the event ID as the document ID
      await setDoc(vendorApplyDocRef, vendorApplyData);

      console.log("VendorApply document created successfully:", vendorApplyData);

      // Redirect to the home page or a success page
      router.push("/");
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
  
      // Debugging: Log the place object to inspect its structure
      console.log("Selected Place:", place);
  
      if (place && place.address_components) {
        // Extract city and state from address components
        const city = place.address_components.find((component) =>
          component.types.includes("locality")
        )?.long_name;
  
        const state = place.address_components.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.short_name;
  
        // Debugging: Log extracted city and state
        console.log("Extracted City:", city);
        console.log("Extracted State:", state);
  
        if (city && state) {
          setLocation({ city, state }); // Update location with city and state
        } else {
          alert("Please select a valid location with both city and state.");
        }
      } else {
        alert("No address components found. Please select a valid location.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.imagePlaceholder} />
        
        <div className={styles.formSection}>
          <div className={styles.stepIndicator}>Step 01/05</div>
          <h1 className={styles.title}>Create Event Profile</h1>

          <FormField
            label="Event Name"
            required
            value={name}
            onChange={setName}
          />

          <Autocomplete
            onLoad={autocomplete => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <FormField
              label="City and State"
              required
              value=""
              onChange={() => {}}
              placeholder="Enter city and state"
            />
          </Autocomplete>

          <FormField
            label="Date"
            required
            type="date"
            value={date}
            onChange={setDate}
          />

          <FormField
            label="Description"
            required
            value={description}
            onChange={setDescription}
            isTextArea
          />

          <FormField
            label="Category"
            required
            value={category.join(", ")}
            onChange={value => setCategory(value.split(", "))}
            placeholder="Enter categories (comma-separated)"
          />

          <FormField
            label="Price"
            type="number"
            value={price}
            onChange={setPrice}
          />

          <FormField
            label="Venue"
            value={venue}
            onChange={setVenue}
          />

          <div className={styles.buttonContainer}>
            <div className={styles.helpButton}>Help</div>
            <div className={styles.nextButton} onClick={handleNextStepClick}>
              Next Step
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}