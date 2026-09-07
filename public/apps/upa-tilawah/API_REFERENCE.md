# Google Apps Script API Reference

## Endpoints

### POST: Save Reading Progress
**URL**: `[DEPLOYMENT_URL]` (no path)

**Request Method**: POST

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "Ahmad",
  "email": "ahmad@example.com",
  "surah": "1. Al-Fatihah (The Opening)",
  "ayah": "7",
  "notes": "Beautiful reflection on today's tilawah",
  "checkpointsCompleted": 2,
  "totalPages": 20
}
```

**Response (Success)**:
```json
{
  "success": true,
  "user_id": "USR_abc123def456",
  "progress_id": "PRG_xyz789abc123",
  "message": "Reading progress saved successfully"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Name is required"
}
```

---

### GET: Retrieve User's Reading Progress
**URL**: `[DEPLOYMENT_URL]?action=getProgress&user_id=[USER_ID]`

**Request Method**: GET

**Parameters**:
- `action`: `getProgress` (required)
- `user_id`: User ID from Users sheet (required)

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "progress_id": "PRG_xyz789abc123",
      "user_id": "USR_abc123def456",
      "date": "2026-09-03",
      "last_surah": "1. Al-Fatihah (The Opening)",
      "last_ayah": "7",
      "notes": "Beautiful reflection",
      "checkpoints_completed": 2,
      "total_pages": 20,
      "updated_at": "2026-09-03T15:30:45.123Z"
    },
    {
      "progress_id": "PRG_abc456def789",
      "user_id": "USR_abc123def456",
      "date": "2026-09-02",
      "last_surah": "114. An-Nas (Mankind)",
      "last_ayah": "6",
      "notes": "",
      "checkpoints_completed": 4,
      "total_pages": 20,
      "updated_at": "2026-09-02T14:20:30.456Z"
    }
  ]
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Invalid request"
}
```

---

## JavaScript Examples

### Save Reading Progress from Frontend
```javascript
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/d/[DEPLOYMENT_ID]/userweb";

async function saveReading() {
  const payload = {
    name: "Ahmad",
    email: "ahmad@example.com",
    surah: "1. Al-Fatihah (The Opening)",
    ayah: "7",
    notes: "Reflected on the Fatiha's guidance",
    checkpointsCompleted: 2,
    totalPages: 20
  };

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    if (data.success) {
      console.log('Saved! User ID:', data.user_id);
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### Retrieve Reading History
```javascript
async function getReadingHistory(userId) {
  try {
    const url = `${GOOGLE_APPS_SCRIPT_URL}?action=getProgress&user_id=${userId}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      data.data.forEach(record => {
        console.log(`${record.date}: ${record.last_surah}, Ayah ${record.last_ayah}`);
      });
    }
  } catch (error) {
    console.error('Failed to retrieve history:', error);
  }
}
```

### cURL Examples

**Save Data**:
```bash
curl -X POST \
  https://script.google.com/macros/d/[DEPLOYMENT_ID]/userweb \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Ahmad",
    "email": "ahmad@example.com",
    "surah": "1. Al-Fatihah (The Opening)",
    "ayah": "7",
    "notes": "Beautiful chapter",
    "checkpointsCompleted": 2,
    "totalPages": 20
  }'
```

**Retrieve Data**:
```bash
curl -X GET \
  "https://script.google.com/macros/d/[DEPLOYMENT_ID]/userweb?action=getProgress&user_id=USR_abc123def456"
```

---

## Error Codes

| Error | Meaning | Solution |
|-------|---------|----------|
| `Name is required` | POST payload missing `name` field | Add `name` to request body |
| `Invalid request` | GET parameters incorrect or missing | Check `action` and `user_id` parameters |
| `Script error` | Apps Script encountered an error | Check Execution Log in Apps Script editor |
| Network/CORS error | Deployment not accessible or not authorized | Verify deployment URL; ensure "Anyone" access |

---

## Testing the API

### 1. Using Google Apps Script's built-in test function

In the Google Apps Script editor:
1. Select `testScript` from the function dropdown
2. Click ▶ Run
3. Check the Execution Log (bottom panel)
4. You should see test output showing successful user creation and reading save

### 2. Using curl in terminal

```bash
# Replace [DEPLOYMENT_ID] with your actual deployment ID
SCRIPT_URL="https://script.google.com/macros/d/[DEPLOYMENT_ID]/userweb"

# Test POST
curl -X POST "$SCRIPT_URL" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test User",
    "surah": "2. Al-Baqarah",
    "ayah": "200",
    "notes": "Test reading",
    "checkpointsCompleted": 3,
    "totalPages": 30
  }'
```

### 3. Using browser DevTools

Open the browser console and run:
```javascript
fetch('YOUR_SCRIPT_URL', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Test User',
    surah: '2. Al-Baqarah',
    ayah: '200',
    notes: 'Test',
    checkpointsCompleted: 3,
    totalPages: 30
  }),
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(console.log)
```

---

## Rate Limiting & Quotas

Google Apps Script has these limits:
- **Executions**: 20,000 per day
- **Duration**: 6 minutes per execution
- **Concurrent**: 1 per user per script

For a small personal project, these limits are more than sufficient. Daily readings: ~365 requests/year = well within quota.

---

## Extending the API

### Add User Email Collection

Modify `doPost` to accept email:
```javascript
function doPost(e) {
  // ... existing code ...
  const userId = getOrCreateUser(data.name, data.email || "");
  // ... rest of function ...
}
```

### Add Statistics Endpoint

Add a new function:
```javascript
function doGet(e) {
  if (e.parameter.action === "getStats" && e.parameter.user_id) {
    const progress = getReadingProgressByUserId(e.parameter.user_id, 365);
    const stats = {
      totalDays: progress.length,
      totalPages: progress.reduce((sum, p) => sum + p.total_pages, 0),
      avgCheckpoints: progress.reduce((sum, p) => sum + p.checkpoints_completed, 0) / progress.length
    };
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      stats: stats
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

Then call it:
```javascript
fetch(`${SCRIPT_URL}?action=getStats&user_id=${userId}`)
  .then(r => r.json())
  .then(data => console.log('Stats:', data.stats))
```

---

## Debugging

### Enable detailed logging

In `google_apps_script.gs`, add:
```javascript
function saveReadingProgress(userId, data) {
  Logger.log('Saving progress for user: ' + userId);
  Logger.log('Data: ' + JSON.stringify(data));
  // ... rest of function ...
}
```

Then check the **Execution Log** in the Apps Script editor (bottom panel).

### Check spreadsheet permissions

Make sure your Google Sheet is accessible:
1. Open the Google Sheet
2. Click "Share" (top right)
3. Verify you have Editor access

### Verify deployment

1. Copy your deployment URL
2. Try accessing it in a browser (even GET will show an error, but confirms deployment is reachable)
3. If you see "Oops! This page doesn't exist.", the deployment URL is wrong
