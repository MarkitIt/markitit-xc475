import styles from '../styles.module.css';

interface CategorySelectorProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

export const CategorySelector = ({ selectedCategories, setSelectedCategories }: CategorySelectorProps) => {
  const categories = [
    "Accessories", "Art", "Fashion", "Kids", "Home Decor", "Beauty & Skincare", 
    "Jewelry", "Food & Beverage", "Candles", "Books & Stationery", "Tech & Gadgets",
    "Vintage & Thrift", "Handmade Goods", "Pet Products", "Wellness & Health", 
    "Plants & Gardening", "Toys & Games", "Bags & Wallets", "Spiritual & Metaphysical",
    "Sports & Fitness", "Bath & Body", "Music & Instruments", "Automotive", 
    "Photography", "Sustainable & Eco-Friendly", "Gifts & Seasonal", 
    "DIY & Craft Supplies", "Furniture", "Men's Fashion", "Women's Fashion", 
    "Children's Fashion", "Digital Art & NFTs", "Custom Apparel", "Luxury Goods",
    "Event Planning & Party Supplies", "Hobby & Collectibles", "Baking & Desserts"
  ];

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    
    if (selectedOptions.length <= 3) {
      setSelectedCategories(selectedOptions);
    } else {
      alert("You can only select up to 3 categories.");
    }
  };

  return (
    <div className={styles.formGroup}>
      <h2 className={styles.label}>Select your business categories (max 3):</h2>
      <select
        multiple
        className={styles.select}
        onChange={handleCategoryChange}
        value={selectedCategories}
      >
        {categories.map((adjective, index) => (
          <option key={index} value={adjective}>
            {adjective}
          </option>
        ))}
      </select>
    </div>
  );
}; 