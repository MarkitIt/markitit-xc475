import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import styles from '../styles.module.css';
import type { EventFormatted } from "@/app/api/rankEvents/route";
import type { Vendor } from "@/types/Vendor";
import type { ScoreBreakdown as ScoreBreakdownType } from "@/app/api/rankEvents/route";

interface ScoreBreakdownProps {
  event: EventFormatted & { scoreBreakdown: ScoreBreakdownType };
  vendor: Vendor;
}

const formatFactorName = (key: string): string => {
  return key
    .replace(/Raw$/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str: string) => str.toUpperCase());
};

const getJustification = (key: keyof ScoreBreakdownType, event: EventFormatted, vendor: Vendor, scoreBreakdown: ScoreBreakdownType): string => {
  const vendorPrefsLower = new Set(vendor.eventPreference?.map((p: string) => p.toLowerCase().trim()).filter(Boolean) || []);
  const eventTagsLower = new Set(event.category_tags?.map((t: string) => t.toLowerCase().trim()).filter(Boolean) || []);
  const vendorCitiesLower = new Set(vendor.cities?.map((c: string) => c.toLowerCase().trim()).filter(Boolean) || []);
  const eventCityLower = event.location?.city?.toLowerCase().trim();
  const vendorMaxFee = vendor.budget?.maxVendorFee;
  const vendorDemosLower = new Set(vendor.demographic?.map((d: string) => d.toLowerCase().trim()).filter(Boolean) || []);
  const eventGuessLower = new Set(event.demographic_guess?.map((g: string) => g.toLowerCase().trim()).filter(Boolean) || []);
  const vendorPreferredSizeMin = vendor.preferredEventSize?.min;
  const vendorPreferredSizeMax = vendor.preferredEventSize?.max;
  const eventNumVendors = event.num_vendors;
  const eventHeadcount = event.estimated_headcount;
  const vendorPreferredDaysLower = new Set(vendor.schedule?.preferredDays?.map((d: string) => d.toLowerCase().trim()).filter(Boolean) || []);
  const vendorCatsLower = new Set(vendor.categories?.map((c: string) => c.toLowerCase().trim()).filter(Boolean) || []);
  const eventVendorCatsLower = new Set(event.vendor_categories?.map((vc: string) => vc.toLowerCase().trim()).filter(Boolean) || []);

  const formatArrayForJoin = (arr: Set<string>): string[] => Array.from(arr);

  switch (key) {
    case "eventTypeScoreRaw":
      const matchingTypes = Array.from(eventTagsLower).filter(tag => vendorPrefsLower.has(tag));
      if (matchingTypes.length > 0) return `Matched event types: ${matchingTypes.join(', ')}.`;
      if (vendorPrefsLower.size > 0 && eventTagsLower.size === 0) return "Event has no specified type tags to match your preferences.";
      if (vendorPrefsLower.size === 0 && eventTagsLower.size > 0) return "You haven't specified preferred event types.";
      return "No matching event types found.";
    case "locationScoreRaw":
      if (eventCityLower && vendorCitiesLower.has(eventCityLower)) return `Matched your preferred city: ${event.location?.city}.`;
      if (eventCityLower && vendorCitiesLower.size > 0) return `Event location (${event.location?.city}) doesn't match your preferred cities: ${formatArrayForJoin(vendorCitiesLower).join(', ')}.`;
      if (!eventCityLower && vendorCitiesLower.size > 0) return "Event location is unspecified.";
      if (eventCityLower && vendorCitiesLower.size === 0) return "You haven't specified preferred cities.";
      return "Location preference or event location missing.";
    case "budgetScoreRaw":
      if (vendorMaxFee !== undefined) return `Based on your max fee preference of $${vendorMaxFee}.`;
      return "Your max vendor fee preference is not set.";
    case "demographicsScoreRaw":
      const matchingDemos = Array.from(eventGuessLower).filter(demo => vendorDemosLower.has(demo));
      if (matchingDemos.length > 0) return `Matched target audience: ${matchingDemos.join(', ')}.`;
      if (vendorDemosLower.size > 0 && eventGuessLower.size === 0) return "Event demographics are unspecified.";
      if (vendorDemosLower.size === 0 && eventGuessLower.size > 0) return "You haven't specified target demographics.";
      return "No matching demographics found.";
    case "eventSizeScoreRaw":
      const vendorPrefSizeText = vendorPreferredSizeMin !== undefined && vendorPreferredSizeMax !== undefined
        ? `${vendorPreferredSizeMin}-${vendorPreferredSizeMax === Infinity ? '+' : vendorPreferredSizeMax} vendors`
        : "not specified";
      if (eventNumVendors !== undefined && eventNumVendors !== null) return `Event has ${eventNumVendors} vendors. Your preference: ${vendorPrefSizeText}.`;
      return `Your preference: ${vendorPrefSizeText}. Event vendor count unspecified.`;
    case "scheduleScoreRaw":
      if (vendorPreferredDaysLower.size > 0) return `Based on your preferred days: ${formatArrayForJoin(vendorPreferredDaysLower).join(', ')}.`;
      return "You haven't specified preferred days.";
    case "productsScoreRaw":
      const matchingCats = Array.from(eventVendorCatsLower).filter(cat => vendorCatsLower.has(cat));
      if (matchingCats.length > 0) return `Matched your product categories: ${matchingCats.join(', ')}.`;
      if (vendorCatsLower.size > 0 && eventVendorCatsLower.size === 0) return "Event doesn't specify required vendor categories.";
      if (vendorCatsLower.size === 0 && eventVendorCatsLower.size > 0) return "Your product categories are not set.";
      return "No matching product categories found.";
    case "headcountScoreRaw":
      if (scoreBreakdown[key] && scoreBreakdown[key] > 0) {
        return "Event matches your headcount preferences.";
      }
      return "No matching headcount preferences.";
    default: return "Details for this score factor.";
  }
};

