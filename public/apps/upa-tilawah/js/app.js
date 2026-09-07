/* =========================================================
   0. GOOGLE SHEETS CONFIGURATION
   ========================================================= */
// Replace with your deployed Google Apps Script URL
// Steps to get this URL:
// 1. Open google_apps_script.gs in Google Apps Script editor
// 2. Click Deploy > New deployment > Web app
// 3. Execute as: Me, Anyone with the link
// 4. Copy the deployment URL below
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxaG_u1-YSigp6vee5HPDdbqFN6pRAEZ6P2crHMSUbEQmfZnaJ-du6JUqKmUeJZh4BM/exec";
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
  pendingAction: null // Callback if name modal needed
};

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
   5. Name Cookie Logic
   ========================================================= */
const USER_NAME_COOKIE = "tilawah_reader_name";

function updateGreeting() {
  const savedName = getCookie(USER_NAME_COOKIE);
  const greetingEl = document.getElementById('user-greeting');
  const badgeEl = document.getElementById('user-badge');
  const badgeNameText = document.getElementById('badge-name-text');

  if (savedName) {
    greetingEl.textContent = `Assalamu'alaikum, ${savedName}! ✨`;
    badgeEl.classList.remove('hidden');
    badgeNameText.textContent = savedName;
  } else {
    greetingEl.textContent = "Assalamu'alaikum, Dedicated Reader ✨";
    badgeEl.classList.add('hidden');
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
   6. Initialization & Form Handlers
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
    if (!inputName) return;

    // Store into browser cookie (valid for 365 days)
    setCookie(USER_NAME_COOKIE, inputName, 365);
    updateGreeting();
    document.getElementById('name-modal').classList.add('hidden');
    showToast(`Welcome, ${inputName}! Your name has been saved.`);

    if (state.pendingAction) {
      const action = state.pendingAction;
      state.pendingAction = null;
      action(inputName);
    }
  });

  // Edit name button
  document.getElementById('edit-name-btn').addEventListener('click', () => {
    const current = getCookie(USER_NAME_COOKIE);
    document.getElementById('user-name-input').value = current || '';
    document.getElementById('name-modal').classList.remove('hidden');
    state.pendingAction = () => {
      showToast("Profile name updated!");
    };
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

      // Optionally sync to Google Sheets
      if (ENABLE_GOOGLE_SHEETS_SYNC) {
        syncToGoogleSheets(userName);
      }

      renderSummary(userName);
      showToast(`May Allah accept your tilawah, ${userName}! ✨`);
    });
  });

  // 9. Start New Plan button
  document.getElementById('reset-day-btn').addEventListener('click', () => {
    document.getElementById('summary-section').classList.add('hidden');
    document.getElementById('plan-status-badge').textContent = 'New Plan Needed';
    document.getElementById('plan-status-badge').className = 'text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium';
    planForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

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
      showToast(`Masha'Allah! ${cp.label} done.`);
    });
  } else {
    // Toggle back to incomplete
    cp.completed = false;
    cp.completedAt = null;
    renderCheckpoints();
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

  fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Data synced to Google Sheets:', data);
      showToast('Progress saved to cloud ☁️', 'success');
    } else {
      console.warn('Sync warning:', data.error);
      showToast('Local save OK, cloud sync skipped', 'warning');
    }
  })
  .catch(error => {
    console.warn('Google Sheets sync failed:', error);
    // Silently fail - user's data is still saved locally
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
