/* =========================================================
   0. GOOGLE SHEETS CONFIGURATION
   ========================================================= */
// Replace with your deployed Google Apps Script URL
// Steps to get this URL:
// 1. Open google_apps_script.gs in Google Apps Script editor
// 2. Click Deploy > New deployment > Web app
// 3. Execute as: Me, Anyone with the link
// 4. Copy the deployment URL below
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYCnbKF8cIFGPl8MBV2G9TE8_-0P4m6zRPsOfS0_GzCK3nZ1eTPkvdA70Bywr8ooQi/exec";
const ENABLE_GOOGLE_SHEETS_SYNC = true; // Set to true after deployment URL is configured

/* =========================================================
   1. 114 Surahs Data for high-accuracy selection
   ========================================================= */
const QURAN_SURAHS = [
  "1. Al-Fatihah (The Opening)", "2. Al-Baqarah (The Cow)", "3. Ali 'Imran (Family of Imran)",
  "4. An-Nisa (The Women)", "5. Al-Ma'idah (The Table Spread)", "6. Al-An'am (The Cattle)",
  "7. Al-A'raf (The Heights)", "8. Al-Anfal (The Spoils of War)", "9. At-Tawbah (The Repentance)",
  "10. Yunus (Jonah)", "11. Hud (Hud)", "12. Yusuf (Joseph)", "13. Ar-Ra'd (The Thunder)",
  "14. Ibrahim (Abraham)", "15. Al-Hijr (The Rocky Tract)", "16. An-Nahl (The Bee)",
  "17. Al-Isra (The Night Journey)", "18. Al-Kahf (The Cave)", "19. Maryam (Mary)",
  "20. Taha", "21. Al-Anbiya (The Prophets)", "22. Al-Hajj (The Pilgrimage)",
  "23. Al-Mu'minun (The Believers)", "24. An-Nur (The Light)", "25. Al-Furqan (The Criterion)",
  "26. Ash-Shu'ara (The Poets)", "27. An-Naml (The Ants)", "28. Al-Qasas (The Stories)",
  "29. Al-'Ankabut (The Spider)", "30. Ar-Rum (The Romans)", "31. Luqman",
  "32. As-Sajdah (The Prostration)", "33. Al-Ahzab (The Combined Forces)", "34. Saba (Sheba)",
  "35. Fatir (Originator)", "36. Ya-Sin", "37. As-Saffat (Those Ranks)",
  "38. Sad", "39. Az-Zumar (The Troops)", "40. Ghafir (The Forgiver)",
  "41. Fussilat (Explained in Detail)", "42. Ash-Shura (Consultation)", "43. Az-Zukhruf (The Gold)",
  "44. Ad-Dukhan (The Smoke)", "45. Al-Jathiyah (The Crouching)", "46. Al-Ahqaf (The Dunes)",
  "47. Muhammad", "48. Al-Fath (The Victory)", "49. Al-Hujurat (The Rooms)",
  "50. Qaf", "51. Adh-Dhariyat (The Winnowing Winds)", "52. At-Tur (The Mount)",
  "53. An-Najm (The Star)", "54. Al-Qamar (The Moon)", "55. Ar-Rahman (The Beneficent)",
  "56. Al-Waqi'ah (The Inevitable)", "57. Al-Hadid (The Iron)", "58. Al-Mujadila (Pleading Woman)",
  "59. Al-Hashr (The Exile)", "60. Al-Mumtahanah (Examined One)", "61. As-Saff (The Ranks)",
  "62. Al-Jumu'ah (Friday Congregation)", "63. Al-Munafiqun (The Hypocrites)", "64. At-Taghabun (Mutual Loss)",
  "65. At-Talaq (The Divorce)", "66. At-Tahrim (The Prohibition)", "67. Al-Mulk (The Sovereignty)",
  "68. Al-Qalam (The Pen)", "69. Al-Haqqah (The Reality)", "70. Al-Ma'arij (Ascending Stairways)",
  "71. Nuh (Noah)", "72. Al-Jinn (The Jinn)", "73. Al-Muzzammil (Enshrouded One)",
  "74. Al-Muddaththir (Cloaked One)", "75. Al-Qiyamah (The Resurrection)", "76. Al-Insan (Man)",
  "77. Al-Mursalat (Emissaries)", "78. An-Naba (The Tidings)", "79. An-Nazi'at (Those Who Drag)",
  "80. 'Abasa (He Frowned)", "81. At-Takwir (The Overthrowing)", "82. Al-Infitar (The Cleaving)",
  "83. Al-Mutaffifin (Defrauding)", "84. Al-Inshiqaq (Splitting Open)", "85. Al-Buruj (Great Stars)",
  "86. At-Tariq (The Nightcomer)", "87. Al-A'la (The Most High)", "88. Al-Ghashiyah (The Overwhelming)",
  "89. Al-Fajr (The Dawn)", "90. Al-Balad (The City)", "91. Ash-Shams (The Sun)",
  "92. Al-Layl (The Night)", "93. Ad-Duha (The Morning Hours)", "94. Ash-Sharh (The Relief)",
  "95. At-Tin (The Fig)", "96. Al-'Alaq (The Clot)", "97. Al-Qadr (Power / Decree)",
  "98. Al-Bayyinah (Clear Evidence)", "99. Az-Zalzalah (The Earthquake)", "100. Al-'Adiyat (The Courser)",
  "101. Al-Qari'ah (The Calamity)", "102. At-Takathur (Rivalry in World)", "103. Al-'Asr (The Declining Day)",
  "104. Al-Humazah (The Scorner)", "105. Al-Fil (The Elephant)", "106. Quraysh",
  "107. Al-Ma'un (Small Kindness)", "108. Al-Kawthar (Abundance)", "109. Al-Kafirun (Disbelievers)",
  "110. An-Nasr (The Divine Support)", "111. Al-Masad (Palm Fiber)", "112. Al-Ikhlas (Sincerity)",
  "113. Al-Falaq (The Daybreak)", "114. An-Nas (Mankind)"
];