export default function ScoreBreakdown({ event, vendor }: ScoreBreakdownProps) {
  const scoreBreakdown = event?.scoreBreakdown;
  const userPriorityFactors = vendor?.eventPriorityFactors || [];

  if (!scoreBreakdown || !vendor) return null;

  const scoreFactorKeys: (keyof ScoreBreakdownType)[] = [
    "locationScoreRaw",
    "budgetScoreRaw",
    "scheduleScoreRaw",
    "eventSizeScoreRaw",
    "eventTypeScoreRaw",
    "demographicsScoreRaw",
    "headcountScoreRaw",
    "productsScoreRaw",
  ];

  const factorKeyToNameMap: { [key in keyof ScoreBreakdownType]?: string } = {
    eventTypeScoreRaw: "Event Type/Theme",
    locationScoreRaw: "Location",
    budgetScoreRaw: "Costs",
    demographicsScoreRaw: "Target Audience",
    eventSizeScoreRaw: "Number of Vendors",
    scheduleScoreRaw: "Schedule",
    productsScoreRaw: "Product Category Relevance",
    headcountScoreRaw: "Estimated Headcount",
  };

  return (
    <div className={styles.scoreBreakdown}>
      <div className={styles.scoreHeader}>
        <h2 className={styles.scoreTitle}>
          Why this score?
        </h2>
        <span className={styles.infoIcon}>
          <FontAwesomeIcon icon={faInfoCircle} title="Scores marked with a star are your priority factors. These are weighted more heavily based on your vendor profile preferences." />
        </span>
      </div>
      <div className={styles.scoreGrid}>
        {scoreFactorKeys.map((key) => {
          const keyStr = key as string;
          const rawScore = scoreBreakdown[key] as number ?? 0;
          const maxPointsKey = keyStr.replace('Raw', 'Max') as keyof ScoreBreakdownType;
          const max = scoreBreakdown[maxPointsKey] as number ?? 1;
          const percent = max > 0 ? Math.round((rawScore / max) * 100) : 0;

          const factorName = factorKeyToNameMap[key];
          const isPriority = factorName ? userPriorityFactors.includes(factorName) : false;

          const justification = getJustification(key, event, vendor, scoreBreakdown);

          const formattedKeyName = formatFactorName(keyStr);

          return (
            <div
              key={keyStr}
              className={`${styles.scoreCard} ${isPriority ? styles.priority : ''}`}
            >
              <div className={styles.scoreCardHeader}>
                <span className={styles.factorName}>{formattedKeyName}</span>
                {isPriority && (
                  <span className={styles.priorityLabel} title="Your Priority">
                    <FontAwesomeIcon icon={faStar} className={styles.priorityStar} />
                  </span>
                )}
              </div>
              <div className={styles.scoreValue}>
                {percent}%
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${percent}%` }} />
              </div>
              <div className={styles.scoreDescription}>
                {justification}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 