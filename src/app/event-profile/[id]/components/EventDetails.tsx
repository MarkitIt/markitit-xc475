import React from 'react';
import styles from '../styles.module.css';
import { Pill } from './Pill';

interface EventDetailsProps {
  event: any;
  formatDate: (date: { seconds: number; nanoseconds: number } | undefined) => string;
  renderBoothFees: (fees: any) => React.ReactElement;
}

export default function EventDetails({ event, formatDate, renderBoothFees }: EventDetailsProps) {
  return (
    <div className={styles.detailsSection}>
      {/* Details Card */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Event Details</h2>
        <div style={{ marginBottom: 12 }}><span className="info-label">Date</span><br /><span className="info-value">{formatDate(event.startDate)} - {formatDate(event.endDate)}</span></div>
        <div style={{ marginBottom: 12 }}><span className="info-label">Location</span><br /><span className="info-value">{event.location?.city}, {event.location?.state}</span></div>
        <div style={{ marginBottom: 12 }}><span className="info-label">Booth Fees</span><br /><span className="info-value">{renderBoothFees(event.booth_fees)}</span></div>
        <div style={{ marginBottom: 12 }}><span className="info-label">Estimated Headcount</span><br /><span className="info-value">{event.estimated_headcount && event.estimated_headcount !== 0 ? event.estimated_headcount : "Headcount/ Number of Vendors not provided by organizer"}</span></div>
        <div style={{ marginBottom: 12 }}><span className="info-label">Number of Vendors</span><br /><span className="info-value">{event.num_vendors && event.num_vendors !== 0 ? event.num_vendors : "Headcount/ Number of Vendors not provided by organizer"}</span></div>
      </div>

      {/* Tags Card */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Tags & Categories</h2>
        <div style={{ marginBottom: 10 }}><span className="info-label">Category Tags</span><br />{event.category_tags?.map((tag: string) => <Pill key={tag} color="#e0e7ff">{tag}</Pill>)}</div>
        <div style={{ marginBottom: 10 }}><span className="info-label">Type</span><br />{event.type && <Pill color="#fef3c7">{event.type}</Pill>}</div>
        <div style={{ marginBottom: 10 }}><span className="info-label">Demographics</span><br />{event.demographic_guess?.map((demo: string) => <Pill key={demo} color="#fce7f3">{demo}</Pill>)}</div>
        <div style={{ marginBottom: 10 }}><span className="info-label">Vendor Categories</span><br />{event.vendor_categories?.map((cat: string) => <Pill key={cat} color="#d1fae5">{cat}</Pill>)}</div>
      </div>
    </div>
  );
} 