/* =========================================================
   2. Cookie Helpers (Stored directly in browser cookies)
   ========================================================= */
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const parts = decodedCookie.split(';');
  for (let i = 0; i < parts.length; i++) {
    let c = parts[i].trim();
    if (c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

/* =========================================================
   3. In-Memory Daily Session State
   ========================================================= */
const state = {
  checkpointsCount: 0,
  totalPages: 0,
  volumePerCheckpoint: 0,
  checkpoints: [], // Array of { id, index, targetPages, completed, completedAt }
  surah: "",
  ayah: "",
  notes: "",
  isCompletedForToday: false,
  progressId: null, // Server-side id of today's synced record (for editing)
  pendingAction: null, // Callback if name modal needed
  currentView: 'today', // 'today' or 'history'
  historyData: [], // Array of historical records
  allUsers: [], // Array of all users
  selectedUser: null // Currently selected user for history view
};

/* =========================================================
   3B. Local Per-Day Persistence (so a filled-in form/checkpoint
   list survives a page reload on the same day)
   ========================================================= */
function getTodayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getLocalStateKey() {
  const name = getCookie(USER_NAME_COOKIE) || 'guest';
  return `tilawah_day_state_${name}_${getTodayDateKey()}`;
}

function saveLocalState() {
  try {
    const snapshot = {
      checkpointsCount: state.checkpointsCount,
      totalPages: state.totalPages,
      volumePerCheckpoint: state.volumePerCheckpoint,
      checkpoints: state.checkpoints,
      surah: state.surah,
      ayah: state.ayah,
      notes: state.notes,
      isCompletedForToday: state.isCompletedForToday,
      progressId: state.progressId
    };
    localStorage.setItem(getLocalStateKey(), JSON.stringify(snapshot));
  } catch (error) {
    console.warn('Failed to save local daily state:', error);
  }
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(getLocalStateKey());
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to load local daily state:', error);
    return null;
  }
}

function clearLocalState() {
  try {
    localStorage.removeItem(getLocalStateKey());
  } catch (error) {
    console.warn('Failed to clear local daily state:', error);
  }
}

/* =========================================================
   4. UI Utilities (No alert, clean toasts)
   ========================================================= */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const isSuccess = type === 'success';

  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold transition-all transform duration-300 translate-y-2 opacity-0 ${
    isSuccess
      ? 'bg-emerald-900 text-white border-emerald-700 shadow-emerald-950/30'
      : 'bg-amber-900 text-white border-amber-700 shadow-amber-950/30'
  }`;

  toast.innerHTML = `
    <svg class="w-4 h-4 shrink-0 ${isSuccess ? 'text-emerald-400' : 'text-amber-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
        isSuccess ? 'M5 13l4 4L19 7' : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
      }"></path>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', '-translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* =========================================================
   5. Name & Email Cookie Logic
   ========================================================= */
const USER_NAME_COOKIE = "tilawah_reader_name";
const USER_EMAIL_COOKIE = "tilawah_reader_email";

function updateGreeting() {
  const savedName = getCookie(USER_NAME_COOKIE);
  const greetingEl = document.getElementById('user-greeting');
  const badgeEl = document.getElementById('user-badge');
  const badgeNameText = document.getElementById('badge-name-text');

  badgeEl.classList.remove('hidden');
  if (savedName) {
    greetingEl.textContent = `Assalamu'alaikum, ${savedName}! ✨`;
    badgeNameText.textContent = savedName;
  } else {
    greetingEl.textContent = "Assalamu'alaikum, Dedicated Reader ✨";
    badgeNameText.textContent = "Reader";
  }
}

