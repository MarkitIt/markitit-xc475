"use client"


import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BusinessProfileContextProps {
  businessName: string;
  setBusinessName: (name: string) => void;
  legalBusinessName: string;
  setLegalBusinessName: (name: string) => void;
  contactLegalName: string;
  setContactLegalName: (name: string) => void;
  contactPreferredName: string;
  setContactPreferredName: (name: string) => void;
  country: string;
  setCountryName: (name: string) => void;
  streetAddress: string;
  setStreetAddress: (address: string) => void;
  aptSuite: string;
  setAptSuite: (suite: string) => void;
  city: string;
  setCity: (city: string) => void;
  stateProvince: string;
  setStateProvince: (state: string) => void;
  zipPostalCode: string;
  setZipPostalCode: (zip: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  website: string;
  setWebsite: (website: string) => void;
  numberOfEmployees: string;
  setNumberOfEmployees: (employees: string) => void;
  description: string;
  setDescription: (description: string) => void;
  facebookLink: string;
  setFacebookLink: (link: string) => void;
  twitterHandle: string;
  setTwitterHandle: (handle: string) => void;
  instagramHandle: string;
  setInstagramHandle: (handle: string) => void;
}

const BusinessProfileContext = createContext<BusinessProfileContextProps | undefined>(undefined);

export const BusinessProfileProvider = ({ children }: { children: ReactNode }) => {
  const [businessName, setBusinessName] = useState("");
  const [legalBusinessName, setLegalBusinessName] = useState("");
  const [contactLegalName, setContactLegalName] = useState("");
  const [contactPreferredName, setContactPreferredName] = useState("");
  const [country, setCountryName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [aptSuite, setAptSuite] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [zipPostalCode, setZipPostalCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [description, setDescription] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  return (
    <BusinessProfileContext.Provider value={{
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
    }}>
      {children}
    </BusinessProfileContext.Provider>
  );
};

export const useBusinessProfileContext = () => {
  const context = useContext(BusinessProfileContext);
  if (!context) {
    throw new Error('useBusinessProfileContext must be used within a BusinessProfileProvider');
  }
  return context;
};