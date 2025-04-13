"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function VendorProfilePage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessName && category && shortDescription && fullDescription) {
      router.push('/create-profile/vendor/businessAdjective');
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div className="container">
      {/* Step Indicator */}
      <div className="step-icons">
        <span className="active">▲</span>
        <span>★</span>
        <span>⌂</span>
        <span>●</span>
        <span>⟶</span>
      </div>

      <div>
        <p>Step 01/05</p>
        <h1>Create Business Profile</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Category/Industry</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Short Business description</label>
          <p className="subtext">Provide 1-2 sentences about what you sell.</p>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Full Business description</label>
          <p className="subtext">Tell us about your brand, your mission, or unique selling points.</p>
          <textarea
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            required
          />
        </div>

        <div className="button-row">
          <button type="submit" className="button-next">
            Next Steps
          </button>
        </div>
      </form>
    </div>
  );
}