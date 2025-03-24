"use client";


import { Autocomplete } from "@react-google-maps/api";
import { onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection,doc,setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApplicationProfileContext } from "../../context/CreateEventProfileContext";
import { auth, db } from "../../lib/firebase";
import "../tailwind.css";

const CreateEventProfile = () => {
  const router = useRouter();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
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
  

  const handleNextStepClick  = async () =>{
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
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Profile */}
        <div className="w-[50%]">
          <h2 className="text-md text-gray-500">Step 01/05</h2>
          <h1 className="text-5xl font-bold mb-8">Create Event Profile</h1>
          {/* All the fillable box form */}
          <div className="text-xl">
            <div className="">
              Event Name<span className="text-red-500">*</span>
            </div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="">
              City and State<span className="text-red-500">*</span>
            </div>
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
                placeholder="Enter city and state"
              />
            </Autocomplete>

            <div className="">
              Date<span className="text-red-500">*</span>
            </div>
            <input
              type="date"
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <div className="">
              Description<span className="text-red-500">*</span>
            </div>
            <textarea
              className="w-[70%] h-40 bg-gray-300 mb-8 text-left align-top p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="">
              Category<span className="text-red-500">*</span>
            </div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={category.join(", ")}
              onChange={(e) => setCategory(e.target.value.split(", "))}
              placeholder="Enter categories (comma-separated)"
              required
            />

            <div className="">Price</div>
            <input
              type="number"
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <div className="">Venue</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>

          {/* Next step click */}
          <div className="flex space-x-6 mt-8">
            <div className="w-36 h-14 bg-gray-300 flex items-center justify-center">Help</div>
            <div
              className={`w-48 h-14 bg-gray-300 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer flex items-center justify-center`}
              onClick={handleNextStepClick}
            >
              Next Step
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateEventProfile;