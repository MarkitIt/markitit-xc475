"use client";


import { Autocomplete } from "@react-google-maps/api";
import { onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection,doc,setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApplicationProfileContext } from "../../../context/CreateEventProfileContext";
import { auth, db } from "../../../lib/firebase";
import CustomQuestionField from '../../../components/CustomQuestionField';
import { getStorage, ref,uploadBytes, getDownloadURL } from "firebase/storage";
import { FiPlus } from 'react-icons/fi';
import styles from "../styles.module.css";
import "../../tailwind.css";
import { theme } from "@/styles/theme";
import { eventTypes } from '@/types/EventTypes';
import { attendeeTypes } from '@/types/AttendeeTypes';
import { categories } from '@/types/Categories';
import { demographics } from '@/types/Demographics';

interface Location {
    city: string;
    state: string;
}

const CreateApplicationProfile = () => {
  const router = useRouter();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [customQuestions, setCustomQuestions] = useState<
    { title: string; description: string; isRequired: boolean }[]
  >([]);

  // Standard fields that can be selected
  // const standardFields = [
  //   { id: 'business-name', label: 'Business Name' },
  //   { id: 'business-type', label: 'Business Type' },
  //   { id: 'contact-name', label: 'Contact Name' },
  //   { id: 'contact-email', label: 'Contact Email' },
  //   { id: 'contact-phone', label: 'Contact Phone' },
  //   { id: 'social-media', label: 'Social Media Links' },
  //   { id: 'product-description', label: 'Product Description' },
  //   { id: 'price-range', label: 'Price Range' },
  //   { id: 'website', label: 'Website' },
  //   { id: 'product-images', label: 'Product Images' },
  //   { id: 'past-events', label: 'Past Events Experience' },
  //   { id: 'space-requirements', label: 'Space Requirements' },
  // ];

  const [selectedFields, setSelectedFields] = useState<string[]>([
    // basic fields selected
    'business-name',
    'contact-email',
    'contact-phone',
  ]);

  const handleFieldToggle = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const addCustomQuestion = () => {
    setCustomQuestions([...customQuestions, { title: '', description: '', isRequired: false }]);
  };

  const removeCustomQuestion = (indexToRemove: number) => {
    setCustomQuestions(
      customQuestions.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleUpdateQuestion = (index: number, data: { title: string; description: string; isRequired: boolean }) => {
    console.log("Updating question at index:", index, "with data:", data);
    setCustomQuestions(customQuestions.map((q, i) => (i === index ? data : q)));
  };

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
  

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      
        if (!user) {
          console.error("User is not authenticated");
          alert("You must be logged in to create an application.");
          return;
        }
      
        try {
          // Collect form data
          const name = (document.getElementById("event-name") as HTMLInputElement).value;
          const startDateInput = (document.getElementById("start-date") as HTMLInputElement).value;
          const startTimeInput = (document.getElementById("start-time") as HTMLInputElement).value;
          const endDateInput = (document.getElementById("end-date") as HTMLInputElement).value;
          const endTimeInput = (document.getElementById("end-time") as HTMLInputElement).value;
          const totalCost = parseFloat((document.getElementById("booth-cost") as HTMLInputElement).value);
          const imageFile = (document.getElementById("image") as HTMLInputElement).files?.[0]; // Get the uploaded file
          const location = handlePlaceChanged() || { city: "", state: "" };
          const type = Array.from(
            (document.getElementById("type") as HTMLSelectElement).selectedOptions
          ).map((option) => option.value);
          const vendorFee = parseFloat((document.getElementById("vendorFee") as HTMLInputElement).value);
          const attendeeType = Array.from(
            (document.getElementById("attendeeType") as HTMLSelectElement).selectedOptions
          ).map((option) => option.value);
          const headcount = parseInt((document.getElementById("headcount") as HTMLInputElement).value, 10);
          const demographics = Array.from(
            (document.getElementById("demographics") as HTMLSelectElement).selectedOptions
          ).map((option) => option.value);
          const description = (document.getElementById("description") as HTMLTextAreaElement).value;
          const categories = Array.from(
            (document.getElementById("categories") as HTMLSelectElement).selectedOptions
          ).map((option) => option.value);

          // Validate required fields
          if (!location.city || !location.state) {
            alert("Please select a valid location.");
            return;
          }

          // Combine date and time into a single Date object
          const startDate = new Date(`${startDateInput}T${startTimeInput}:00`);
          const endDate = new Date(`${endDateInput}T${endTimeInput}:00`);

          // Validate required fields
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            alert("Please enter valid start and end dates/times.");
            return;
          }

          if (startDate > endDate) {
            alert("Start date/time cannot be after the end date/time.");
            return;
          }
          
          // Upload the image to Firebase Storage (optional)
          let imageUrl = "";
          if (imageFile) {
            const storage = getStorage(); // Initialize Firebase Storage
            const storageRef = ref(storage); // Use the ref function from Firebase Storage
            const fileRef = ref(storage, `event-images/${imageFile.name}`); // Create a reference to the file in Firebase Storage
            // Upload the file to Firebase Storage
            await uploadBytes(fileRef, imageFile);
            imageUrl = await getDownloadURL(fileRef);
          }

          
          console.log("Custom question",customQuestions);
          // Prepare the event data
          const eventData = {
            uid: user.uid,
            name,
            image:imageUrl, // Use the uploaded image URL
            startDate,
            endDate,
            totalCost,
            location,
            type,
            vendorFee,
            attendeeType,
            headcount,
            demographics,
            description,
            categories,
            // selectedFields, // Fields selected by the user
            customQuestions, // Custom questions added by the user
            createdAt: new Date().toISOString(),
          };
      
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
          alert("Application created successfully!");
          router.push("/my-events");
        } catch (error) {
          console.error("Error creating application:", error);
          alert("An error occurred while creating your application. Please try again.");
        }
    };

    

    const handlePlaceChanged = (): Location | null => {
        if (autocompleteRef.current) {
          const place = autocompleteRef.current.getPlace();
      
          if (!place || !place.address_components) {
            alert("Please select a valid location from the suggestions.");
            return { city: "", state: "" }; // Return an empty object to avoid undefined
          }
      
          let city = "";
          let state = "";
      
          // Extract city and state from the address components
          place.address_components.forEach((component) => {
            if (component.types.includes("locality")) {
              city = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
              state = component.short_name;
            }
          });
      
          // Debugging: Log extracted city and state
          console.log("Extracted City:", city);
          console.log("Extracted State:", state);
      
          if (!city || !state) {
            alert("Could not extract city and state. Please try again.");
            return { city: "", state: "" }; // Return an empty object to avoid undefined
          }
      
          return { city, state };
        } else {
          alert("Autocomplete is not loaded. Please try again.");
          return { city: "", state: "" }; // Return an empty object to avoid undefined
        }
      };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Create Application Form</h1>
        <p className={styles.subtitle}>
          Set up your vendor application form with the information you need from
          applicants.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="event-name" className={styles.label}>
              Event Name*
            </label>
            <input
              type="text"
              id="event-name"
              name="event-name"
              placeholder="Enter your event name"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label htmlFor="start-date" className={styles.label}>
                Start Date*
              </label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="end-date" className={styles.label}>
                End Date*
              </label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label htmlFor="start-time" className={styles.label}>
                Start Time*
              </label>
              <input
                type="time"
                id="start-time"
                name="start-time"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="end-time" className={styles.label}>
                End Time*
              </label>
              <input
                type="time"
                id="end-time"
                name="end-time"
                className={styles.input}
                required
              />
            </div>
          </div>
          
          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label htmlFor="headcount" className={styles.label}>
                Expected Headcount
              </label>
              <input
                type="number"
                id="headcount"
                name="headcount"
                placeholder="Enter the expected headcount"
                className={styles.input}
                min="0"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.label}>
                Location*
              </label>
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Event location"
                  className={styles.input}
                  required
                />
              </Autocomplete>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label htmlFor="vendorFee" className={styles.label}>
                Vendor Fee ($)
              </label>
              <input
                type="number"
                id="vendorFee"
                name="vendorFee"
                placeholder="Enter the vendor fee"
                className={styles.input}
                min="0"
                step="0.01"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="booth-cost" className={styles.label}>
                Total Cost ($)*
              </label>
              <input
                type="number"
                id="booth-cost"
                name="booth-cost"
                placeholder="0.00"
                className={styles.input}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label htmlFor="type" className={styles.label}>
                Event Type
              </label>
              <select
                id="type"
                name="type"
                multiple // Allows multi-select
                className={styles.select}
              >
                {eventTypes.map((demo, index) => (
                  <option key={index} value={demo}>
                    {demo}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categories" className={styles.label}>
                Event Categories
              </label>
              <select
                id="categories"
                name="categories"
                multiple // Allows multi-select
                className={styles.select}
              >
                {categories.map((demo, index) => (
                  <option key={index} value={demo}>
                    {demo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label htmlFor="attendeeType" className={styles.label}>
                Attendee Type
              </label>
              <select
                id="attendeeType"
                name="attendeeType"
                multiple // Allows multi-select
                className={styles.select}
              >
                {attendeeTypes.map((demo, index) => (
                  <option key={index} value={demo}>
                    {demo}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="demographics" className={styles.label}>
                Demographics
              </label>
              <select
                id="demographics"
                name="demographics"
                multiple // Allows multi-select
                className={styles.select}
              >
                {demographics.map((demo, index) => (
                  <option key={index} value={demo}>
                    {demo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>
              Event Image URL
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*" // Restrict to image files only
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Event Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter the event description"
              className={styles.textarea}
              rows={4}
            ></textarea>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Custom Questions</h2>
              <p className={styles.sectionDescription}>
                Add custom questions that will appear on a separate page of the
                application. Applicants will need to complete these questions before submitting.
              </p>
              <button
                type="button"
                onClick={addCustomQuestion}
                className={styles.addButton}
              >
                <FiPlus className={styles.icon} /> Add Question
              </button>
            </div>

            {customQuestions.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyStateText}>
                  No custom questions added yet.
                </p>
                <button
                  type="button"
                  onClick={addCustomQuestion}
                  className={styles.addButton}
                >
                </button>
              </div>
            ) : (
              <div className={styles.questionList}>
                {customQuestions.map((_, index) => (
                  <CustomQuestionField
                    key={index}
                    index={index}
                    onDelete={removeCustomQuestion}
                    onUpdate={handleUpdateQuestion}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
            >
              Create Application
            </button>
          </div>

          
        </form>


      </div>
    </main>
  );
};

export default CreateApplicationProfile;