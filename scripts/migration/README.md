# Event Dates Migration Script

This script migrates events in your Firestore database by converting `detailed_date` strings into proper `startDate` and `endDate` timestamp fields.

## Prerequisites

1. Node.js installed on your system
2. Firebase service account key (for authentication)

## Setup

1. **Generate a Firebase Service Account Key**:

   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Navigate to your project
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

2. **Place the Service Account Key**:

   - Rename the downloaded file to `firebase-service-account.json`
   - Move it to the root of your project (two directories up from this scripts folder)
   - Ensure it's at path: `markitit-xc475/firebase-service-account.json`

3. **Install Dependencies**:
   ```bash
   cd markitit-xc475/scripts/migration
   npm install
   ```

## Testing Date Parsing

Before running the actual migration, you can test the date parsing functionality:

```bash
npm run test
```

This will test parsing with several date formats to ensure they're handled correctly:

- EventBrite formats: "Sunday, April 20 · 10am - 12pm EDT"
- EventBrite multi-day formats: "May 31 · 10am - June 1 · 6pm EDT"
- Zapplication formats: "9/14/25 - 9/14/25" and "9/20/25 - 9/21/25"
- Eventeny formats: "Sep 24, 2022 · 8:00 AM - Sep 24, 2022 · 2:30 PM(GMT-04:00) Eastern Time (US & Canada)"

The test will not modify your database but will show which formats can be successfully parsed.

## Running the Migration

Once you've verified the date parsing works correctly, execute the migration script:

```bash
npm run migrate
```

### Force Update Mode

If all your events were skipped because they already have timestamps, but you want to force the script to update them anyway (for example, if they have incorrect timestamps), you can use force mode:

```bash
npm run migrate:force
```

This will update all events with a `detailed_date` field, regardless of whether they already have timestamps.

## What This Script Does

1. Connects to your Firestore database using the service account
2. Finds all events with a `detailed_date` field but missing `startDate` or `endDate`
3. Parses the `detailed_date` string into proper timestamp objects
4. Updates the events with the new timestamp fields
5. Provides a summary of the migration process

## Supported Date Formats

The script handles multiple date formats:

| Source       | Example Format                                                                           | Notes                                        |
| ------------ | ---------------------------------------------------------------------------------------- | -------------------------------------------- |
| EventBrite   | `Sunday, April 20 · 10am - 12pm EDT`                                                     | Single day event with AM/PM on both times    |
| EventBrite   | `Saturday, April 26 · 3 - 6pm EDT`                                                       | Single day event with AM/PM only on end time |
| EventBrite   | `May 31 · 10am - June 1 · 6pm EDT`                                                       | Multi-day event                              |
| EventBrite   | `June 21 · 4pm - June 22 · 1:30am EDT`                                                   | Multi-day event crossing midnight            |
| EventBrite   | `Sunday, April 27 · 12 - 11:30pm EDT. Doors at 11:48am`                                  | With extra "doors at" information            |
| Zapplication | `9/14/25 - 9/14/25`                                                                      | Single day event (M/D/YY format)             |
| Zapplication | `9/20/25 - 9/21/25`                                                                      | Multi-day event (M/D/YY format)              |
| Eventeny     | `Mar 01, 2025 · 1:00 PM - Mar 01, 2025 · 6:00 PM(GMT-04:00) Eastern Time (US & Canada)`  | Eastern timezone                             |
| Eventeny     | `Jun 28, 2024 · 10:00 AM - Jun 30, 2024 · 7:00 PM(GMT-05:00) Central Time (US & Canada)` | Central timezone                             |

Notes on parsing:

- If a year is not specified, the current year is assumed
- For formats with only one time having AM/PM, the script will intelligently determine the AM/PM for the other time
- Timezone information is preserved when available (Eastern Time by default)
- Extra information like "Doors at..." is ignored

## Monitoring

The script will log its progress to the console, showing:

- Events being processed
- Events that can't be parsed
- Events that already have the required fields
- Batch commits to the database
- A summary at the end showing how many events were updated, skipped or had errors
