# Quran Reading Progress Tracker — Google Sheets Integration

## Overview

This setup integrates your Quran tracker web app with Google Sheets to persist reading progress data across sessions and devices. Data is stored in two sheets:

- **Users Sheet**: User profile information (name, email, creation date)
- **Reading_Progress Sheet**: Daily reading records (surah, ayah, notes, checkpoints, pages)

## Architecture

```
┌─────────────────────────────────┐
│   Quran Tracker Web App         │
│   (HTML/Browser - Client)       │
└────────────┬────────────────────┘
             │ (fetch POST/GET)
             │
┌────────────▼────────────────────┐
│  Google Apps Script (Web App)   │
│  - Receive POST data            │
│  - Create/update users          │
│  - Save reading progress        │
│  - Retrieve historical data     │
└────────────┬────────────────────┘
             │ (read/write)
             │
┌────────────▼────────────────────┐
│   Google Spreadsheet            │
│   ┌─────────────────────────┐   │
│   │ Users Sheet             │   │
│   ├─────────────────────────┤   │
│   │ Reading_Progress Sheet  │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

## Step 1: Set Up Google Sheets

1. **Create a new Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Click "New Spreadsheet"
   - Rename it to "Quran Reading Tracker"
   
2. **Get the Spreadsheet ID**
   - Open the sheet URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
   - Copy the `SHEET_ID` (long alphanumeric string)
   - Save this for later

## Step 2: Set Up Google Apps Script

1. **Open Google Apps Script**
   - Go to [Google Apps Script](https://script.google.com)
   - Click "New Project"
   - Name it "Quran Tracker Backend"

2. **Add the Code**
   - Delete any default code
   - Copy the entire contents of `google_apps_script.gs`
   - Paste it into the editor
   - Save the file (Ctrl+S or Cmd+S)

3. **Set Your Spreadsheet ID**
   - Find this line in the script:
     ```javascript
     const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
     ```
   - Replace `YOUR_SPREADSHEET_ID_HERE` with the ID from Step 1
   - Save the changes

4. **Initialize the Sheets**
   - In the script editor, select the `initializeSheets` function from the dropdown
   - Click the Play ▶ button to run it
   - Authorize when prompted (this creates the sheet headers)
   - Check your Google Sheet — you should now see two sheets with headers

5. **Deploy as Web App**
   - Click "Deploy" > "New deployment"
   - Select "Type" > "Web app"
   - Configure as follows:
     - **Execute as**: [Your email address]
     - **Who has access**: "Anyone" (required for cross-origin requests)
   - Click "Deploy"
   - You'll get a **Deployment ID** in a popup
   - Copy the full deployment URL (format: `https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb`)

## Step 3: Configure the Web App

1. **Open your HTML file**
   - Edit `/public/apps/upa-tilawah/index.html`

2. **Find the configuration section** (top of the `<script>` tag):
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb";
   const ENABLE_GOOGLE_SHEETS_SYNC = false;
   ```

3. **Update the configuration**
   - Replace `YOUR_DEPLOYMENT_ID` with the deployment ID from Step 2
   - Change `ENABLE_GOOGLE_SHEETS_SYNC` from `false` to `true`
   - Save the file

4. **Test the Integration**
   - Open the app in your browser
   - Enter your name and a daily plan
   - Complete some checkpoints
   - At the end of the day, fill in the surah, ayah, and notes
   - Click "Save Today's Tilawah Record"
   - Look for a toast notification saying "Progress saved to cloud ☁️"
   - Check your Google Sheet — your data should appear in both sheets

## Data Schema

### Users Sheet
| Column | Type | Example |
|--------|------|---------|
| `user_id` | String (auto-generated) | `USR_abc123def456` |
| `name` | String | `Ahmad` |
| `email` | String | `ahmad@example.com` |
| `created_at` | ISO 8601 DateTime | `2026-09-03T15:30:45.123Z` |
| `updated_at` | ISO 8601 DateTime | `2026-09-03T15:30:45.123Z` |

