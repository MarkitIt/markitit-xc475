/**
 * Migration script to update existing event documents
 * This script converts detailed_date strings to proper startDate and endDate timestamps
 */

const admin = require('firebase-admin');
const { DateTime } = require('luxon');
const path = require('path');

// You need to generate a service account key from the Firebase console
// Go to Project Settings > Service Accounts > Generate New Private Key
// Save the file securely and reference it here
const serviceAccountPath = path.resolve(__dirname, '../../../firebase-service-account.json');

// Initialize Firebase Admin with your service account
try {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
  console.error('Make sure your service account file is correctly placed at:', serviceAccountPath);
  process.exit(1);
}

const db = admin.firestore();

/**
 * Parse an event date string into startDate and endDate timestamps
 * @param {string} detailedDate - The raw date string to parse
 * @returns {Object} Object containing startDate and endDate timestamps
 */
function parseEventDate(detailedDate) {
  if (!detailedDate) return { startDate: null, endDate: null };
  
  const currentYear = new Date().getFullYear();
  
  // Normalize the input string to remove any extra spaces and standardize separators
  const normalizedDate = detailedDate.trim().replace(/\s+/g, ' ');
  console.log(`Attempting to parse: "${normalizedDate}"`);
  
  let startDate = null;
  let endDate = null;
  
  try {
    // Map timezone abbreviations to IANA timezone names
    function mapTimezone(tzAbbr) {
      const timezoneMap = {
        'EDT': 'America/New_York',
        'EST': 'America/New_York',
        'CDT': 'America/Chicago',
        'CST': 'America/Chicago',
        'MDT': 'America/Denver',
        'MST': 'America/Denver',
        'PDT': 'America/Los_Angeles',
        'PST': 'America/Los_Angeles'
      };
      return timezoneMap[tzAbbr] || 'America/New_York'; // Default to Eastern
    }
    
    // Eventeny format with GMT timezone: "Sep 24, 2022 · 8:00 AM - Sep 24, 2022 · 2:30 PM(GMT-04:00) Eastern Time (US & Canada)"
    const eventenyRegex = /([A-Za-z]+ \d{1,2}, \d{4})(?:\s*·\s*|\s+)(\d{1,2}:\d{2} [APap][Mm]) - ([A-Za-z]+ \d{1,2}, \d{4})(?:\s*·\s*|\s+)(\d{1,2}:\d{2} [APap][Mm])(?:\((?:[Gg][Mm][Tt][+-]\d{2}:\d{2})?\)?(?:.*)?)?/;
    
    // EventBrite multiple days format: "May 31 · 10am - June 1 · 6pm EDT" or "June 21 · 4pm - June 22 · 1:30am EDT"
    const eventBriteMultiDayRegex = /([A-Za-z]+ \d{1,2})(?:\s*·\s*|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm]) - ([A-Za-z]+ \d{1,2})(?:\s*·\s*|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm])(?: ([A-Za-z]{3,4}))?/;
    
    // Weekday with time format: "Saturday, April 26 · 3 - 6pm EDT" or "Monday, April 28 · 7 - 10pm EDT"
    const weekdayTimeRangeRegex = /([A-Za-z]+, [A-Za-z]+ \d{1,2})(?:\s*·\s*|\s+)(\d{1,2}(?::\d{2})?)(?:\s+-\s+|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm])(?: ([A-Za-z]{3,4}))?/;
    
    // Weekday with time range (AM/PM on both): "Saturday, April 12 · 11:30am - 7:30pm EDT"
    const weekdayAmPmTimeRangeRegex = /([A-Za-z]+, [A-Za-z]+ \d{1,2})(?:\s*·\s*|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm])(?:\s+-\s+|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm])(?: ([A-Za-z]{3,4}))?/;
    
    // Weekday with doors info: "Sunday, April 27 · 12 - 11:30pm EDT. Doors at 11:48am"
    const weekdayWithDoorsRegex = /([A-Za-z]+, [A-Za-z]+ \d{1,2})(?:\s*·\s*|\s+)(\d{1,2}(?::\d{2})?)(?:\s+-\s+|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm])(?: ([A-Za-z]{3,4}))?\.\s+Doors at.*/;
    
    // Zapplication format: "9/14/25 - 9/14/25" or "9/20/25 - 9/21/25"
    const zapplicationRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4}) - (\d{1,2}\/\d{1,2}\/\d{2,4})/;
    
    // Try to match the pattern against all regexes, in order of specificity/frequency
    
    // Check for Eventeny GMT format first (most specific and most common in the dataset)
    if (eventenyRegex.test(normalizedDate)) {
      const match = normalizedDate.match(eventenyRegex);
      console.log("Matched eventenyRegex:", match);
      
      try {
        // Extract timezone info
        let timezone = 'America/New_York'; // Default to Eastern Time
        if (normalizedDate.includes('GMT-05:00') || normalizedDate.includes('Central Time')) {
          timezone = 'America/Chicago'; // Central Time
        }
        
        // Parse dates with timezone
        startDate = DateTime.fromFormat(`${match[1]} ${match[2]}`, 'MMMM d, yyyy h:mm a', { zone: timezone });
        endDate = DateTime.fromFormat(`${match[3]} ${match[4]}`, 'MMMM d, yyyy h:mm a', { zone: timezone });
        
        // Try alternate format if first attempt fails
        if (!startDate.isValid) {
          startDate = DateTime.fromFormat(`${match[1]} ${match[2]}`, 'MMM d, yyyy h:mm a', { zone: timezone });
        }
        
        if (!endDate.isValid) {
          endDate = DateTime.fromFormat(`${match[3]} ${match[4]}`, 'MMM d, yyyy h:mm a', { zone: timezone });
        }
      } catch (err) {
        console.error(`Error parsing Eventeny format: ${err.message}`);
      }
    }
    // EventBrite multi-day format
    else if (eventBriteMultiDayRegex.test(normalizedDate)) {
      const match = normalizedDate.match(eventBriteMultiDayRegex);
      console.log("Matched eventBriteMultiDayRegex:", match);
      
      try {
        // Convert timezone abbreviation to IANA name
        const tzAbbr = match[5] || 'EDT';
        const timezone = mapTimezone(tzAbbr);
        
        // Add current year if not present
        const startMonth = match[1];
        const startTime = match[2];
        const endMonth = match[3];
        const endTime = match[4];
        
        startDate = DateTime.fromFormat(`${startMonth} ${currentYear} ${startTime}`, 'MMMM d yyyy h:mma', { zone: timezone });
        endDate = DateTime.fromFormat(`${endMonth} ${currentYear} ${endTime}`, 'MMMM d yyyy h:mma', { zone: timezone });
      } catch (err) {
        console.error(`Error parsing EventBrite multi-day format: ${err.message}`);
      }
    }
    // Weekday with AM/PM time range
    else if (weekdayAmPmTimeRangeRegex.test(normalizedDate)) {
      const match = normalizedDate.match(weekdayAmPmTimeRangeRegex);
      console.log("Matched weekdayAmPmTimeRangeRegex:", match);
      
      try {
        // Convert timezone abbreviation to IANA name
        const tzAbbr = match[4] || 'EDT';
        const timezone = mapTimezone(tzAbbr);
        
        // Parse the date parts
        const dayMonth = match[1]; // e.g., "Saturday, April 12"
        const startTime = match[2]; // e.g., "11:30am"
        const endTime = match[3]; // e.g., "7:30pm"
        
        startDate = DateTime.fromFormat(`${dayMonth} ${currentYear} ${startTime}`, 'EEEE, MMMM d yyyy h:mma', { zone: timezone });
        endDate = DateTime.fromFormat(`${dayMonth} ${currentYear} ${endTime}`, 'EEEE, MMMM d yyyy h:mma', { zone: timezone });
      } catch (err) {
        console.error(`Error parsing weekday AM/PM format: ${err.message}`);
      }
    }
    // Weekday with time (only end has AM/PM)
    else if (weekdayTimeRangeRegex.test(normalizedDate)) {
      const match = normalizedDate.match(weekdayTimeRangeRegex);
      console.log("Matched weekdayTimeRangeRegex:", match);
      
      try {
        // Convert timezone abbreviation to IANA name
        const tzAbbr = match[4] || 'EDT';
        const timezone = mapTimezone(tzAbbr);
        
        // Parse the date parts
        const dayMonth = match[1]; // e.g., "Saturday, April 26"
        let startTime = match[2]; // e.g., "3"
        const endTime = match[3]; // e.g., "6pm"
        
        // Determine AM/PM for start time based on end time
        const isPM = endTime.toLowerCase().includes('pm');
        const isAM = endTime.toLowerCase().includes('am');
        
        // For start time with no AM/PM, derive it from end time 
        // (Assume same AM/PM unless end time is earlier numericaly, or specifically says AM when 12 or higher)
        if (!startTime.toLowerCase().includes('am') && !startTime.toLowerCase().includes('pm')) {
          const startHour = parseInt(startTime.split(':')[0]);
          const endHour = parseInt(endTime.split(':')[0]);
          
          // Logic for determining if start is AM or PM based on end time
          if (isPM && (startHour <= endHour || endHour < 12)) {
            startTime += 'pm';
          } else if (isAM) {
            startTime += 'am';
          } else {
            // Default to PM for events
            startTime += 'pm';
          }
        }
        
        startDate = DateTime.fromFormat(`${dayMonth} ${currentYear} ${startTime}`, 'EEEE, MMMM d yyyy h:mma', { zone: timezone });
        endDate = DateTime.fromFormat(`${dayMonth} ${currentYear} ${endTime}`, 'EEEE, MMMM d yyyy h:mma', { zone: timezone });
      } catch (err) {
        console.error(`Error parsing weekday time range format: ${err.message}`);
      }
    }
    // Weekday with doors info
    else if (weekdayWithDoorsRegex.test(normalizedDate)) {
      const match = normalizedDate.match(weekdayWithDoorsRegex);
      console.log("Matched weekdayWithDoorsRegex:", match);
      
      try {
        // Convert timezone abbreviation to IANA name
        const tzAbbr = match[4] || 'EDT';
        const timezone = mapTimezone(tzAbbr);
        
        // Parse the date parts
        const dayMonth = match[1]; // e.g., "Sunday, April 27"
        let startTime = match[2]; // e.g., "12"
        const endTime = match[3]; // e.g., "11:30pm"
        
        // When no AM/PM on start, inherit from end time or default to PM
        if (!startTime.toLowerCase().includes('am') && !startTime.toLowerCase().includes('pm')) {
          const isPM = endTime.toLowerCase().includes('pm');
          if (isPM) {
            startTime += 'pm';
          } else {
            startTime += 'am'; // Default to AM if end is AM
          }
        }
        
        startDate = DateTime.fromFormat(`${dayMonth} ${currentYear} ${startTime}`, 'EEEE, MMMM d yyyy h:mma', { zone: timezone });
        endDate = DateTime.fromFormat(`${dayMonth} ${currentYear} ${endTime}`, 'EEEE, MMMM d yyyy h:mma', { zone: timezone });
      } catch (err) {
        console.error(`Error parsing weekday with doors format: ${err.message}`);
      }
    }
    // Zapplication format
    else if (zapplicationRegex.test(normalizedDate)) {
      const match = normalizedDate.match(zapplicationRegex);
      console.log("Matched zapplicationRegex:", match);
      
      try {
        // Zapplication typically uses MM/DD/YY format
        // For dates, we'll use noon (12:00 PM) as start and 11:59 PM as end time
        startDate = DateTime.fromFormat(match[1], 'M/d/yy', { zone: 'local' }).set({ hour: 12 });
        
        // For end date, use 11:59 PM of the end date
        endDate = DateTime.fromFormat(match[2], 'M/d/yy', { zone: 'local' }).set({ hour: 23, minute: 59 });
      } catch (err) {
        console.error(`Error parsing Zapplication format: ${err.message}`);
      }
    }
    else {
      console.log(`Could not match any regex pattern for: "${normalizedDate}"`);
    }
    
    // Validate the parsed dates
    if (startDate && !startDate.isValid) {
      console.log(`Invalid start date parsed: ${startDate.invalidReason} - ${startDate.invalidExplanation}`);
      startDate = null;
    }
    
    if (endDate && !endDate.isValid) {
      console.log(`Invalid end date parsed: ${endDate.invalidReason} - ${endDate.invalidExplanation}`);
      endDate = null;
    }

  } catch (error) {
    console.error(`Error parsing date "${normalizedDate}":`, error);
    return { startDate: null, endDate: null };
  }

  function toFirebaseTimestamp(dateTime) {
    if (!dateTime || !dateTime.isValid) return null;
    return admin.firestore.Timestamp.fromDate(dateTime.toJSDate());
  }

  // Debug output
  if (startDate && endDate) {
    console.log(`Successfully parsed dates:
      Start: ${startDate.toISO()} (${startDate.toLocaleString(DateTime.DATETIME_FULL)})
      End: ${endDate.toISO()} (${endDate.toLocaleString(DateTime.DATETIME_FULL)})
    `);
  } else {
    console.log(`Failed to parse complete date range for "${normalizedDate}"`);
  }

  return {
    startDate: toFirebaseTimestamp(startDate),
    endDate: toFirebaseTimestamp(endDate),
  };
}