function requireUserName(onSuccess) {
  const savedName = getCookie(USER_NAME_COOKIE);
  if (savedName && savedName.trim() !== '') {
    onSuccess(savedName);
  } else {
    state.pendingAction = onSuccess;
    document.getElementById('name-modal').classList.remove('hidden');
    document.getElementById('user-name-input').focus();
  }
}

/* =========================================================
   6. Tab Switching & History Dashboard
   ========================================================= */
function switchTab(tabName) {
  state.currentView = tabName;

  const todayView = document.getElementById('today-view');
  const historyView = document.getElementById('history-view');
  const tabToday = document.getElementById('tab-today');
  const tabHistory = document.getElementById('tab-history');

  if (tabName === 'today') {
    todayView.classList.remove('hidden');
    historyView.classList.add('hidden');
    tabToday.classList.add('active', 'border-gold-400', 'text-emerald-200');
    tabToday.classList.remove('border-transparent', 'text-emerald-300/70');
    tabHistory.classList.remove('active', 'border-gold-400', 'text-emerald-200');
    tabHistory.classList.add('border-transparent', 'text-emerald-300/70');
  } else {
    todayView.classList.add('hidden');
    historyView.classList.remove('hidden');
    tabHistory.classList.add('active', 'border-gold-400', 'text-emerald-200');
    tabHistory.classList.remove('border-transparent', 'text-emerald-300/70');
    tabToday.classList.remove('active', 'border-gold-400', 'text-emerald-200');
    tabToday.classList.add('border-transparent', 'text-emerald-300/70');
    loadHistoryData();
  }
}

async function fetchHistoryData() {
  if (!ENABLE_GOOGLE_SHEETS_SYNC) {
    console.warn('Google Sheets sync is disabled');
    return [];
  }

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL + '?action=getAllHistory');
    const data = await response.json();

    if (data.success && Array.isArray(data.records)) {
      state.historyData = data.records;

      // Extract unique users
      const uniqueUsers = [...new Set(data.records.map(r => r.name))].filter(Boolean).sort();
      state.allUsers = uniqueUsers;

      return data.records;
    }
  } catch (error) {
    console.warn('Failed to fetch history:', error);
  }
  return [];
}

function populateUserFilter() {
  const userFilter = document.getElementById('user-filter');
  const currentUser = getCookie(USER_NAME_COOKIE);

  // Clear existing options
  userFilter.innerHTML = '';

  // Add "My Records" option
  const myOption = document.createElement('option');
  myOption.value = currentUser || '';
  myOption.textContent = `My Records (${currentUser || 'Guest'})`;
  userFilter.appendChild(myOption);

  // Add other users
  state.allUsers.forEach(user => {
    if (user !== currentUser) {
      const option = document.createElement('option');
      option.value = user;
      option.textContent = `${user}'s Records`;
      userFilter.appendChild(option);
    }
  });

  // Set default selection
  state.selectedUser = currentUser;
  userFilter.value = currentUser;
}

