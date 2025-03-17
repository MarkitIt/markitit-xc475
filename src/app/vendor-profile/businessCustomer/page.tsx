"use client";

import { useRouter } from 'next/navigation';
import { useBusinessCustomerContext } from '../../../context/BusinessCustomerContext';
import '../../tailwind.css';

const BusinessCustomer = () => {
  const router = useRouter();
  const { idealCustomer, setIdealCustomer, eventPreference, setEventPreference, demographic, setDemographic } = useBusinessCustomerContext();

  const customerTypes = [
    'Families',
    'College Students',
    'Professionals',
    'High-End Buyers',
    'Tourists',
    'Local Shoppers',
    'Trendsetters & Influencers',
    'Eco-Conscious Consumers',
    'Collectors & Hobbyists',
    'DIY & Handmade Enthusiasts',
    'Luxury Shoppers',
    'Tech Enthusiasts',
    'Foodies & Culinary Enthusiasts'
  ];
  
  const eventTypes = [
    'Farmers Markets',
    'Art Fairs',
    'Festivals',
    'Small Pop-Ups',
    'Luxury Pop-Ups',
    'Craft & Handmade Markets',
    'Holiday & Seasonal Markets',
    'Food & Beverage Festivals',
    'Night Markets',
    'Vintage & Thrift Markets',
    'Health & Wellness Events',
    'Cultural & Heritage Festivals',
    'Music & Entertainment Events',
    'Outdoor Adventure & Sporting Events',
    'Tech & Innovation Expos'
  ];
  
  const demographics = [
    'Black',
    'Women',
    'LGBT',
    'Young Adults',
    'Seniors',
    'Parents',
    'Hispanic/Latino',
    'Asian-American',
    'Indigenous Communities',
    'Immigrant Communities',
    'Entrepreneurs & Small Business Owners',
    'Pet Owners',
    'Health & Wellness Enthusiasts',
    'Sustainable & Zero-Waste Shoppers',
    'Luxury & High-End Consumers'
  ];
  

  const handleEventPreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setEventPreference(selected);
  };

  const handleDemographicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setDemographic(selected);
  };

  const handleNextStepClick = () => {
    router.push('/vendor-profile/businessSchedule');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Customer section */}
        <div className="w-[50%]">
          <h2 className="text-md text-gray-500">Step 03/05</h2>
          <h1 className="text-5xl font-bold mb-8">Tell us about your customers</h1>

          {/* Ideal Customer */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Who is your ideal customer?</h2>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={idealCustomer}
              onChange={(e) => setIdealCustomer(e.target.value)}
              required
            >
              <option value="">Select customer type</option>
              {customerTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Event Preferences */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">What type of events do you prefer?</h2>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded"
              value={eventPreference}
              onChange={handleEventPreferenceChange}
              size={5}
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          {/* Target Demographic */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Who is your target demographic?</h2>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded"
              value={demographic}
              onChange={handleDemographicChange}
              size={5}
            >
              {demographics.map((demo) => (
                <option key={demo} value={demo}>{demo}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          {/* Navigation */}
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

export default BusinessCustomer;