/**
 * Main function to process all existing events
 */
async function migrateExistingEvents() {
  try {
    console.log('Starting event date migration...');
    
    // Check if force mode is enabled (will update even if timestamps exist)
    const forceMode = process.argv.includes('--force');
    if (forceMode) {
      console.log('FORCE MODE ENABLED: Will update all events with detailed_date, even if they already have timestamps');
    }
    
    // Get all events
    const eventsSnapshot = await db.collection('events').get();
    
    console.log(`Found ${eventsSnapshot.docs.length} total events`);
    
    // Track our progress
    let updateCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    let skippedNoDateCount = 0;
    let skippedExistingTimestampsCount = 0;
    let parsedButSameCount = 0;
    let batchSize = 0;
    
    // Use batch writes for efficiency
    let batch = db.batch();
    
    // Log the first few document IDs and their detailed_date fields
    console.log('\nSample of events being processed:');
    for (let i = 0; i < Math.min(5, eventsSnapshot.docs.length); i++) {
      const sampleDoc = eventsSnapshot.docs[i];
      const sampleData = sampleDoc.data();
      console.log(`Event ${i+1}: ID=${sampleDoc.id}, detailed_date="${sampleData.detailed_date || 'NOT SET'}"`);
      if (sampleData.startDate) {
        console.log(`  Already has startDate: ${sampleData.startDate.toDate().toISOString()}`);
      }
      if (sampleData.endDate) {
        console.log(`  Already has endDate: ${sampleData.endDate.toDate().toISOString()}`);
      }
    }
    console.log('\nBeginning processing of all events...\n');
    
    for (const doc of eventsSnapshot.docs) {
      const eventData = doc.data();
      const eventId = doc.id;
      
      // Skip if no detailed_date exists
      if (!eventData.detailed_date) {
        console.log(`Skipping event ${eventId}: no detailed_date field`);
        skipCount++;
        skippedNoDateCount++;
        continue;
      }
      
      // Skip if already has proper timestamps and not in force mode
      if (!forceMode && eventData.startDate && eventData.endDate) {
        console.log(`Skipping event ${eventId}: already has timestamps`);
        skipCount++;
        skippedExistingTimestampsCount++;
        continue;
      }
      
      try {
        // Parse the dates
        console.log(`Processing event ${eventId} with detailed_date: "${eventData.detailed_date}"`);
        const { startDate, endDate } = parseEventDate(eventData.detailed_date);
        
        // Skip if parsing failed
        if (!startDate && !endDate) {
          console.log(`Skipping event ${eventId}: couldn't parse dates from "${eventData.detailed_date}"`);
          skipCount++;
          continue;
        }
        
        // Check if the new timestamps match existing ones (to avoid unnecessary updates)
        let needsUpdate = false;
        
        // If in force mode, always update
        if (forceMode) {
          needsUpdate = true;
        } 
        // Otherwise, compare with existing timestamps
        else {
          // Check if startDate needs updating
          if (!eventData.startDate && startDate) {
            needsUpdate = true;
          } else if (eventData.startDate && startDate && 
                    eventData.startDate.seconds !== startDate.seconds) {
            needsUpdate = true;
            console.log(`Updating startDate: ${eventData.startDate.toDate().toISOString()} -> ${startDate.toDate().toISOString()}`);
          }
          
          // Check if endDate needs updating
          if (!eventData.endDate && endDate) {
            needsUpdate = true;
          } else if (eventData.endDate && endDate && 
                    eventData.endDate.seconds !== endDate.seconds) {
            needsUpdate = true;
            console.log(`Updating endDate: ${eventData.endDate.toDate().toISOString()} -> ${endDate.toDate().toISOString()}`);
          }
          
          // Skip if no changes needed
          if (!needsUpdate) {
            console.log(`Skipping event ${eventId}: parsed timestamps match existing ones`);
            skipCount++;
            parsedButSameCount++;
            continue;
          }
        }
        
        // Prepare update data
        const updateData = {};
        if (startDate) updateData.startDate = startDate;
        if (endDate) updateData.endDate = endDate;
        
        // Add to batch
        batch.update(doc.ref, updateData);
        batchSize++;
        updateCount++;
        
        console.log(`Added event ${eventId} to batch with startDate: ${startDate?.toDate().toISOString()}, endDate: ${endDate?.toDate().toISOString()}`);
        
        // Commit in batches of 500 (Firestore batch limit)
        if (batchSize >= 500) {
          console.log(`Committing batch of ${batchSize} updates...`);
          await batch.commit();
          batch = db.batch();
          batchSize = 0;
          console.log('Batch committed successfully');
        }
      } catch (error) {
        console.error(`Error processing event ${eventId}:`, error);
        errorCount++;
      }
    }
    
    // Commit any remaining updates
    if (batchSize > 0) {
      console.log(`Committing final batch of ${batchSize} updates...`);
      await batch.commit();
      console.log('Final batch committed successfully');
    } else {
      console.log('No updates to commit');
    }
    
    console.log('\nMigration Summary:');
    console.log(`- Total events processed: ${eventsSnapshot.docs.length}`);
    console.log(`- Events updated: ${updateCount}`);
    console.log(`- Events skipped: ${skipCount}`);
    console.log(`  - No detailed_date field: ${skippedNoDateCount}`);
    console.log(`  - Already has timestamps: ${skippedExistingTimestampsCount}`);
    console.log(`  - Parsed but same as existing: ${parsedButSameCount}`);
    console.log(`- Errors encountered: ${errorCount}`);
    
    if (updateCount === 0) {
      console.log('\nNOTE: No events were updated. If you want to force update all events,');
      console.log('even if they already have timestamps, run with: npm run migrate -- --force');
    }
    
  } catch (error) {
    console.error('Migration failed with error:', error);
  }
}

