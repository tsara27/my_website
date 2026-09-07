// Google Apps Script for Quran Reading Progress Tracker
// Deploy as web app: Execute as > Me, Who has access > Anyone

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // Replace with your Google Sheet ID
const USERS_SHEET = "Users";
const READING_PROGRESS_SHEET = "Reading_Progress";

// ============================================================
// 1. INITIALIZE SHEETS (Run this once to set up headers)
// ============================================================

function initializeSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Create or get Users sheet
  let usersSheet = ss.getSheetByName(USERS_SHEET);
  if (!usersSheet) {
    usersSheet = ss.insertSheet(USERS_SHEET);
  }

  // Create or get Reading_Progress sheet
  let progressSheet = ss.getSheetByName(READING_PROGRESS_SHEET);
  if (!progressSheet) {
    progressSheet = ss.insertSheet(READING_PROGRESS_SHEET);
  }

  // Set up Users sheet headers
  const usersHeaders = ["user_id", "name", "email", "created_at", "updated_at"];
  if (usersSheet.getLastRow() === 0) {
    usersSheet.appendRow(usersHeaders);
  }

  // Set up Reading_Progress sheet headers
  const progressHeaders = [
    "progress_id", "user_id", "date", "last_surah", "last_ayah",
    "notes", "checkpoints_completed", "total_pages", "updated_at"
  ];
  if (progressSheet.getLastRow() === 0) {
    progressSheet.appendRow(progressHeaders);
  }

  Logger.log("Sheets initialized successfully!");
}

// ============================================================
// 2. UTILITY FUNCTIONS
// ============================================================

function generateId(prefix) {
  return prefix + "_" + Utilities.getUuid().replace(/-/g, '').substring(0, 12);
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

function findUserByName(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName(USERS_SHEET);
  const data = usersSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) { // Skip header
    if (data[i][1].toLowerCase().trim() === name.toLowerCase().trim()) {
      return {
        user_id: data[i][0],
        name: data[i][1],
        email: data[i][2],
        created_at: data[i][3]
      };
    }
  }
  return null;
}

function getOrCreateUser(name, email = "") {
  const existingUser = findUserByName(name);
  if (existingUser) {
    return existingUser.user_id;
  }

  // Create new user
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName(USERS_SHEET);
  const userId = generateId("USR");
  const now = getCurrentTimestamp();

  usersSheet.appendRow([userId, name, email, now, now]);

  return userId;
}

// ============================================================
// 3. SAVE READING PROGRESS
// ============================================================

function saveReadingProgress(userId, data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const progressSheet = ss.getSheetByName(READING_PROGRESS_SHEET);

  const progressId = generateId("PRG");
  const now = getCurrentTimestamp();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const row = [
    progressId,
    userId,
    today,
    data.surah || "",
    data.ayah || "",
    data.notes || "",
    data.checkpointsCompleted || 0,
    data.totalPages || 0,
    now
  ];

  progressSheet.appendRow(row);

  return {
    success: true,
    progress_id: progressId,
    message: "Reading progress saved successfully"
  };
}

// ============================================================
// 4. RETRIEVE READING PROGRESS
// ============================================================

function getReadingProgressByUserId(userId, daysBack = 30) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const progressSheet = ss.getSheetByName(READING_PROGRESS_SHEET);
  const data = progressSheet.getDataRange().getValues();

  const results = [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  for (let i = 1; i < data.length; i++) { // Skip header
    if (data[i][1] === userId) {
      const recordDate = new Date(data[i][2]);
      if (recordDate >= cutoffDate) {
        results.push({
          progress_id: data[i][0],
          user_id: data[i][1],
          date: data[i][2],
          last_surah: data[i][3],
          last_ayah: data[i][4],
          notes: data[i][5],
          checkpoints_completed: data[i][6],
          total_pages: data[i][7],
          updated_at: data[i][8]
        });
      }
    }
  }

  return results.reverse(); // Most recent first
}

// ============================================================
// 4B. RETRIEVE ALL HISTORY WITH USER NAMES
// ============================================================

function getAllHistoryWithUsers(daysBack = 90) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName(USERS_SHEET);
  const progressSheet = ss.getSheetByName(READING_PROGRESS_SHEET);

  const userData = usersSheet.getDataRange().getValues();
  const progressData = progressSheet.getDataRange().getValues();

  // Build user map for quick lookup
  const userMap = {};
  for (let i = 1; i < userData.length; i++) {
    userMap[userData[i][0]] = userData[i][1]; // user_id -> name
  }

  const results = [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  for (let i = 1; i < progressData.length; i++) {
    const recordDate = new Date(progressData[i][2]);
    if (recordDate >= cutoffDate) {
      results.push({
        progress_id: progressData[i][0],
        user_id: progressData[i][1],
        name: userMap[progressData[i][1]] || "Unknown",
        date: progressData[i][2],
        surah: progressData[i][3],
        ayah: progressData[i][4],
        notes: progressData[i][5],
        checkpointsCompleted: progressData[i][6],
        totalPages: progressData[i][7],
        updated_at: progressData[i][8]
      });
    }
  }

  return results.reverse(); // Most recent first
}

// ============================================================
// 5. WEB APP ENDPOINT (POST from HTML form)
// ============================================================

function doPost(e) {
  try {
    // Handle both JSON and form-encoded data
    let data;
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else {
      // Form-encoded data
      data = e.parameter || {};
    }

    // Validate required fields
    if (!data.name) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Name is required"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Get or create user
    const userId = getOrCreateUser(data.name, data.email || "");

    // Save reading progress
    const result = saveReadingProgress(userId, {
      surah: data.surah || "",
      ayah: data.ayah || "",
      notes: data.notes || "",
      checkpointsCompleted: data.checkpointsCompleted || 0,
      totalPages: data.totalPages || 0
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      user_id: userId,
      progress_id: result.progress_id,
      message: result.message
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// 6. GET ENDPOINT (Optional - retrieve user data)
// ============================================================

function doGet(e) {
  try {
    const action = e.parameter.action;
    const userId = e.parameter.user_id;

    if (action === "getProgress" && userId) {
      const progress = getReadingProgressByUserId(userId, 30);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: progress
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "getAllHistory") {
      const daysBack = e.parameter.days ? parseInt(e.parameter.days) : 90;
      const records = getAllHistoryWithUsers(daysBack);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        records: records,
        count: records.length
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Invalid request"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// 7. TEST FUNCTION (Optional - for development)
// ============================================================

function testScript() {
  // Initialize sheets
  initializeSheets();

  // Test creating a user and saving progress
  const userId = getOrCreateUser("Ahmad Test", "test@example.com");
  Logger.log("Created/Found user: " + userId);

  // Test saving reading progress
  const result = saveReadingProgress(userId, {
    surah: "1. Al-Fatihah (The Opening)",
    ayah: "7",
    notes: "Beautiful opening chapter",
    checkpointsCompleted: 2,
    totalPages: 5
  });
  Logger.log("Save result: " + JSON.stringify(result));

  // Test retrieving progress
  const progress = getReadingProgressByUserId(userId, 30);
  Logger.log("Retrieved progress: " + JSON.stringify(progress));
}
