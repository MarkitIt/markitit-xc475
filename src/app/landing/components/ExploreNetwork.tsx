import { useEffect, useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
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
  const [similarVendors, setSimilarVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarVendors = async () => {
      if (!vendorProfile?.city || !vendorProfile?.state) return;

      try {
        const vendorsRef = collection(db, 'vendorProfile');
        const q = query(
          vendorsRef,
          where('city', '==', vendorProfile.city),
          where('state', '==', vendorProfile.state),
          limit(4)
        );

        const querySnapshot = await getDocs(q);
        const vendors = querySnapshot.docs
          .filter(doc => doc.id !== vendorProfile.id) // Exclude current vendor
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Vendor[];

        setSimilarVendors(vendors);
      } catch (error) {
        console.error('Error fetching similar vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarVendors();
  }, [vendorProfile]);

  if (loading) return <div className={styles.loading}>Loading network...</div>;
  if (!similarVendors.length) return <div className={styles.noVendors}>No vendors found in your area</div>;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Explore the Network</h2>
      <div className={styles.vendorsGrid}>
        {similarVendors.map((vendor) => (
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
    </section>
  );
} 