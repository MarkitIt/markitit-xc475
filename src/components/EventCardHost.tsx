import Link from 'next/link';
import { Event } from '@/types/Event';
import { theme } from '@/styles/theme';

interface EventProps {
  event: Event;
  rank?: number;
  showRank?: boolean;
}

export function EventCardHost({ event, rank, showRank }: EventProps) {

  // Format date as startDate - endDate
  const formatDate = (timestamp: any) => {
    if (!timestamp) return null;
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };
  
  // Format the date display
  let dateDisplay = 'Date not available';
  if (event.startDate && event.endDate) {
    const startFormatted = formatDate(event.startDate);
    const endFormatted = formatDate(event.endDate);
    
    if (startFormatted === endFormatted) {
      // Single day event
      dateDisplay = startFormatted as string;
    } else {
      // Multi-day event
      dateDisplay = `${startFormatted} - ${endFormatted}`;
    }
  } else if (event.startDate) {
    // Only start date available
    dateDisplay = formatDate(event.startDate) as string;
  }
  
  return (
    <div style={{
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: theme.colors.background.white,
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      height: '100%',
    }}
    className="hover:shadow-lg hover:transform hover:scale-102"
    >
      {showRank && rank && rank <= 20 && (
        <div style={{
          position: 'absolute',
          top: theme.spacing.sm,
          right: theme.spacing.sm,
          backgroundColor: theme.colors.primary.sand,
          color: theme.colors.primary.black,
          borderRadius: theme.borderRadius.full,
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          fontWeight: theme.typography.fontWeight.semibold,
          fontSize: '0.875rem',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '2.5rem',
          height: '2rem',
        }}>
          #{rank}
        </div>
      )}
      <div style={{ height: '12rem', backgroundColor: theme.colors.secondary.lightPink }}>
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: theme.colors.primary.beige,
            color: theme.colors.primary.black,
            fontFamily: theme.typography.fontFamily.primary,
          }}>
            No Image
          </div>
        )}
      </div>

      <div style={{ padding: theme.spacing.lg }}>
        <h3 style={{
          fontWeight: theme.typography.fontWeight.semibold,
          fontSize: '1.125rem',
          marginBottom: theme.spacing.sm,
          color: theme.colors.text.primary,
          fontFamily: theme.typography.fontFamily.primary,
        }}>{event.name}</h3>
        <p style={{
          color: theme.colors.text.secondary,
          fontSize: '1rem',
          marginBottom: theme.spacing.xs,
          fontFamily: theme.typography.fontFamily.primary,
        }}>{`${event.location?.city || 'Unknown'}, ${event.location?.state || 'Unknown'}`}</p>
        <p style={{
          color: theme.colors.primary.coral,
          fontSize: '0.875rem',
          fontFamily: theme.typography.fontFamily.primary,
        }}>{dateDisplay}</p>
      </div>
    </div>
  );
} 