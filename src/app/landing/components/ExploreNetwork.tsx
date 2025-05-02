import { useEffect, useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import styles from '../styles.module.css';

interface Vendor {
  id: string;
  businessName: string;
  categories: string[];
  city: string;
  state: string;
}

export default function ExploreNetwork() {
  const { vendorProfile } = useUserContext();
  const [otherVendors, setOtherVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchOtherVendors = async () => {
      if (!vendorProfile?.id || !isClient) return;

      try {
        const vendorsRef = collection(db, 'vendorProfile');
        const q = query(
          vendorsRef,
          orderBy('businessName'),
          limit(4)
        );

        const querySnapshot = await getDocs(q);
        const vendors = querySnapshot.docs
          .filter(doc => doc.id !== vendorProfile.id)
          .slice(0, 3)
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Vendor[];

        setOtherVendors(vendors);
      } catch (error) {
        console.error('Error fetching other vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherVendors();
  }, [vendorProfile, isClient]);

  if (!isClient || loading) {
    return <div className={styles.loading}>Loading network...</div>;
  }

  if (!otherVendors.length) {
    return <div className={styles.noVendors}>No other vendors found</div>;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Explore the Network</h2>
      <div className={styles.vendorsGrid}>
        {otherVendors.map((vendor) => (
          <Link href={`/vendor-profile/${vendor.id}`} key={vendor.id} className={styles.vendorCard}>
            <div className={styles.vendorContent}>
              <h3 className={styles.businessName}>{vendor.businessName}</h3>
              <div className={styles.categories}>
                {vendor.categories?.slice(0, 3).map((category, index) => (
                  <span key={index} className={styles.categoryTag}>
                    {category}
                  </span>
                ))}
              </div>
              <p className={styles.location}>
                {vendor.city}, {vendor.state}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <Link href="/search-vendors" className={styles.readMoreButton}>
          View More
        </Link>
      </div>
    </section>
  );
} 