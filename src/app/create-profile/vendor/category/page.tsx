"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVendor } from "../../../../context/VendorContext";
import styles from "../../styles.module.css";

const marketCategories = [
  "Accessories",
  "Art",
  "Fashion",
  "Kids",
  "Home Decor",
  "Beauty & Skincare",
  "Jewelry",
  "Food & Beverage",
  "Candles",
  "Books & Stationery",
  "Tech & Gadgets",
  "Vintage & Thrift",
  "Handmade Goods",
  "Pet Products",
  "Wellness & Health",
  "Plants & Gardening",
  "Toys & Games",
  "Bags & Wallets",
  "Spiritual & Metaphysical",
  "Sports & Fitness",
  "Bath & Body",
  "Music & Instruments",
  "Automotive",
  "Photography",
  "Sustainable & Eco-Friendly",
  "Gifts & Seasonal",
  "DIY & Craft Supplies",
  "Furniture",
  "Men's Fashion",
  "Women's Fashion",
  "Children's Fashion",
  "Digital Art & NFTs",
  "Custom Apparel",
  "Luxury Goods",
  "Event Planning & Party Supplies",
  "Hobby & Collectibles",
  "Baking & Desserts",
];

const foodCategories = [
  "Packaged Snacks (cookies, chips, trail mix, etc.)",
  "Baked Goods (cupcakes, pastries, breads)",
  "Beverages (juices, teas, smoothies)",
  "Hot/Prepared Meals (pop-up kitchen, warm dishes)",
  "Desserts & Sweets (ice cream, pudding, candy)",
  "Vegan / Plant-Based",
  "Specialty Items (sauces, seasonings, condiments, honey, etc.)",
  "Cottage Foods (home kitchen–approved items)",
  "Cultural Cuisine (e.g. Mexican, Asian, Italian, etc.)",
  "Other: _______",
];

const ethnicFoodCategories = [
  "Mexican",
  "Asian",
  "Italian",
  "Middle Eastern",
  "African",
  "Caribbean",
  "Latin American",
  "Indian",
  "Japanese",
  "Korean",
  "Vietnamese",
  "Thai",
  "Other: _______",
];

export default function CategoryPage() {
  const router = useRouter();
  const { vendor, updateVendor } = useVendor();
  const [isExiting, setIsExiting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEthnicCuisine, setSelectedEthnicCuisine] = useState<string[]>(
    [],
  );
  const [businessDescription, setBusinessDescription] = useState<string>("");
  const [showEthnicCuisineDropdown, setShowEthnicCuisineDropdown] =
    useState<boolean>(false);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedCategories(selectedOptions);

    // Check if "Cultural Cuisine" is selected
    const hasCulturalCuisine = selectedOptions.includes(
      "Cultural Cuisine (e.g. Mexican, Asian, Italian, etc.)",
    );
    setShowEthnicCuisineDropdown(hasCulturalCuisine);

    if (!hasCulturalCuisine) {
      setSelectedEthnicCuisine([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateVendor({
      categories: selectedCategories,
      ethnicFoodCategories: selectedEthnicCuisine,
      description: businessDescription,
    });

    setIsExiting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/create-profile/vendor/product");
  };

  const categories =
    vendor?.type === "market" ? marketCategories : foodCategories;

  return (
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

      <p className={styles.stepText}>Step 03/08</p>
      <h1 className={styles.title}>Tell us about your business</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            What category best describes your business?
          </label>
          <p className={styles.description}>(Check all that apply)</p>
          <select
            multiple
            className={styles.select}
            onChange={handleCategoryChange}
            value={selectedCategories}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {showEthnicCuisineDropdown && (
          <div className={styles.formGroup}>
            <label className={styles.label}>
              What cultural cuisine do you focus on?
            </label>
            <select
              multiple
              className={styles.select}
              value={selectedEthnicCuisine}
              onChange={(e) =>
                setSelectedEthnicCuisine(
                  Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  ),
                )
              }
            >
              {ethnicFoodCategories.map((cuisine, index) => (
                <option key={index} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Full Business Description (1500 characters or less)
          </label>
          <p className={styles.description}>
            Describe your products or services, who you are and anything else
            you would like to share.
          </p>
          <textarea
            className={styles.textarea}
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            maxLength={1500}
            rows={6}
          />
          <p className={styles.helperText}>
            {businessDescription.length}/1500 characters
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.nextButton}
            disabled={
              selectedCategories.length === 0 ||
              businessDescription.length === 0
            }
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
