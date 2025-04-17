"use client";

import { useRouter } from 'next/navigation';
import { useBusinessAdjectiveContext } from '../../../context/BusinessAdjectiveContext';
import { useBusinessProfileContext } from '../../../context/BusinessProfileContext';
import { VendorTypeSelector } from './components/VendorTypeSelector';
import { CategorySelector } from './components/CategorySelector';
import { SocialMediaForm } from './components/SocialMediaForm';
import styles from './styles.module.css';

const BusinessAdjective = () => {
  const router = useRouter();
  const { selectedCategories, setSelectedCategories, vendorType, setVendorType } = useBusinessAdjectiveContext();
  const {
    website, setWebsite,
    description, setDescription,
    facebookLink, setFacebookLink,
    twitterHandle, setTwitterHandle,
    instagramHandle, setInstagramHandle
  } = useBusinessProfileContext();

  const handleNextStepClick = () => {
    router.push('/create-profile/vendor/businessLocation');
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.imagePlaceholder}></div>
        
        <div className={styles.formSection}>
          <h2 className={styles.stepIndicator}>Step 02/05</h2>
          <h1 className={styles.title}>Tell us about your business</h1>

          <VendorTypeSelector 
            vendorType={vendorType as "Food Vendor" | "Market Vendor" | null}
            setVendorType={setVendorType}
          />

          <CategorySelector 
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />

          <SocialMediaForm 
            website={website}
            description={description}
            facebookLink={facebookLink}
            twitterHandle={twitterHandle}
            instagramHandle={instagramHandle}
            onWebsiteChange={(e) => setWebsite(e.target.value)}
            onDescriptionChange={(e) => setDescription(e.target.value)}
            onFacebookLinkChange={(e) => setFacebookLink(e.target.value)}
            onTwitterHandleChange={(e) => setTwitterHandle(e.target.value)}
            onInstagramHandleChange={(e) => setInstagramHandle(e.target.value)}
          />

          <div className={styles.buttonGroup}>
            <div className={styles.helpButton}>Help</div>
            <div
              className={styles.nextButton}
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