/**
 * Test function to validate our date parsing with sample formats
 */
async function testDateParsing() {
  console.log('='.repeat(80));
  console.log('TESTING DATE PARSING WITH SAMPLE FORMATS');
  console.log('='.repeat(80));
  
  const testCases = [
    // Eventeny format with different timezones
    "Jun 28, 2024 · 10:00 AM - Jun 30, 2024 · 7:00 PM(GMT-05:00) Central Time (US & Canada)",
    "Mar 01, 2025 · 1:00 PM - Mar 01, 2025 · 6:00 PM(GMT-04:00) Eastern Time (US & Canada)",
    "Sep 24, 2022 · 8:00 AM - Sep 24, 2022 · 2:30 PM(GMT-04:00) Eastern Time (US & Canada)",
    
    // EventBrite multi-day formats
    "June 21 · 4pm - June 22 · 1:30am EDT",
    "May 31 · 10am - June 1 · 6pm EDT",
    
    // Weekday formats with only end time having AM/PM
    "Monday, April 28 · 7 - 10pm EDT",
    "Saturday, April 26 · 3 - 6pm EDT",
    "Saturday, April 5 · 10am - 6pm EDT",
    
    // Weekday formats with both times having AM/PM
    "Saturday, April 12 · 11:30am - 7:30pm EDT",
    "Sunday, April 20 · 10am - 12pm EDT",
    
    // Weekday with doors info
    "Sunday, April 27 · 12 - 11:30pm EDT. Doors at 11:48am",
    "Saturday, April 5 · 3 - 6pm EDT. Doors at 2:45pm",
    
    // Zapplication format
    "9/14/25 - 9/14/25",
    "9/20/25 - 9/21/25"
  ];
  
  console.log(`Testing ${testCases.length} sample date formats...\n`);
  
  // Track overall success
  let successCount = 0;
  let partialCount = 0;
  let failCount = 0;
  
  for (const testCase of testCases) {
    console.log('-'.repeat(40));
    console.log(`Test case: "${testCase}"`);
    
    const result = parseEventDate(testCase);
    
    if (result.startDate && result.endDate) {
      console.log('✅ SUCCESS - Parsed both start and end dates');
      console.log(`Start date: ${result.startDate.toDate().toISOString()}`);
      console.log(`End date: ${result.endDate.toDate().toISOString()}`);
      successCount++;
    } else if (result.startDate) {
      console.log('⚠️ PARTIAL - Parsed only start date');
      console.log(`Start date: ${result.startDate.toDate().toISOString()}`);
      partialCount++;
    } else if (result.endDate) {
      console.log('⚠️ PARTIAL - Parsed only end date');
      console.log(`End date: ${result.endDate.toDate().toISOString()}`);
      partialCount++;
    } else {
      console.log('❌ FAILED - Could not parse dates');
      failCount++;
    }
    console.log('-'.repeat(40) + '\n');
  }
  
  // Show a summary of the test results
  console.log('Test Results Summary:');
  console.log(`- Total test cases: ${testCases.length}`);
  console.log(`- Successful parses: ${successCount} (${Math.round(successCount/testCases.length*100)}%)`);
  console.log(`- Partial parses: ${partialCount} (${Math.round(partialCount/testCases.length*100)}%)`);
  console.log(`- Failed parses: ${failCount} (${Math.round(failCount/testCases.length*100)}%)`);
  
  console.log('='.repeat(80));
  console.log('DATE PARSING TEST COMPLETE');
  console.log('='.repeat(80));
  console.log('\n');
}

// Modify the main function to run tests first if in test mode
async function main() {
  // Check if we're in test mode
  const isTestMode = process.argv.includes('--test');
  
  if (isTestMode) {
    console.log('Running in TEST MODE - will not modify the database');
    await testDateParsing();
    console.log('Test complete. To run the actual migration, use: npm run migrate');
    process.exit(0);
  } else {
    console.log('Running in PRODUCTION MODE - will update the database');
    await migrateExistingEvents();
    console.log('Migration complete');
  }
}

// Run the script
main()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 