### Reading_Progress Sheet
| Column | Type | Example |
|--------|------|---------|
| `progress_id` | String (auto-generated) | `PRG_xyz789abc123` |
| `user_id` | String (foreign key) | `USR_abc123def456` |
| `date` | Date (YYYY-MM-DD) | `2026-09-03` |
| `last_surah` | String | `1. Al-Fatihah (The Opening)` |
| `last_ayah` | Number | `7` |
| `notes` | String | `Beautiful opening chapter` |
| `checkpoints_completed` | Number | `2` |
| `total_pages` | Number | `20` |
| `updated_at` | ISO 8601 DateTime | `2026-09-03T15:30:45.123Z` |

## How It Works

### 1. First-Time User
- User enters their name → Google Apps Script creates a new user record
- A unique `user_id` is generated and stored
- User information is saved to the Users sheet

### 2. Daily Reading Session
- User plans checkpoints and pages
- User marks checkpoints as complete
- User records final surah, ayah, and notes
- Clicking "Save Today's Tilawah Record" triggers:
  - Local browser cookie update (name persistence)
  - **Google Sheets sync**: Data sent via POST to Apps Script
  - Apps Script receives the data and writes to Google Sheets
  - A confirmation toast appears ("Progress saved to cloud ☁️")

### 3. Data Persistence
- **Local**: Browser cookies store the user's name (1-year expiration)
- **Cloud**: Google Sheets stores all reading progress (permanent, accessible anywhere)

## Advanced: Retrieve Historical Data

You can fetch previous reading records from Google Sheets. In the browser console:

```javascript
// Fetch the user's last 30 days of reading
const userId = 'USR_abc123def456'; // Replace with actual user_id from Google Sheet
fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getProgress&user_id=${userId}`)
  .then(r => r.json())
  .then(data => console.log(data.data));
```

## Troubleshooting

### Error: "Request failed" or blank sheet
- **Check**: Deployment URL is correct (copy-paste again)
- **Check**: `ENABLE_GOOGLE_SHEETS_SYNC` is set to `true`
- **Check**: Google Apps Script is deployed with "Anyone" access

### Error: "Script error" in console
- **Check**: Spreadsheet ID is correct in `google_apps_script.gs`
- **Check**: `initializeSheets()` was run successfully (check Google Sheet for headers)
- **Solution**: Re-run `initializeSheets()` and re-deploy the script

### Data not appearing in Google Sheet
- **Check**: Authorization: Apps Script may need re-authorization
  - Re-run `initializeSheets()` and approve permissions again
- **Check**: Browser console for errors (F12 > Console tab)
- **Check**: Your Google Sheet is shared with your email if using a work account

### CORS Error in browser
- **Check**: Web app deployment has "Anyone" in "Who has access"
- **Solution**: Redeploy and select "Anyone" access level

## Optional: Add Email Tracking

To also save the user's email:

1. Modify the HTML form to capture email (optional field)
2. Or, if you have access to user email via Google Sign-In, modify `syncToGoogleSheets()` to include it

## Security Notes

- **No authentication required** (current setup): Anyone can write to your sheet
- **To restrict access**: Modify Apps Script to validate an API key or email domain
- **Data privacy**: Consider marking the spreadsheet as private (only you can view)
- **Backup**: The Google Sheet auto-saves; no additional backups needed

## Next Steps

1. ✅ Deploy Google Apps Script
2. ✅ Set up Google Sheet with headers
3. ✅ Configure web app with deployment URL
4. ✅ Test with a sample reading session
5. (Optional) Create a dashboard view of your reading statistics
6. (Optional) Set up email notifications on completion

---

**Support**: If you encounter issues, check the Apps Script Execution Log:
- Click "Execution Log" (bottom of Apps Script editor)
- Look for error messages and stack traces

## Minified JS Bundle

`index.html` loads `js/app.min.js`, a minified bundle built from `js/app.js` (with `js/firebase.js` inlined) using esbuild. The originals are kept unminified for editing/debugging.

- **Edit source**: make changes in `js/app.js` and/or `js/firebase.js`, never in `js/app.min.js` directly.
- **Rebuild** after any change to those files:

  ```bash
  npx esbuild public/apps/upa-tilawah/js/app.js --bundle --minify --format=esm "--external:https://*" --outfile=public/apps/upa-tilawah/js/app.min.js
  ```

- The `--external:https://*` flag keeps the Firebase CDN imports (`https://www.gstatic.com/...`) as external `import` statements instead of trying to bundle them.
- `js/app.old.js` is a legacy/backup copy and is not referenced by `index.html`.
