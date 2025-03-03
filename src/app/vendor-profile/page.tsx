"use client";

import { collection, getDocs } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { useBusinessProfileContext } from '../../context/BusinessProfileContext';
import { db } from "../../lib/firebase";
import '../tailwind.css';

// Define the type for the profile data
interface Profile {
  id: string;
  name: string;
  description: string;
}

const BusinessProfile = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    businessName, setBusinessName,
    legalBusinessName, setLegalBusinessName,
    contactLegalName, setContactLegalName,
    contactPreferredName, setContactPreferredName,
    country, setCountryName,
    streetAddress, setStreetAddress,
    aptSuite, setAptSuite,
    city, setCity,
    stateProvince, setStateProvince,
    zipPostalCode, setZipPostalCode,
    email, setEmail,
    phone, setPhone,
    website, setWebsite,
    numberOfEmployees, setNumberOfEmployees,
    description, setDescription,
    facebookLink, setFacebookLink,
    twitterHandle, setTwitterHandle,
    instagramHandle, setInstagramHandle
  } = useBusinessProfileContext();

  const router = useRouter();

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", 
    "Congo, Republic of the", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", 
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", 
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", 
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", 
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", 
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", 
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", 
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", 
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", 
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", 
    "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", 
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", 
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  useEffect(() => {
    const fetchProfiles = async () => {
      const querySnapshot = await getDocs(collection(db, "businessProfiles"));
      const profilesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile));
      setProfiles(profilesData);
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessName(e.target.value);
  };

  const handleLegalBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLegalBusinessName(e.target.value);
  };

  const handleContactLegalNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactLegalName(e.target.value);
  };

  const handleContactPreferredNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactPreferredName(e.target.value);
  };

  const handleCountryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountryName(e.target.value);
  };

  const handleStreetAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreetAddress(e.target.value);
  };

  const handleAptSuiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAptSuite(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleStateProvinceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateProvince(e.target.value);
  };

  const handleZipPostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipPostalCode(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(e.target.value);
  };

  const handleNumberOfEmployeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfEmployees(e.target.value);
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

  const handleNextStepClick = () => {
    if (businessName && contactLegalName && country && streetAddress && city && stateProvince && zipPostalCode && email && phone) {
      router.push('/vendor-profile/businessAdjective');

    } else {
      alert("Please fill in all required fields.");
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
          <h1 className="text-5xl font-bold mb-8">Create Business Profile</h1>
          {/* All the fillable box form */}
          <div className="text-xl">
            
            <div className="">Business name<span className="text-red-500">*</span></div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={businessName}
              onChange={handleBusinessNameChange}
              required
            />

            <div className="">Legal business name</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={legalBusinessName}
              onChange={handleLegalBusinessNameChange}
              required
            />

            <div className="">Contact legal name<span className="text-red-500">*</span></div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={contactLegalName}
              onChange={handleContactLegalNameChange}
              required
            />

            <div className="">Contact preferred name</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={contactPreferredName}
              onChange={handleContactPreferredNameChange}
              required
            />

            <div className="">Country/region<span className="text-red-500">*</span></div>
            <select
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={country} 
              onChange={(e) => setCountryName(e.target.value)}
              required
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <div className="">Street address<span className="text-red-500">*</span></div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={streetAddress}
              onChange={handleStreetAddressChange}
              required
            />

            <div className="">Apt, suite. (optional)</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={aptSuite}
              onChange={handleAptSuiteChange}
              required
            />  

            <div className="">City<span className="text-red-500">*</span></div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={city}
              onChange={handleCityChange}
              required
            />

            <div className="">State/province<span className="text-red-500">*</span></div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={stateProvince}
              onChange={handleStateProvinceChange}
              required
            />

            <div className="">Zip/postal code<span className="text-red-500">*</span></div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={zipPostalCode}
              onChange={handleZipPostalCodeChange}
              required
            />

            <div className="">Email<span className="text-red-500">*</span></div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={email}
              onChange={handleEmailChange}
              required
            />    

            <div className="">Phone<span className="text-red-500">*</span></div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={phone}
              onChange={handlePhoneChange}
              required
            />    

            <div className="">Website</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={website}
              onChange={handleWebsiteChange}
              required
            />    

            <div className="">Number of employees</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              value={numberOfEmployees}
              onChange={handleNumberOfEmployeesChange}
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

          </div>

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

export default BusinessProfile;