function renderHistoryRecords(records) {
  const container = document.getElementById('history-records');
  const emptyState = document.getElementById('history-empty');
  const currentUser = getCookie(USER_NAME_COOKIE);
  const isViewingOwnData = state.selectedUser === currentUser;

  container.innerHTML = '';

  if (records.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  // Sort by date descending
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  sortedRecords.forEach((record, idx) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition';

    const recordDate = record.date ? new Date(record.date).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) : 'Unknown Date';

    const readOnly = !isViewingOwnData;

    card.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-bold text-slate-900">${record.name || 'Unknown Reader'}</h3>
            ${readOnly ? '<span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">Read-only</span>' : ''}
          </div>
          <p class="text-xs text-slate-500 font-medium">${recordDate}</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <span class="text-sm font-bold text-slate-900">${record.totalPages || 0} pages</span>
            <p class="text-xs text-slate-500">${record.checkpointsCompleted || 0} sessions</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          ${!readOnly ? `
            <button type="button" class="edit-record-btn w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-emerald-700 flex items-center justify-center transition" data-progress-id="${record.progress_id || ''}" title="Edit record">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
            <button type="button" class="delete-record-btn w-9 h-9 rounded-lg bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 flex items-center justify-center transition" data-progress-id="${record.progress_id || ''}" title="Delete record">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9.5 4h5a1 1 0 011 1v2h-7V5a1 1 0 011-1z"></path>
              </svg>
            </button>
          ` : ''}
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
          <span class="text-xs text-slate-400 block font-medium">Checkpoints</span>
          <span class="text-lg font-bold text-slate-800">${record.checkpointsCompleted || 0}</span>
        </div>
        <div class="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
          <span class="text-xs text-slate-400 block font-medium">Pages</span>
          <span class="text-lg font-bold text-slate-800">${record.totalPages || 0}</span>
        </div>
        <div class="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
          <span class="text-xs text-emerald-600 block font-medium">Stop</span>
          <span class="text-sm font-bold text-emerald-800">${record.surah ? record.surah.split('.').pop().trim() : '--'}</span>
        </div>
      </div>

      ${record.notes ? `
        <div class="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
          <p class="text-xs text-slate-500 font-semibold mb-1">Notes:</p>
          <p class="text-xs text-slate-700 italic">"${record.notes}"</p>
        </div>
      ` : ''}
    `;

    container.appendChild(card);
  });

  // Attach edit handlers for own records
  container.querySelectorAll('.edit-record-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const progressId = btn.getAttribute('data-progress-id');
      const record = state.historyData.find(r => r.progress_id === progressId);
      if (record) openEditModal(record);
    });
  });

  // Attach delete handlers for own records
  container.querySelectorAll('.delete-record-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const progressId = btn.getAttribute('data-progress-id');
      deleteRecord(progressId);
    });
  });
}

/* =========================================================
   6B. Edit an Existing History Record
   ========================================================= */
function openEditModal(record) {
  document.getElementById('edit-record-modal-title').textContent = 'Edit Tilawah Record';
  document.getElementById('edit-record-modal-desc').textContent = 'Update the details for this recorded session.';
  document.getElementById('edit-date-field').classList.add('hidden');
  document.getElementById('edit-date-input').required = false;

  document.getElementById('edit-progress-id').value = record.progress_id || '';
  document.getElementById('edit-surah-select').value = record.surah || '';
  document.getElementById('edit-ayah-input').value = record.ayah || '';
  document.getElementById('edit-checkpoints-input').value = record.checkpointsCompleted || 0;
  document.getElementById('edit-pages-input').value = record.totalPages || 0;
  document.getElementById('edit-notes-input').value = record.notes || '';
  document.getElementById('edit-record-modal').classList.remove('hidden');
}

function openAddPastRecordModal() {
  document.getElementById('edit-record-form').reset();
  document.getElementById('edit-progress-id').value = '';

  document.getElementById('edit-record-modal-title').textContent = 'Add Past Tilawah Record';
  document.getElementById('edit-record-modal-desc').textContent = 'Log a session from a previous date.';
  document.getElementById('edit-date-field').classList.remove('hidden');

  const dateInput = document.getElementById('edit-date-input');
  dateInput.required = true;
  dateInput.max = getTodayDateKey();
  dateInput.value = getTodayDateKey();

  document.getElementById('edit-checkpoints-input').value = 0;
  document.getElementById('edit-pages-input').value = 0;

  document.getElementById('edit-record-modal').classList.remove('hidden');
}

function setButtonLoading(btn, icon, spinner, label, loadingText) {
  btn.disabled = true;
  if (icon) icon.classList.add('hidden');
  if (spinner) spinner.classList.remove('hidden');
  if (label) label.textContent = loadingText;
}

function clearButtonLoading(btn, icon, spinner, label, originalText) {
  btn.disabled = false;
  if (icon) icon.classList.remove('hidden');
  if (spinner) spinner.classList.add('hidden');
  if (label) label.textContent = originalText;
}

function submitEditedRecord() {
  const progressId = document.getElementById('edit-progress-id').value;
  const isCreate = !progressId;

  requireUserName((userName) => {
    const payload = {
      name: userName,
      email: getCookie(USER_EMAIL_COOKIE) || '',
      surah: document.getElementById('edit-surah-select').value,
      ayah: document.getElementById('edit-ayah-input').value,
      notes: document.getElementById('edit-notes-input').value,
      checkpointsCompleted: parseInt(document.getElementById('edit-checkpoints-input').value, 10) || 0,
      totalPages: parseInt(document.getElementById('edit-pages-input').value, 10) || 0
    };

    if (isCreate) {
      payload.date = document.getElementById('edit-date-input').value;
    } else {
      payload.action = 'update';
      payload.progress_id = progressId;
    }

    const submitBtn = document.getElementById('edit-record-submit-btn');
    const submitSpinner = document.getElementById('edit-record-submit-spinner');
    const submitLabel = document.getElementById('edit-record-submit-label');
    setButtonLoading(submitBtn, null, submitSpinner, submitLabel, 'Saving...');

    fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(response => response.text())
      .then(async text => {
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          showToast(`Failed to ${isCreate ? 'add' : 'update'} record.`, 'warning');
          return;
        }

        if (data.success) {
          document.getElementById('edit-record-modal').classList.add('hidden');
          showToast(isCreate ? 'Past record added successfully!' : 'Record updated successfully!');
          switchTab('history');
          await loadHistoryData();
        } else {
          showToast(data.error || `Failed to ${isCreate ? 'add' : 'update'} record.`, 'warning');
        }
      })
      .catch(error => {
        console.warn(`Failed to ${isCreate ? 'add' : 'update'} record:`, error);
        showToast(`Failed to ${isCreate ? 'add' : 'update'} record.`, 'warning');
      })
      .finally(() => {
        clearButtonLoading(submitBtn, null, submitSpinner, submitLabel, 'Save Changes');
      });
  });
}

function deleteRecord(progressId) {
  if (!progressId) return;

  showDeleteRecordModal(() => performDeleteRecord(progressId));
}

function showDeleteRecordModal(onConfirm) {
  const modal = document.getElementById('delete-record-modal');
  const confirmBtn = document.getElementById('delete-record-confirm-btn');

  const cleanup = () => {
    modal.classList.add('hidden');
    confirmBtn.removeEventListener('click', handleConfirm);
  };
  const handleConfirm = () => {
    cleanup();
    onConfirm();
  };

  confirmBtn.addEventListener('click', handleConfirm);
  modal.classList.remove('hidden');
}

function performDeleteRecord(progressId) {
  requireUserName((userName) => {
    const payload = {
      name: userName,
      email: getCookie(USER_EMAIL_COOKIE) || '',
      action: 'delete',
      progress_id: progressId
    };

    fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(response => response.text())
      .then(async text => {
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          showToast('Failed to delete record.', 'warning');
          return;
        }

        if (data.success) {
          showToast('Record deleted successfully!');
          document.querySelector(`.delete-record-btn[data-progress-id="${progressId}"]`)?.closest('#history-records > div')?.remove();
        } else {
          showToast(data.error || 'Failed to delete record.', 'warning');
        }
      })
      .catch(error => {
        console.warn('Failed to delete record:', error);
        showToast('Failed to delete record.', 'warning');
      });
  });
}

function updateHistoryStats(records) {
  const currentUser = getCookie(USER_NAME_COOKIE);
  const userRecords = records.filter(r => r.name === state.selectedUser);

  if (userRecords.length === 0) {
    document.getElementById('stat-total-sessions').textContent = '0';
    document.getElementById('stat-history-pages').textContent = '0';
    document.getElementById('stat-avg-pages').textContent = '0';
    document.getElementById('stat-last-read').textContent = '--';
    return;
  }

  const totalSessions = userRecords.length;
  const totalPages = userRecords.reduce((sum, r) => sum + (r.totalPages || 0), 0);
  const avgPages = totalPages > 0 ? Math.round(totalPages / totalSessions) : 0;

  const lastRecord = [...userRecords].sort((a, b) =>
    new Date(b.date || 0) - new Date(a.date || 0)
  )[0];

  const lastDate = lastRecord?.date ? new Date(lastRecord.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  }) : '--';

  document.getElementById('stat-total-sessions').textContent = totalSessions;
  document.getElementById('stat-history-pages').textContent = totalPages;
  document.getElementById('stat-avg-pages').textContent = avgPages;
  document.getElementById('stat-last-read').textContent = lastDate;
}

async function loadHistoryData() {
  const loading = document.getElementById('history-loading');
  loading.classList.remove('hidden');

  const records = await fetchHistoryData();
  populateUserFilter();

  const currentUser = getCookie(USER_NAME_COOKIE);
  state.selectedUser = currentUser;

  const userRecords = records.filter(r => r.name === state.selectedUser);
  renderHistoryRecords(userRecords);
  updateHistoryStats(records);

  loading.classList.add('hidden');
}

/* =========================================================
   7. Initialization & Form Handlers
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Populate Surahs dropdown
  const surahSelect = document.getElementById('surah-select');
  QURAN_SURAHS.forEach(surah => {
    const opt = document.createElement('option');
    opt.value = surah;
    opt.textContent = surah;
    surahSelect.appendChild(opt);
  });

  // 2. Set readable date
  const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const todayStr = new Date().toLocaleDateString(undefined, dateOptions);
  document.getElementById('today-date').textContent = todayStr;

  // 3. Greeting from Cookie
  updateGreeting();

  // 4. Live calculate volume preview on inputs
  const cpInput = document.getElementById('checkpoints-input');
  const pgInput = document.getElementById('pages-input');
  const volumePreview = document.getElementById('preview-volume');

  function refreshPreview() {
    const cps = parseInt(cpInput.value, 10) || 1;
    const pgs = parseInt(pgInput.value, 10) || 1;
    // Formula: Math.ceil(totalPages / checkpoints)
    const vol = Math.ceil(pgs / cps);
    volumePreview.textContent = vol;
  }

  cpInput.addEventListener('input', refreshPreview);
  pgInput.addEventListener('input', refreshPreview);
  refreshPreview();

  // 5. Name Modal Submission
  const nameForm = document.getElementById('name-form');
  nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputName = document.getElementById('user-name-input').value.trim();
    const inputEmail = document.getElementById('user-email-input').value.trim();
    if (!inputName || !inputEmail) return;

    // Store into browser cookie (valid for 365 days)
    setCookie(USER_NAME_COOKIE, inputName, 365);
    setCookie(USER_EMAIL_COOKIE, inputEmail, 365);
    updateGreeting();
    document.getElementById('name-modal').classList.add('hidden');
    showToast(`Welcome, ${inputName}! Your profile has been saved.`);

    if (state.pendingAction) {
      const action = state.pendingAction;
      state.pendingAction = null;
      action(inputName);
    }
  });

  // Edit name button / name text (both open the profile modal)
  const openEditNameModal = () => {
    const currentName = getCookie(USER_NAME_COOKIE);
    const currentEmail = getCookie(USER_EMAIL_COOKIE);
    document.getElementById('user-name-input').value = currentName || '';
    document.getElementById('user-email-input').value = currentEmail || '';
    document.getElementById('name-modal').classList.remove('hidden');
    state.pendingAction = () => {
      showToast("Profile updated!");
    };
  };
  document.getElementById('user-badge').addEventListener('click', openEditNameModal);

  document.getElementById('name-modal-close-btn').addEventListener('click', () => {
    if (!getCookie(USER_NAME_COOKIE) || !getCookie(USER_EMAIL_COOKIE)) return;
    state.pendingAction = null;
    document.getElementById('name-modal').classList.add('hidden');
  });

  // 6. Step 1: Submit Daily Plan
  const planForm = document.getElementById('daily-plan-form');
  planForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const checkpointsCount = parseInt(cpInput.value, 10);
    const totalPages = parseInt(pgInput.value, 10);

    if (checkpointsCount <= 0 || totalPages <= 0) {
      showToast("Please enter valid positive numbers for checkpoints and pages.", "warning");
      return;
    }

    // Calculate volume rounded to next integer
    const volume = Math.ceil(totalPages / checkpointsCount);

    state.checkpointsCount = checkpointsCount;
    state.totalPages = totalPages;
    state.volumePerCheckpoint = volume;

    // Generate checkpoints array
    state.checkpoints = [];
    let accumulatedPages = 0;
    for (let i = 1; i <= checkpointsCount; i++) {
      const startP = accumulatedPages + 1;
      const endP = Math.min(accumulatedPages + volume, totalPages);
      const chunkPages = Math.max(1, endP - startP + 1);

      state.checkpoints.push({
        id: `cp-${i}`,
        index: i,
        label: `Checkpoint ${i}`,
        targetPages: chunkPages,
        cumulativePages: endP,
        completed: false,
        completedAt: null
      });
      accumulatedPages += volume;
    }

    renderCheckpoints();

    // Reveal step 2 and step 3
    document.getElementById('checkpoints-section').classList.remove('hidden');
    document.getElementById('end-day-section').classList.remove('hidden');
    document.getElementById('plan-status-badge').textContent = 'Plan Active';
    document.getElementById('plan-status-badge').className = 'text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold';

    // Scroll smoothly to checklist
    document.getElementById('checkpoints-section').scrollIntoView({ behavior: 'smooth', block: 'start' });

    saveLocalState();
    showToast(`Created ${checkpointsCount} checkpoints (~${volume} pages each).`);
  });

  // 8. Step 3: End of Day Submission
  const endDayForm = document.getElementById('end-day-form');
  endDayForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const surah = surahSelect.value;
    const ayah = document.getElementById('ayah-input').value;
    const notes = document.getElementById('reflection-notes').value;

    if (!surah) {
      showToast("Please select the Surah reached.", "warning");
      return;
    }

    // When submitting final checkpoint/record, ensure user name is set as requested
    requireUserName((userName) => {
      state.surah = surah;
      state.ayah = ayah;
      state.notes = notes;
      state.isCompletedForToday = true;

      const submitBtn = document.getElementById('end-day-submit-btn');
      const submitIcon = document.getElementById('end-day-submit-icon');
      const submitSpinner = document.getElementById('end-day-submit-spinner');
      const submitLabel = document.getElementById('end-day-submit-label');
      setButtonLoading(submitBtn, submitIcon, submitSpinner, submitLabel, 'Saving...');

      const finish = () => {
        saveLocalState();
        renderSummary(userName);
        showToast(`May Allah accept your tilawah, ${userName}! ✨`);
        clearButtonLoading(submitBtn, submitIcon, submitSpinner, submitLabel, "Save Today's Tilawah Record");
      };

      // Optionally sync to Google Sheets
      if (ENABLE_GOOGLE_SHEETS_SYNC) {
        syncToGoogleSheets(userName).finally(finish);
      } else {
        finish();
      }
    });
  });

  // 9. Start New Plan button
  document.getElementById('reset-day-btn').addEventListener('click', () => {
    clearLocalState();

    state.checkpointsCount = 0;
    state.totalPages = 0;
    state.volumePerCheckpoint = 0;
    state.checkpoints = [];
    state.surah = '';
    state.ayah = '';
    state.notes = '';
    state.isCompletedForToday = false;
    state.progressId = null;

    document.getElementById('summary-section').classList.add('hidden');
    document.getElementById('checkpoints-section').classList.add('hidden');
    document.getElementById('end-day-section').classList.add('hidden');
    document.getElementById('plan-status-badge').textContent = 'New Plan Needed';
    document.getElementById('plan-status-badge').className = 'text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium';
    endDayForm.reset();
    planForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 10. Tab Navigation
  document.getElementById('tab-today').addEventListener('click', () => switchTab('today'));
  document.getElementById('tab-history').addEventListener('click', () => switchTab('history'));
  document.getElementById('tab-add-record').addEventListener('click', () => openAddPastRecordModal());

  // 11. History User Filter
  document.getElementById('user-filter').addEventListener('change', async (e) => {
    state.selectedUser = e.target.value;
    const userRecords = state.historyData.filter(r => r.name === state.selectedUser);
    renderHistoryRecords(userRecords);
    updateHistoryStats(state.historyData);
  });

  // 12. Refresh History Button
  document.getElementById('refresh-history-btn').addEventListener('click', async () => {
    const btn = document.getElementById('refresh-history-btn');
    btn.disabled = true;
    btn.classList.add('opacity-50');
    await loadHistoryData();
    btn.disabled = false;
    btn.classList.remove('opacity-50');
    showToast('History updated!');
  });

  // 13. Edit Record Modal setup
  const editSurahSelect = document.getElementById('edit-surah-select');
  QURAN_SURAHS.forEach(surah => {
    const opt = document.createElement('option');
    opt.value = surah;
    opt.textContent = surah;
    editSurahSelect.appendChild(opt);
  });

  document.getElementById('edit-record-cancel-btn').addEventListener('click', () => {
    document.getElementById('edit-record-modal').classList.add('hidden');
  });

  document.getElementById('edit-record-modal-close-btn').addEventListener('click', () => {
    document.getElementById('edit-record-modal').classList.add('hidden');
  });

  document.getElementById('edit-record-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submitEditedRecord();
  });

  // 14. Delete Confirmation Modal setup
  document.getElementById('delete-record-cancel-btn').addEventListener('click', () => {
    document.getElementById('delete-record-modal').classList.add('hidden');
  });

  document.getElementById('delete-record-modal-close-btn').addEventListener('click', () => {
    document.getElementById('delete-record-modal').classList.add('hidden');
  });

  // 14. Restore today's saved form/checkpoints if already filled in
  restoreTodayState();
});

/* =========================================================
   7B. Restore Today's Saved State (per-day local persistence)
   ========================================================= */
function restoreTodayState() {
  const saved = loadLocalState();
  if (!saved || !saved.checkpointsCount) return;

  state.checkpointsCount = saved.checkpointsCount;
  state.totalPages = saved.totalPages;
  state.volumePerCheckpoint = saved.volumePerCheckpoint;
  state.checkpoints = saved.checkpoints || [];
  state.surah = saved.surah || '';
  state.ayah = saved.ayah || '';
  state.notes = saved.notes || '';
  state.isCompletedForToday = !!saved.isCompletedForToday;
  state.progressId = saved.progressId || null;

  // Pre-fill Step 1 form to match the saved plan
  document.getElementById('checkpoints-input').value = state.checkpointsCount;
  document.getElementById('pages-input').value = state.totalPages;
  document.getElementById('preview-volume').textContent = state.volumePerCheckpoint;

  renderCheckpoints();
  document.getElementById('checkpoints-section').classList.remove('hidden');
  document.getElementById('end-day-section').classList.remove('hidden');
  document.getElementById('plan-status-badge').textContent = 'Plan Active (Saved Today)';
  document.getElementById('plan-status-badge').className = 'text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold';

  // Pre-fill Step 3 form if end-of-day details were already recorded
  if (state.surah) {
    document.getElementById('surah-select').value = state.surah;
  }
  if (state.ayah) {
    document.getElementById('ayah-input').value = state.ayah;
  }
  if (state.notes) {
    document.getElementById('reflection-notes').value = state.notes;
  }

  if (state.isCompletedForToday) {
    const userName = getCookie(USER_NAME_COOKIE);
    renderSummary(userName || 'Reader');
  }

  showToast("Today's checkpoints were already started — restored where you left off.");
}

/* =========================================================
   7. Render Checklist & Checkpoint Interaction
   ========================================================= */
function renderCheckpoints() {
  const container = document.getElementById('checklist-container');
  container.innerHTML = '';

  document.getElementById('stat-total-checkpoints').textContent = state.checkpointsCount;
  document.getElementById('stat-total-pages').textContent = state.totalPages;
  document.getElementById('stat-volume-each').textContent = `~${state.volumePerCheckpoint} p.`;

  state.checkpoints.forEach((cp, idx) => {
    const isDone = cp.completed;

    const card = document.createElement('div');
    card.id = `card-${cp.id}`;
    card.className = `p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 ${
      isDone
        ? 'bg-emerald-50/90 border-emerald-300/80 shadow-sm'
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`;

    card.innerHTML = `
      <div class="flex items-center gap-3.5 min-w-0">
        <button type="button" data-index="${idx}" class="cp-toggle-btn w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
          isDone
            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-700/20'
            : 'border-slate-300 bg-white hover:border-emerald-500'
        }">
          <svg class="w-4 h-4 ${isDone ? 'block' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>

        <div class="truncate">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-900 ${isDone ? 'line-through text-slate-500' : ''}">
              ${cp.label}
            </span>
            <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              isDone ? 'bg-emerald-200/80 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }">
              Target: ${cp.targetPages} pages
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">
            ${isDone && cp.completedAt ? `Completed at ${cp.completedAt}` : `Check off once you finish reading ${cp.targetPages} pages.`}
          </p>
        </div>
      </div>

      <div class="shrink-0 flex items-center gap-2">
        <span class="text-xs font-semibold ${isDone ? 'text-emerald-700' : 'text-slate-400'}">
          ${isDone ? 'Done' : 'Pending'}
        </span>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach event listeners for checkbox toggle
  const buttons = container.querySelectorAll('.cp-toggle-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'), 10);
      handleCheckpointToggle(index);
    });
  });

  updateProgressIndicators();
}

