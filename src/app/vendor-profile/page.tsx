"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { theme } from '@/styles/theme';
import Image from 'next/image';

export default function VendorProfilePage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [legalBusinessName, setLegalBusinessName] = useState('');
  const [contactLegalName, setContactLegalName] = useState('');
  const [contactPreferredName, setContactPreferredName] = useState('');
  const [country, setCountry] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [aptSuite, setAptSuite] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [zipPostalCode, setZipPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [numberOfEmployees, setNumberOfEmployees] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessName && contactLegalName && country && streetAddress && city && 
        stateProvince && zipPostalCode && email && phone && category) {
      router.push('/vendor-profile/businessAdjective');
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <main style={{
      backgroundColor: theme.colors.background.main,
      minHeight: 'calc(100vh - 80px)',
      padding: theme.spacing.xl,
      display: 'flex',
    }}>
      {/* Left side - Image */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: theme.spacing.xl,
      }}>
        <Image
          src="/icons/createProf.svg"
          alt="Business Profile Setup"
          width={400}
          height={400}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* Right side - Form */}
      <div style={{
        flex: 1,
        maxWidth: '600px',
      }}>
        <div style={{
          marginBottom: theme.spacing.xl,
        }}>
          <span style={{
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.secondary,
          }}>
            Step 01/05
          </span>
          <h1 style={{
            fontSize: theme.typography.fontSize.title,
            color: theme.colors.text.primary,
            marginTop: theme.spacing.md,
          }}>
            Create Business Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xl,
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Business Name<span style={{ color: theme.colors.primary.coral }}>*</span>
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Legal Business Name
            </label>
            <input
              type="text"
              value={legalBusinessName}
              onChange={(e) => setLegalBusinessName(e.target.value)}
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Category/Industry<span style={{ color: theme.colors.primary.coral }}>*</span>
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Contact Legal Name<span style={{ color: theme.colors.primary.coral }}>*</span>
            </label>
            <input
              type="text"
              value={contactLegalName}
              onChange={(e) => setContactLegalName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Contact Preferred Name
            </label>
            <input
              type="text"
              value={contactPreferredName}
              onChange={(e) => setContactPreferredName(e.target.value)}
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Country/Region<span style={{ color: theme.colors.primary.coral }}>*</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Street Address<span style={{ color: theme.colors.primary.coral }}>*</span>
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Apt, Suite (Optional)
            </label>
            <input
              type="text"
              value={aptSuite}
              onChange={(e) => setAptSuite(e.target.value)}
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xl }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.body,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
              }}>
                City<span style={{ color: theme.colors.primary.coral }}>*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: theme.spacing.md,
                  border: `1px solid ${theme.colors.text.secondary}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.body,
                  backgroundColor: theme.colors.background.white,
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.body,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
              }}>
                State/Province<span style={{ color: theme.colors.primary.coral }}>*</span>
              </label>
              <input
                type="text"
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: theme.spacing.md,
                  border: `1px solid ${theme.colors.text.secondary}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.body,
                  backgroundColor: theme.colors.background.white,
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Zip/Postal Code<span style={{ color: theme.colors.primary.coral }}>*</span>
            </label>
            <input
              type="text"
              value={zipPostalCode}
              onChange={(e) => setZipPostalCode(e.target.value)}
              required
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Email<span style={{ color: theme.colors.primary.coral }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Phone<span style={{ color: theme.colors.primary.coral }}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Number of Employees
            </label>
            <input
              type="number"
              value={numberOfEmployees}
              onChange={(e) => setNumberOfEmployees(e.target.value)}
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your brand, your mission, or unique selling points."
              style={{
                width: '100%',
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.body,
                backgroundColor: theme.colors.background.white,
                minHeight: '150px',
                resize: 'vertical',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              backgroundColor: theme.colors.primary.coral,
              color: theme.colors.background.white,
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.body,
              cursor: 'pointer',
              alignSelf: 'flex-start',
              marginTop: theme.spacing.lg,
            }}
          >
            Next Steps
          </button>
        </form>
      </div>
    </main>
  );
}