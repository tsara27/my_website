// Google Apps Script for Quran Reading Progress Tracker
// Deploy as web app: Execute as > Me, Who has access > Anyone

const SPREADSHEET_ID = "1A7Eh2Td8zJukkOkASmhgmFLFhc0dFEb4hqwmrS9JwiA"; // Replace with your Google Sheet ID
const USERS_SHEET = "Users";
const READING_PROGRESS_SHEET = "Reading_Progress";

// Reading_Progress column numbers (1-indexed, matching the sheet layout below)
const PROGRESS_COLUMNS = {
  PROGRESS_ID: 1,
  USER_ID: 2,
  DATE: 3,
  SURAH: 4,
  AYAH: 5,
  NOTES: 6,
  CHECKPOINTS_COMPLETED: 7,
  TOTAL_PAGES: 8,
  UPDATED_AT: 9
};

// ============================================================
// 1. INITIALIZE SHEETS (Run this once to set up headers)
// ============================================================

function getSS() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function initializeSheets() {
  const ss = getSS();

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
  const ss = getSS();
  const usersSheet = ss.getSheetByName(USERS_SHEET);
  const data = usersSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) { // Skip header
    const rowName = data[i][1];
    if (rowName && String(rowName).toLowerCase().trim() === name.toLowerCase().trim()) {
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
  const ss = getSS();
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
  const ss = getSS();
  const progressSheet = ss.getSheetByName(READING_PROGRESS_SHEET);

  const progressId = generateId("PRG");
  const now = getCurrentTimestamp();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const recordDate = data.date || today;

  const row = [
    progressId,
    userId,
    recordDate,
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
// 3B. UPDATE READING PROGRESS (edit an existing record)
// ============================================================

function updateReadingProgress(progressId, userId, data) {
  const ss = getSS();
  const progressSheet = ss.getSheetByName(READING_PROGRESS_SHEET);
  const values = progressSheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][PROGRESS_COLUMNS.PROGRESS_ID - 1] === progressId) {
      // Ownership check: only the record's own user may edit it
      if (values[i][PROGRESS_COLUMNS.USER_ID - 1] !== userId) {
        return { success: false, error: "Not authorized to edit this record" };
      }

      const now = getCurrentTimestamp();
      const rowNum = i + 1; // 1-indexed sheet row

      // Columns SURAH..UPDATED_AT are contiguous, so write them in one call
      progressSheet.getRange(rowNum, PROGRESS_COLUMNS.SURAH, 1, 6).setValues([[
        data.surah || "",
        data.ayah || "",
        data.notes || "",
        data.checkpointsCompleted || 0,
        data.totalPages || 0,
        now
      ]]);

      return {
        success: true,
        progress_id: progressId,
        message: "Reading progress updated successfully"
      };
    }
  }

  return { success: false, error: "Record not found" };
}

// ============================================================
// 4. RETRIEVE READING PROGRESS
// ============================================================

function getReadingProgressByUserId(userId, daysBack = 30) {
  const ss = getSS();
  const progressSheet = ss.getSheetByName(READING_PROGRESS_SHEET);
  const data = progressSheet.getDataRange().getValues();

  const results = [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const C = PROGRESS_COLUMNS;
  for (let i = 1; i < data.length; i++) { // Skip header
    if (data[i][C.USER_ID - 1] === userId) {
      const recordDate = new Date(data[i][C.DATE - 1]);
      if (recordDate >= cutoffDate) {
        results.push({
          progress_id: data[i][C.PROGRESS_ID - 1],
          user_id: data[i][C.USER_ID - 1],
          date: data[i][C.DATE - 1],
          last_surah: data[i][C.SURAH - 1],
          last_ayah: data[i][C.AYAH - 1],
          notes: data[i][C.NOTES - 1],
          checkpoints_completed: data[i][C.CHECKPOINTS_COMPLETED - 1],
          total_pages: data[i][C.TOTAL_PAGES - 1],
          updated_at: data[i][C.UPDATED_AT - 1]
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
  const ss = getSS();
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

  const C = PROGRESS_COLUMNS;
  for (let i = 1; i < progressData.length; i++) {
    const recordDate = new Date(progressData[i][C.DATE - 1]);
    if (recordDate >= cutoffDate) {
      results.push({
        progress_id: progressData[i][C.PROGRESS_ID - 1],
        user_id: progressData[i][C.USER_ID - 1],
        name: userMap[progressData[i][C.USER_ID - 1]] || "Unknown",
        date: progressData[i][C.DATE - 1],
        surah: progressData[i][C.SURAH - 1],
        ayah: progressData[i][C.AYAH - 1],
        notes: progressData[i][C.NOTES - 1],
        checkpointsCompleted: progressData[i][C.CHECKPOINTS_COMPLETED - 1],
        totalPages: progressData[i][C.TOTAL_PAGES - 1],
        updated_at: progressData[i][C.UPDATED_AT - 1]
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
    // Handle both JSON and form-encoded data.
    // The client sends JSON with Content-Type: text/plain (to avoid CORS
    // preflight), so e.postData.type is never 'application/json' here -
    // try parsing the body as JSON first and fall back to e.parameter.
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    // Validate required fields
    if (!data.name) {
      return jsonResponse({ success: false, error: "Name is required" });
    }

    // Get or create user
    const userId = getOrCreateUser(data.name, data.email || "");

    // Editing an existing record vs. creating a new one
    if (data.action === "update" && data.progress_id) {
      const updateResult = updateReadingProgress(data.progress_id, userId, {
        surah: data.surah || "",
        ayah: data.ayah || "",
        notes: data.notes || "",
        checkpointsCompleted: data.checkpointsCompleted || 0,
        totalPages: data.totalPages || 0
      });

      return jsonResponse(updateResult);
    }

    // Save reading progress
    const result = saveReadingProgress(userId, {
      surah: data.surah || "",
      ayah: data.ayah || "",
      notes: data.notes || "",
      checkpointsCompleted: data.checkpointsCompleted || 0,
      totalPages: data.totalPages || 0,
      date: data.date || ""
    });

    return jsonResponse({
      success: true,
      user_id: userId,
      progress_id: result.progress_id,
      message: result.message
    });

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return jsonResponse({ success: false, error: error.toString() });
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
      return jsonResponse({ success: true, data: progress });
    }

    if (action === "getAllHistory") {
      const daysBack = e.parameter.days ? parseInt(e.parameter.days) : 90;
      const records = getAllHistoryWithUsers(daysBack);
      return jsonResponse({ success: true, records: records, count: records.length });
    }

    return jsonResponse({ success: false, error: "Invalid request" });

  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

// ============================================================
// 8. TEST FUNCTION (Optional - for development)
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
