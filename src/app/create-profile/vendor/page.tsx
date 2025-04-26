"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "../styles.module.css";
import { useVendor } from "@/context/VendorContext";
import Script from "next/script";

export default function VendorProfilePage() {
  const router = useRouter();
  const { vendor, updateVendor } = useVendor();
  const [isExiting, setIsExiting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: vendor?.businessName || "",
    contactName: vendor?.contactName || "",
    email: vendor?.email || "",
    phoneNumber: vendor?.phoneNumber || "",
    website: vendor?.website || "",
    instagram: vendor?.instagram || "",
    etsy: vendor?.etsy || "",
    facebook: vendor?.facebook || "",
    businessAddress: vendor?.businessAddress || "",
    city: vendor?.city || "",
    state: vendor?.state || "",
    zipCode: vendor?.zipCode || "",
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.businessName &&
      formData.contactName &&
      formData.email &&
      formData.phoneNumber &&
      formData.website &&
      formData.instagram &&
      formData.businessAddress
    ) {
      updateVendor(formData);
      setIsExiting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/create-profile/vendor/type");
    } else {
      alert("Please fill in all required fields");
    }
  };

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (typeof window !== "undefined" && window.google && !autocompleteRef.current) {
      const addressInput = document.getElementById("businessAddress") as HTMLInputElement;
      if (addressInput) {
        autocompleteRef.current = new google.maps.places.Autocomplete(addressInput, {
          types: ["address"],
          componentRestrictions: { country: "us" },
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();
          if (!place) return;

          let addressComponents = {
            streetNumber: "",
            route: "",
            city: "",
            state: "",
            zipCode: "",
            fullAddress: place.formatted_address || "",
          };

          if (place.address_components) {
            place.address_components.forEach((component) => {
              const type = component.types[0];
              if (type === "street_number") {
                addressComponents.streetNumber = component.long_name;
              } else if (type === "route") {
                addressComponents.route = component.long_name;
              } else if (type === "locality") {
                addressComponents.city = component.long_name;
              } else if (type === "administrative_area_level_1") {
                addressComponents.state = component.short_name;
              } else if (type === "postal_code") {
                addressComponents.zipCode = component.long_name;
              }
            });
          }

          setFormData((prev) => ({
            ...prev,
            businessAddress: addressComponents.fullAddress,
            city: addressComponents.city,
            state: addressComponents.state,
            zipCode: addressComponents.zipCode,
          }));
        });
      }
    }
  }, []);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="lazyOnload"
      />
      <div
        className={`${styles.container} ${isExiting ? styles.slideOut : styles.slideIn}`}
      >
        <div className={styles.stepIndicator}>
          <span className={`${styles.stepIcon} ${styles.active}`}>▲</span>
          <span className={styles.stepIcon}>★</span>
          <span className={styles.stepIcon}>⌂</span>
          <span className={styles.stepIcon}>●</span>
          <span className={styles.stepIcon}>⟶</span>
        </div>

        <p className={styles.stepText}>Step 01/08</p>
        <h1 className={styles.title}>Create Business Profile</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Business Name*</label>
            <input
              type="text"
              name="businessName"
              className={styles.input}
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Name*</label>
            <input
              type="text"
              name="contactName"
              className={styles.input}
              value={formData.contactName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email*</label>
            <input
              type="email"
              name="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number*</label>
            <input
              type="tel"
              name="phoneNumber"
              className={styles.input}
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Business Address*</label>
            <p className={styles.description}>Start typing for address suggestions</p>
            <input
              type="text"
              id="businessAddress"
              name="businessAddress"
              className={styles.input}
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Enter your business address"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>City</label>
              <input
                type="text"
                name="city"
                className={styles.input}
                value={formData.city}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>State</label>
              <input
                type="text"
                name="state"
                className={styles.input}
                value={formData.state}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Zip Code</label>
              <input
                type="text"
                name="zipCode"
                className={styles.input}
                value={formData.zipCode}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Website*</label>
            <input
              type="url"
              name="website"
              className={styles.input}
              value={formData.website}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Instagram Link*</label>
            <p className={styles.description}>
              Enter your Instagram Profile link
            </p>
            <input
              type="url"
              name="instagram"
              className={styles.input}
              value={formData.instagram}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Facebook Link</label>
            <p className={styles.description}>Enter your Facebook Profile link</p>
            <input
              type="url"
              name="facebook"
              className={styles.input}
              value={formData.facebook}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Etsy Link</label>
            <p className={styles.description}>Enter your Etsy Profile link</p>
            <input
              type="url"
              name="etsy"
              className={styles.input}
              value={formData.etsy}
              onChange={handleChange}
            />
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.nextButton}>
              Next Step
            </button>
          </div>
        </form>
      </div>
    </>
  );
}