"use client";

import { useRouter } from 'next/navigation';
import { useBusinessAdjectiveContext } from '../../../context/BusinessAdjectiveContext';
import { useBusinessProfileContext } from '../../../context/BusinessProfileContext';
import '../../tailwind.css';


const BusinessAdjective = () => {
  const router = useRouter();
  const { selectedAdjectives, setSelectedAdjectives, vendorType, setVendorType } = useBusinessAdjectiveContext();
  const {
    website, setWebsite,
    description, setDescription,
    facebookLink, setFacebookLink,
    twitterHandle, setTwitterHandle,
    instagramHandle, setInstagramHandle
  } = useBusinessProfileContext();


  const handleNextStepClick = () => {
    router.push('/vendor-profile/businessLocation');

  };

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
      setSelectedAdjectives(selectedOptions);
    } else {
      // Optionally, you can alert the user or handle the case where more than 3 are selected
      alert("You can only select up to 3 categories.");
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(e.target.value);
  };


  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleFacebookLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFacebookLink(e.target.value);
  };

  const handleTwitterHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTwitterHandle(e.target.value);
  };

  const handleInstagramHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstagramHandle(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Adjective section */}
        <div className="w-[50%]">
          <h2 className="text-md text-gray-500">Step 02/05</h2>
          <h1 className="text-5xl font-bold mb-8">Tell us about your business</h1>

          {/* Multiple Choice Question */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold">What kind of vendor are you?</h2>
            <div className="flex flex-col mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vendorType"
                  value="food vendor"
                  className="mr-2"
                  onChange={(e) => setVendorType(e.target.value)}
                />
                Food Vendor
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vendorType"
                  value="market vendor"
                  className="mr-2"
                  onChange={(e) => setVendorType(e.target.value)}
                />
                Market Vendor
              </label>
            </div>
          </div>

          {/* Multi-select dropdown for categories */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold">Select your business categories (max 3):</h2>
            <select
              multiple
              className="mt-2 p-2 border border-gray-300 rounded"
              onChange={handleCategoryChange}
              value={selectedAdjectives}
            >
              {categories.map((adjective, index) => (
                <option key={index} value={adjective}>
                  {adjective}
                </option>
              ))}
            </select>
          </div>
             <div className="">Website</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={website}
              onChange={handleWebsiteChange}
              required
            />    

            <div className="">Description</div>
            <textarea
              className="w-[70%] h-40 bg-gray-300 mb-8 text-left align-top p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />     

            <div className="">Facebook link</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={facebookLink}
              onChange={handleFacebookLinkChange}
              required
            />   

            <div className="">Twitter "X" handle</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={twitterHandle}
              onChange={handleTwitterHandleChange}
              required
            />   

            <div className="">Instagram handle</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={instagramHandle}
              onChange={handleInstagramHandleChange}
              required
            />    
          {/* Next step click */}
          <div className="flex space-x-6 mt-8">
            <div className="w-36 h-14 bg-gray-300 flex items-center justify-center">Help</div>
            <div
              className="w-48 h-14 bg-gray-300 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer flex items-center justify-center"
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

export default BusinessAdjective;