/* =========================================================
   10. Checkpoint Toggle Handler
   ========================================================= */
function handleCheckpointToggle(index) {
  const cp = state.checkpoints[index];

  // If marking as completed and user hasn't provided name yet, ask name as per requirement
  if (!cp.completed) {
    requireUserName((userName) => {
      cp.completed = true;
      const now = new Date();
      cp.completedAt = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      renderCheckpoints();
      saveLocalState();
      showToast(`Masha'Allah! ${cp.label} done.`);
    });
  } else {
    // Toggle back to incomplete
    cp.completed = false;
    cp.completedAt = null;
    renderCheckpoints();
    saveLocalState();
  }
}

function updateProgressIndicators() {
  const total = state.checkpoints.length;
  if (total === 0) return;

  const completedCount = state.checkpoints.filter(c => c.completed).length;
  const pct = Math.round((completedCount / total) * 100);

  document.getElementById('progress-stats').textContent = `${completedCount} of ${total} Completed`;
  document.getElementById('progress-pct').textContent = `${pct}% of today's checkpoints`;
  document.getElementById('progress-bar-fill').style.width = `${pct}%`;
}

/* =========================================================
   8. Google Sheets Sync
   ========================================================= */
function syncToGoogleSheets(userName) {
  const completedCount = state.checkpoints.filter(c => c.completed).length;

  const payload = {
    name: userName,
    email: getCookie("tilawah_reader_email") || "",
    surah: state.surah,
    ayah: state.ayah,
    notes: state.notes,
    checkpointsCompleted: completedCount,
    totalPages: state.totalPages
  };

  // If today's record already exists (from an earlier save this session),
  // update it in place instead of creating a duplicate row.
  if (state.progressId) {
    payload.action = 'update';
    payload.progress_id = state.progressId;
  }

  return fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.text())
  .then(text => {
    try {
      const data = JSON.parse(text);
      if (data.success) {
        console.log('Data synced to Google Sheets:', data);
        if (data.progress_id) {
          state.progressId = data.progress_id;
          saveLocalState();
        }
        showToast('Progress saved to cloud ☁️', 'success');
      } else {
        console.warn('Sync warning:', data.error);
        showToast('Local save OK, cloud sync skipped', 'warning');
      }
    } catch (e) {
      console.warn('Failed to parse response. Raw response:', text);
      console.warn('Parse error details:', e.message);
      showToast('Local save OK, cloud sync skipped', 'warning');
    }
  })
  .catch(error => {
    console.warn('Google Sheets sync failed:', error);
    showToast('Local save OK, cloud sync skipped', 'warning');
  });
}

/* =========================================================
   9. Summary Section Render
   ========================================================= */
function renderSummary(userName) {
  const completedCount = state.checkpoints.filter(c => c.completed).length;

  document.getElementById('summary-date-text').textContent = new Date().toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  document.getElementById('sum-checkpoints').textContent = `${completedCount} / ${state.checkpointsCount} sessions`;
  document.getElementById('sum-pages').textContent = `${state.totalPages} pages planned`;
  document.getElementById('sum-position').textContent = `${state.surah}, Ayah ${state.ayah}`;

  const notesBox = document.getElementById('sum-notes-text');
  if (state.notes && state.notes.trim() !== "") {
    notesBox.textContent = `"${state.notes}"`;
  } else {
    notesBox.textContent = "No specific tadabbur notes recorded today.";
  }

  const summarySec = document.getElementById('summary-section');
  summarySec.classList.remove('hidden');
  summarySec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
