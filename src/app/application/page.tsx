"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useApplicationProfileContext } from "../../context/ApplicationProfileContext";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import "../tailwind.css";

const ApplicationProfile = () => {
  const {
    category, setCategory,
    date, setDate,
    description, setDescription,
    location, setLocation,
    name, setName,
    price, setPrice,
    vendor_id, setVendorId,
  } = useApplicationProfileContext();

  const router = useRouter();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false); // Track API loading state

  const handleNextStepClick = () => {
    if (!isApiLoaded) {
      alert("Please wait for the API to load.");
      return;
    }

    if (
      name &&
      location.city &&
      location.state &&
      date &&
      description &&
      category.length > 0
    ) {
      router.push("/");
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const addressComponents = place.address_components;

      if (addressComponents) {
        const city = addressComponents.find((component) =>
          component.types.includes("locality")
        )?.long_name;

        const state = addressComponents.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.short_name;

        if (city && state) {
          setLocation({ city, state });
        }
      }
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={`${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`}
      libraries={["places"]}
      onLoad={() => setIsApiLoaded(true)} // Set API as loaded
    >
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
              <div className="">Event Name<span className="text-red-500">*</span></div>
              <input
                className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="">City and State<span className="text-red-500">*</span></div>
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
                  placeholder="Enter city or state"
                />
              </Autocomplete>

              <div className="">Date<span className="text-red-500">*</span></div>
              <input
                type="date"
                className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <div className="">Description<span className="text-red-500">*</span></div>
              <textarea
                className="w-[70%] h-40 bg-gray-300 mb-8 text-left align-top p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <div className="">Category<span className="text-red-500">*</span></div>
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

              <div className="">Vendor ID</div>
              <input
                className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
                value={vendor_id}
                onChange={(e) => setVendorId(e.target.value)}
              />
            </div>

            {/* Next step click */}
            <div className="flex space-x-6 mt-8">
              <div className="w-36 h-14 bg-gray-300 flex items-center justify-center">Help</div>
              <div
                className={`w-48 h-14 bg-gray-300 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer flex items-center justify-center ${
                  !isApiLoaded ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleNextStepClick}
              >
                Next Step
              </div>
            </div>
          </div>
        </main>
      </div>
    </LoadScript>
  );
};

export default ApplicationProfile;