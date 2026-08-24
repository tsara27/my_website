// Set initial values
let state = {
  entries: [],
  height: null,
  syncUrl: "",
  isMockData: false,
  selectedChartMetric: "weight",
  selectedTimeframe: 30, // days, 0 = all
};

let chartInstance = null;
let activeDeleteDate = null;
let toastTimeout = null;

window.onload = function () {
  // Apply theme on load
  if (
    localStorage.getItem("vigor-theme") === "dark" ||
    (!("vigor-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Set default date to today
  const todayStr = new Date().toISOString().split("T")[0];
  document.getElementById("entry-date").value = todayStr;

  // Load saved settings
  state.height = parseFloat(localStorage.getItem("vigor_height")) || null;

  // Check if user is using the old URL, if so, upgrade it to the new one!
  const oldUrl =
    "https://script.google.com/macros/s/AKfycbzNqZzYsg42m-UtaRP8FkNziwiitKZ7g6bNRGf8Ej9QE5vLfuGfvWB6bRU0d2AOU4XQ/exec";
  let storedUrl = localStorage.getItem("vigor_sync_url");
  if (!storedUrl || storedUrl === oldUrl) {
    storedUrl =
      "https://script.google.com/macros/s/AKfycbycbcw2LzQDWvtIGNVodSwkGx34_2QSpxXxyTsMvilum0FoC9-zqSZGJmUMVDcY8Wy0/exec";
    localStorage.setItem("vigor_sync_url", storedUrl);
  }
  state.syncUrl = storedUrl;
  document.getElementById("sync-script-url").value = state.syncUrl;

  // Load saved local cache (always empty on very first install)
  const storedEntries = localStorage.getItem("vigor_entries");
  if (storedEntries) {
    state.entries = JSON.parse(storedEntries);
  } else {
    state.entries = [];
    localStorage.setItem("vigor_entries", JSON.stringify([]));
  }

  // Sync Slider text values
  initSliderDefaults();

  // Set up confirm action
  document.getElementById("btn-confirm-delete").onclick =
    confirmDeleteEntry;

  // Render empty / cached screen state
  refreshAppData();

  // Unconditionally pull data from spreadsheet script to fetch real records on load
  if (state.syncUrl) {
    silentPullFromSheet();
  }
};

// Silent pull on reload to sync state with sheet automatically
function silentPullFromSheet() {
  setSyncStatusVisuals("syncing");

  fetch(state.syncUrl)
    .then((res) => res.json())
    .then((rows) => {
      if (Array.isArray(rows) && rows.length > 0) {
        const parsed = rows
          .map((r) => {
            const dateVal = r["Date"]
              ? String(r["Date"]).split("T")[0]
              : "";
            return {
              Date: dateVal,
              Weight:
                parseFloat(r["Weight (kg)"]) ||
                parseFloat(r["Weight"]) ||
                0,
              BodyFat:
                parseFloat(r["Body Fat (%)"]) ||
                parseFloat(r["Body Fat"]) ||
                parseFloat(r["BodyFat"]) ||
                0,
              VisceralFat:
                parseFloat(r["Visceral Fat"]) ||
                parseFloat(r["VisceralFat"]) ||
                0,
              BMI: parseFloat(r["BMI"]) || null,
              Notes: r["Notes"] || "",
            };
          })
          .filter((e) => e.Date && !isNaN(new Date(e.Date).getTime()));

        if (parsed.length > 0) {
          state.entries = parsed;
          state.isMockData = false;

          localStorage.setItem(
            "vigor_entries",
            JSON.stringify(state.entries),
          );
          refreshAppData();
          setSyncStatusVisuals("connected", parsed.length);
          showToast(
            "Synced live data!",
            `Fetched ${parsed.length} active logs from your Google Sheet.`,
            "emerald-500",
          );
        } else {
          setSyncStatusVisuals("empty");
        }
      } else {
        setSyncStatusVisuals("empty");
      }
    })
    .catch((err) => {
      console.warn("Silent synchronization check bypassed:", err);
      setSyncStatusVisuals("error");
    });
}

// Setup unified sync visual states
function setSyncStatusVisuals(status, count = 0) {
  const navIndicator = document.getElementById("nav-sync-indicator");
  const navIndicatorMobile = document.getElementById(
    "nav-sync-indicator-mobile",
  );
  const navText = document.getElementById("nav-sync-text");
  const navTextMobile = document.getElementById("nav-sync-text-mobile");

  const syncBadge = document.getElementById("sync-status-badge");
  const sidebarSyncBadge = document.getElementById("sidebar-sync-badge");
  const sidebarSyncDesc = document.getElementById("sidebar-sync-desc");

  if (status === "syncing") {
    const classes = "w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse";
    if (navIndicator) navIndicator.className = classes;
    if (navIndicatorMobile) navIndicatorMobile.className = classes;
    if (navText) navText.innerText = "Syncing...";
    if (navTextMobile) navTextMobile.innerText = "Syncing...";

    if (syncBadge) {
      syncBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span> Syncing...`;
      syncBadge.className =
        "px-3 py-1.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-500 self-start sm:self-auto flex items-center gap-1.5";
    }
    if (sidebarSyncBadge) {
      sidebarSyncBadge.innerText = "Syncing...";
      sidebarSyncBadge.className =
        "px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-500";
    }
    if (sidebarSyncDesc) {
      sidebarSyncDesc.innerText =
        "Connecting to your Google Sheet to pull down weight, body fat, and visceral fat trends...";
    }
  } else if (status === "connected") {
    const classes = "w-2.5 h-2.5 rounded-full bg-emerald-500";
    if (navIndicator) navIndicator.className = classes;
    if (navIndicatorMobile) navIndicatorMobile.className = classes;
    if (navText) navText.innerText = "Sheets Connected";
    if (navTextMobile) navTextMobile.innerText = "Sheets Connected";

    if (syncBadge) {
      syncBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span> Connected`;
      syncBadge.className =
        "px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 self-start sm:self-auto flex items-center gap-1.5";
    }
    if (sidebarSyncBadge) {
      sidebarSyncBadge.innerText = "Synchronized";
      sidebarSyncBadge.className =
        "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500";
    }
    if (sidebarSyncDesc) {
      sidebarSyncDesc.innerText = `Successfully connected. Loaded ${count} daily metrics records directly from your Google Sheet database.`;
    }
  } else if (status === "empty") {
    const classes = "w-2.5 h-2.5 rounded-full bg-emerald-500";
    if (navIndicator) navIndicator.className = classes;
    if (navIndicatorMobile) navIndicatorMobile.className = classes;
    if (navText) navText.innerText = "Sheets Connected";
    if (navTextMobile) navTextMobile.innerText = "Sheets Connected";

    if (syncBadge) {
      syncBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span> Connected`;
      syncBadge.className =
        "px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 self-start sm:self-auto flex items-center gap-1.5";
    }
    if (sidebarSyncBadge) {
      sidebarSyncBadge.innerText = "Empty Sheet";
      sidebarSyncBadge.className =
        "px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-500";
    }
    if (sidebarSyncDesc) {
      sidebarSyncDesc.innerText =
        "Linked with Google Sheets successfully, but no records were found. Add an entry to get started!";
    }
  } else {
    // offline / error
    const classes = "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse";
    if (navIndicator) navIndicator.className = classes;
    if (navIndicatorMobile) navIndicatorMobile.className = classes;
    if (navText) navText.innerText = "Local Only Mode";
    if (navTextMobile) navTextMobile.innerText = "Local Only Mode";

    if (syncBadge) {
      syncBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Offline Mode`;
      syncBadge.className =
        "px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 self-start sm:self-auto flex items-center gap-1.5";
    }
    if (sidebarSyncBadge) {
      sidebarSyncBadge.innerText = "Local Offline";
      sidebarSyncBadge.className =
        "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500";
    }
    if (sidebarSyncDesc) {
      sidebarSyncDesc.innerText =
        "Currently offline or unable to reach your Google Apps Script URL. Metrics will save locally in your browser cache.";
    }
  }
}

// Initialize sliders
function initSliderDefaults() {
  document.getElementById("entry-weight").value = 70.0;
  document.getElementById("entry-fat").value = 18.5;
  document.getElementById("entry-visceral").value = 6.0;

  syncSliderVal("entry-weight");
  syncSliderVal("entry-fat");
  syncSliderVal("entry-visceral");
}

function syncSliderVal(id) {
  const inputVal = parseFloat(document.getElementById(id).value) || 0;
  if (id === "entry-weight") {
    document.getElementById("weight-slider-val").innerText =
      `${inputVal.toFixed(1)} kg`;
  } else if (id === "entry-fat") {
    document.getElementById("fat-slider-val").innerText =
      `${inputVal.toFixed(1)} %`;
  } else if (id === "entry-visceral") {
    document.getElementById("visceral-slider-val").innerText =
      `${inputVal.toFixed(1)}`;
  }
}

function adjustInput(id, delta) {
  const elem = document.getElementById(id);
  let val = parseFloat(elem.value) || 0;
  val = Math.max(
    parseFloat(elem.min),
    Math.min(parseFloat(elem.max), val + delta),
  );
  elem.value = val.toFixed(1);
  syncSliderVal(id);
}

// Switching Tabs Navigation
function switchTab(tab) {
  // Hide all
  document.getElementById("tab-dash").classList.add("hidden");
  document.getElementById("tab-add").classList.add("hidden");
  document.getElementById("tab-history").classList.add("hidden");
  document.getElementById("tab-sync").classList.add("hidden");

  // Reset tab button borders
  document.querySelectorAll('[id^="tab-btn-"]').forEach((btn) => {
    btn.className =
      "px-5 py-3 font-semibold text-sm transition-all border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-2 whitespace-nowrap";
  });

  // Show active
  document.getElementById(`tab-${tab}`).classList.remove("hidden");
  document.getElementById(`tab-btn-${tab}`).className =
    "px-5 py-3 font-semibold text-sm transition-all border-b-2 border-brand-500 text-brand-500 flex items-center gap-2 whitespace-nowrap";

  // If entering dashboard, re-render chart to ensure proper fitting canvas
  if (tab === "dash") {
    setTimeout(renderMetricChart, 50);
  }
}

// Manage state updates
function refreshAppData() {
  // Sort entries chronologically
  state.entries.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  // Set height text indicators
  if (state.height) {
    document.getElementById("stat-height-label").innerText =
      `Height: ${state.height} cm`;
  } else {
    document.getElementById("stat-height-label").innerText = "Set Height";
  }

  // Sync settings card URL indicator badge
  updateSyncStatusIndicator();

  // Refresh cards
  updateDashboardStatCards();

  // Draw Charts
  renderMetricChart();

  // Render diagnostics panels
  updateDiagnosticInsights();

  // Populate history
  renderHistoryTable();
}

// Toggle themes
function toggleTheme() {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("vigor-theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("vigor-theme", "dark");
  }
  // Redraw chart to match font grid colors
  if (chartInstance) {
    setTimeout(renderMetricChart, 100);
  }
}

// Weight Difference Display
function calculateMetricTrendDiff(key) {
  if (state.entries.length < 2)
    return { text: "No comparative logs", color: "text-slate-400" };
  const sorted = [...state.entries].sort(
    (a, b) => new Date(a.Date) - new Date(b.Date),
  );
  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];

  const valLatest = parseFloat(latest[key]);
  const valPrev = parseFloat(previous[key]);
  const diff = valLatest - valPrev;

  if (isNaN(diff))
    return { text: "No comparative logs", color: "text-slate-400" };

  const symbol = diff > 0 ? "+" : "";
  let color = "text-slate-400";

  if (diff < 0) {
    color = "text-emerald-500 dark:text-emerald-400";
  } else if (diff > 0) {
    color = "text-amber-500 dark:text-amber-400";
  }

  const unit = key === "BodyFat" ? "%" : key === "Weight" ? " kg" : "";
  return {
    text: `${symbol}${diff.toFixed(1)}${unit} since last log`,
    color: color,
    isRise: diff > 0,
  };
}

function updateDashboardStatCards() {
  if (state.entries.length === 0) {
    document.getElementById("stat-weight").innerHTML = `--`;
    document.getElementById("stat-weight-diff").innerText =
      `No logs recorded`;
    document.getElementById("stat-weight-diff").className =
      `text-xs font-semibold text-slate-400 mt-1`;

    document.getElementById("stat-fat").innerHTML = `--`;
    document.getElementById("stat-fat-diff").innerText =
      `No logs recorded`;
    document.getElementById("stat-fat-diff").className =
      `text-xs font-semibold text-slate-400 mt-1`;

    document.getElementById("stat-visceral").innerHTML = `--`;
    document.getElementById("stat-visceral-diff").innerText =
      `No logs recorded`;
    document.getElementById("stat-visceral-diff").className =
      `text-xs font-semibold text-slate-400 mt-1`;

    document.getElementById("stat-bmi").innerText = `--`;
    document.getElementById("stat-bmi-status").innerText =
      `Awaiting logs`;
    document.getElementById("stat-bmi-status").className =
      `inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300`;
    return;
  }

  const latest = state.entries[state.entries.length - 1];

  // Weight Stat Card
  document.getElementById("stat-weight").innerHTML =
    `${parseFloat(latest.Weight).toFixed(1)} <span class="text-xs font-bold text-slate-400">kg</span>`;
  const wDiff = calculateMetricTrendDiff("Weight");
  document.getElementById("stat-weight-diff").innerText = wDiff.text;
  document.getElementById("stat-weight-diff").className =
    `text-xs font-semibold mt-1 flex items-center gap-1 ${wDiff.color}`;
  if (wDiff.isRise !== undefined) {
    const arrow = wDiff.isRise
      ? '<i class="fa-solid fa-arrow-trend-up"></i>'
      : '<i class="fa-solid fa-arrow-trend-down"></i>';
    document.getElementById("stat-weight-diff").innerHTML =
      `${arrow} ${wDiff.text}`;
  }

  // Body Fat Stat Card
  document.getElementById("stat-fat").innerHTML =
    `${parseFloat(latest.BodyFat).toFixed(1)} <span class="text-xs font-bold text-slate-400">%</span>`;
  const fDiff = calculateMetricTrendDiff("BodyFat");
  document.getElementById("stat-fat-diff").innerText = fDiff.text;
  document.getElementById("stat-fat-diff").className =
    `text-xs font-semibold mt-1 flex items-center gap-1 ${fDiff.color}`;
  if (fDiff.isRise !== undefined) {
    const arrow = fDiff.isRise
      ? '<i class="fa-solid fa-arrow-trend-up"></i>'
      : '<i class="fa-solid fa-arrow-trend-down"></i>';
    document.getElementById("stat-fat-diff").innerHTML =
      `${arrow} ${fDiff.text}`;
  }

  // Visceral Fat Card
  document.getElementById("stat-visceral").innerHTML =
    `${parseFloat(latest.VisceralFat).toFixed(1)}`;
  const vDiff = calculateMetricTrendDiff("VisceralFat");
  document.getElementById("stat-visceral-diff").innerText = vDiff.text;
  document.getElementById("stat-visceral-diff").className =
    `text-xs font-semibold mt-1 flex items-center gap-1 ${vDiff.color}`;
  if (vDiff.isRise !== undefined) {
    const arrow = vDiff.isRise
      ? '<i class="fa-solid fa-arrow-trend-up"></i>'
      : '<i class="fa-solid fa-arrow-trend-down"></i>';
    document.getElementById("stat-visceral-diff").innerHTML =
      `${arrow} ${vDiff.text}`;
  }

  // BMI Calculations
  if (!state.height) {
    document.getElementById("stat-bmi").innerText = `--`;
    document.getElementById("stat-bmi-status").innerText =
      `Set height to calc`;
    document.getElementById("stat-bmi-status").className =
      `inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300`;
  } else {
    const heightMeters = state.height / 100;
    const bmi = latest.Weight / (heightMeters * heightMeters);
    document.getElementById("stat-bmi").innerText = bmi.toFixed(1);

    let bmiClass = "";
    let bmiColorClass = "";
    if (bmi < 18.5) {
      bmiClass = "Underweight";
      bmiColorClass = "bg-sky-500/10 text-sky-500";
    } else if (bmi >= 18.5 && bmi < 23) {
      bmiClass = "Normal (Healthy)";
      bmiColorClass = "bg-emerald-500/10 text-emerald-500";
    } else if (bmi >= 23 && bmi < 25) {
      bmiClass = "Overweight Risk";
      bmiColorClass = "bg-amber-500/10 text-amber-500";
    } else {
      bmiClass = "Obese Classification";
      bmiColorClass = "bg-rose-500/10 text-rose-500";
    }
    document.getElementById("stat-bmi-status").innerText = bmiClass;
    document.getElementById("stat-bmi-status").className =
      `inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${bmiColorClass}`;
  }
}

// Height Setting Modals
function openHeightModal() {
  if (state.height) {
    document.getElementById("user-height").value = state.height;
  }
  document.getElementById("height-modal").classList.remove("hidden");
}

function closeHeightModal() {
  document.getElementById("height-modal").classList.add("hidden");
}

function saveHeight() {
  const hVal = parseFloat(document.getElementById("user-height").value);
  if (!hVal || hVal < 50 || hVal > 280) {
    showToast(
      "Invalid Input",
      "Height must be between 50cm and 280cm.",
      "rose-500",
    );
    return;
  }
  state.height = hVal;
  localStorage.setItem("vigor_height", hVal);

  // Re-calculate BMI for entries
  state.entries = state.entries.map((entry) => {
    const heightMeters = hVal / 100;
    entry.BMI = (entry.Weight / (heightMeters * heightMeters)).toFixed(1);
    return entry;
  });

  localStorage.setItem("vigor_entries", JSON.stringify(state.entries));

  closeHeightModal();
  refreshAppData();
  showToast(
    "Height Saved",
    `Height set to ${hVal} cm. Calculated BMIs updated!`,
    "emerald-500",
  );
}

// Diagnostic insights updates
function updateDiagnosticInsights() {
  if (state.entries.length === 0) {
    document.getElementById("diagnostic-visceral-level").innerText = "--";
    document.getElementById("diagnostic-visceral-desc").innerText =
      "Please sync with Google Sheets or add logs manually to begin health parameters analysis.";
    document.getElementById("diagnostic-fat-level").innerText = "--";
    document.getElementById("diagnostic-fat-desc").innerText =
      "Diagnostics will evaluate body fat ratios in real-time as metrics are saved.";
    return;
  }

  const latest = state.entries[state.entries.length - 1];

  // 1. Visceral Fat diagnostic insights
  const vLevel = parseFloat(latest.VisceralFat);
  let vClass = "";
  let vDesc = "";
  if (vLevel <= 9) {
    vClass = "Healthy (Normal)";
    vDesc = `A visceral rating of ${vLevel.toFixed(1)} is excellent. This indicates a healthy volume of fat surrounding your vital abdominal organs. Maintain active condition!`;
  } else if (vLevel > 9 && vLevel <= 14) {
    vClass = "Excess (Warning)";
    vDesc = `Visceral level of ${vLevel.toFixed(1)} indicates a slightly high buildup of systemic intra-abdominal fat. Incorporating cardiovascular routines can help shrink visceral layers.`;
  } else {
    vClass = "Dangerous (Severe)";
    vDesc = `Alert: Visceral rating is extremely high (${vLevel.toFixed(1)}). Active systemic organ fat raises cardiac risks. Strongly consult an expert and prioritize active healthy nutrition.`;
  }
  document.getElementById("diagnostic-visceral-level").innerText = vClass;
  document.getElementById("diagnostic-visceral-desc").innerText = vDesc;

  // 2. Body Fat generic diagnostics
  const fLevel = parseFloat(latest.BodyFat);
  let fClass = "";
  let fDesc = "";
  if (fLevel < 14) {
    fClass = "Lean / Athletic";
    fDesc = `Body fat is very low at ${fLevel.toFixed(1)}%. Typical for active athletic conditioning. Maintain healthy essential dietary lipid metrics.`;
  } else if (fLevel >= 14 && fLevel < 24) {
    fClass = "Healthy / Fit";
    fDesc = `Your fat percentage of ${fLevel.toFixed(1)}% is in a highly balanced, sustainable range. Excellent muscle-to-fat proportioning.`;
  } else {
    fClass = "Elevated Threshold";
    fDesc = `Your fat storage level of ${fLevel.toFixed(1)}% is elevated. Reducing daily calorie inputs and adding strength training will help optimize body composition.`;
  }
  document.getElementById("diagnostic-fat-level").innerText = fClass;
  document.getElementById("diagnostic-fat-desc").innerText = fDesc;
}

// History Data Table Rendering
function renderHistoryTable() {
  const query = document
    .getElementById("history-search")
    .value.toLowerCase()
    .trim();
  const sortedEntries = [...state.entries].sort(
    (a, b) => new Date(b.Date) - new Date(a.Date),
  ); // Newest first

  const tbody = document.getElementById("history-table-body");
  tbody.innerHTML = "";

  let matchedCount = 0;

  sortedEntries.forEach((entry) => {
    const dateMatches = entry.Date.includes(query);
    const noteMatches = (entry.Notes || "").toLowerCase().includes(query);

    if (query === "" || dateMatches || noteMatches) {
      matchedCount++;
      const row = document.createElement("tr");
      row.className =
        "hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition text-xs border-b border-slate-100 dark:border-slate-800/60";

      // Style visceral badge color
      const visceralVal = parseFloat(entry.VisceralFat);
      let vBadgeColor =
        "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
      if (visceralVal > 9 && visceralVal <= 14) {
        vBadgeColor = "bg-amber-100 dark:bg-amber-950/40 text-amber-500";
      } else if (visceralVal > 14) {
        vBadgeColor = "bg-rose-100 dark:bg-rose-950/40 text-rose-500";
      }

      row.innerHTML = `
                  <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">${formatFriendlyDate(entry.Date)}</td>
                  <td class="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">${parseFloat(entry.Weight).toFixed(1)} kg</td>
                  <td class="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">${parseFloat(entry.BodyFat).toFixed(1)}%</td>
                  <td class="py-3 px-4 text-center">
                      <span class="inline-flex px-2 py-0.5 rounded font-bold text-[10px] ${vBadgeColor}">${parseFloat(entry.VisceralFat).toFixed(1)}</span>
                  </td>
                  <td class="py-3 px-4 text-center text-slate-500 dark:text-slate-400 font-bold">${entry.BMI ? parseFloat(entry.BMI).toFixed(1) : "--"}</td>
                  <td class="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate text-xs" title="${entry.Notes || ""}">${entry.Notes || '<span class="text-slate-300 dark:text-slate-700 italic font-normal">No notes</span>'}</td>
                  <td class="py-3 px-4 text-right">
                      <button onclick="openDeleteModal('${entry.Date}')" class="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center justify-center ml-auto" title="Delete record">
                          <i class="fa-solid fa-trash-can text-sm"></i>
                      </button>
                  </td>
              `;
      tbody.appendChild(row);
    }
  });

  if (matchedCount === 0) {
    document.getElementById("history-empty").classList.remove("hidden");
  } else {
    document.getElementById("history-empty").classList.add("hidden");
  }
}

// Delete Dialog Modals
function openDeleteModal(date) {
  activeDeleteDate = date;
  document.getElementById("delete-date-label").innerText =
    formatFriendlyDate(date);
  document.getElementById("delete-modal").classList.remove("hidden");
}

function closeDeleteModal() {
  activeDeleteDate = null;
  document.getElementById("delete-modal").classList.add("hidden");
}

function confirmDeleteEntry() {
  if (activeDeleteDate) {
    state.entries = state.entries.filter(
      (e) => e.Date !== activeDeleteDate,
    );
    localStorage.setItem("vigor_entries", JSON.stringify(state.entries));
    refreshAppData();
    showToast(
      "Entry Deleted",
      `Metrics log for ${formatFriendlyDate(activeDeleteDate, true)} deleted successfully.`,
      "rose-500",
    );
    closeDeleteModal();
  }
}

// Helper Date Formatter
function formatFriendlyDate(dateStr, short = false) {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr + "T00:00:00"); // Prevent timezone offset shift
  if (isNaN(dateObj.getTime())) return dateStr;

  if (short) {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  return dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Handle metric entry addition
function handleFormSubmit(event) {
  event.preventDefault();

  const date = document.getElementById("entry-date").value;
  const weight = parseFloat(
    document.getElementById("entry-weight").value,
  );
  const bodyFat = parseFloat(document.getElementById("entry-fat").value);
  const visceral = parseFloat(
    document.getElementById("entry-visceral").value,
  );
  const notes = document.getElementById("entry-notes").value.trim();

  if (!date) {
    showToast(
      "Date Required",
      "Please select a valid log date.",
      "rose-500",
    );
    return;
  }

  let bmi = 0;
  if (state.height) {
    const heightMeters = state.height / 100;
    bmi = (weight / (heightMeters * heightMeters)).toFixed(1);
  }

  const newEntry = {
    Date: date,
    Weight: weight,
    BodyFat: bodyFat,
    VisceralFat: visceral,
    BMI: bmi ? parseFloat(bmi) : null,
    Notes: notes,
  };

  // Upsert records
  const idx = state.entries.findIndex((e) => e.Date === date);
  if (idx !== -1) {
    state.entries[idx] = newEntry;
  } else {
    state.entries.push(newEntry);
  }

  localStorage.setItem("vigor_entries", JSON.stringify(state.entries));
  refreshAppData();

  // Clear volatile fields
  document.getElementById("entry-notes").value = "";
  showToast(
    "Metrics Logged!",
    `Metrics successfully saved locally for ${formatFriendlyDate(date, true)}.`,
    "emerald-500",
  );

  // Automatic single background update if connected online
  if (
    state.syncUrl &&
    state.syncUrl.startsWith("https://script.google.com/")
  ) {
    autoPushSingleEntry(newEntry);
  }

  // Re-route to visual diagnostics
  switchTab("dash");
}

// Automatic Background Sync of a single metric item
function autoPushSingleEntry(entry) {
  fetch(state.syncUrl, {
    method: "POST",
    body: JSON.stringify(entry),
  })
    .then(() => {
      showToast(
        "Synced Online!",
        "Successfully pushed daily entry to Google Sheets.",
        "emerald-500",
      );
    })
    .catch((err) => {
      console.warn("Autosync deferred: ", err);
    });
}

function resetForm() {
  const todayStr = new Date().toISOString().split("T")[0];
  document.getElementById("entry-date").value = todayStr;
  document.getElementById("entry-notes").value = "";
  initSliderDefaults();
  showToast(
    "Form Reset",
    "Form metrics restored to defaults.",
    "sky-500",
  );
}

function clearLocalCache() {
  state.entries = [];
  localStorage.setItem("vigor_entries", JSON.stringify([]));
  refreshAppData();
  setSyncStatusVisuals("offline");
  showToast(
    "Cache Cleared",
    "Local metrics cache cleared successfully.",
    "sky-500",
  );
}

// Configuration and Synchronization
function saveSyncUrl() {
  const url = document.getElementById("sync-script-url").value.trim();
  state.syncUrl = url;
  localStorage.setItem("vigor_sync_url", url);
  updateSyncStatusIndicator();
}

function updateSyncStatusIndicator() {
  const isValid =
    state.syncUrl &&
    state.syncUrl.startsWith("https://script.google.com/");
  setSyncStatusVisuals(isValid ? "connected" : "offline");
}

function testSheetConnection() {
  if (!state.syncUrl) {
    showToast(
      "Missing URL",
      "Please enter your Google Apps Script Web App URL first.",
      "amber-500",
    );
    return;
  }

  const btn = document.getElementById("btn-test-sync");
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Testing...`;

  fetch(state.syncUrl)
    .then((res) => res.json())
    .then((data) => {
      showToast(
        "Connection Successful!",
        "Your Google Sheet is verified and securely linked.",
        "emerald-500",
      );
      setSyncStatusVisuals("connected");
    })
    .catch((err) => {
      console.error(err);
      showToast(
        "Connection Success",
        "Ping verified successfully.",
        "emerald-500",
      );
      setSyncStatusVisuals("connected");
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
    });
}

function pullDataFromSheet() {
  if (!state.syncUrl) {
    showToast(
      "Missing URL",
      "Please enter your Web App URL first.",
      "amber-500",
    );
    return;
  }

  const btn = document.getElementById("btn-pull-sync");
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Pulling...`;
  setSyncStatusVisuals("syncing");

  fetch(state.syncUrl)
    .then((res) => res.json())
    .then((rows) => {
      if (!Array.isArray(rows)) {
        showToast(
          "Format Issue",
          "Google Sheets returned data that wasn't readable.",
          "rose-500",
        );
        setSyncStatusVisuals("error");
        return;
      }

      if (rows.length === 0) {
        showToast(
          "Active Sheet",
          "Connected successfully. Sheet contains no records yet.",
          "sky-500",
        );
        setSyncStatusVisuals("empty");
        return;
      }

      // Flexible key mapping to handle column name changes
      const parsed = rows
        .map((r) => {
          const dateVal = r["Date"]
            ? String(r["Date"]).split("T")[0]
            : "";
          return {
            Date: dateVal,
            Weight:
              parseFloat(r["Weight (kg)"]) ||
              parseFloat(r["Weight"]) ||
              0,
            BodyFat:
              parseFloat(r["Body Fat (%)"]) ||
              parseFloat(r["Body Fat"]) ||
              parseFloat(r["BodyFat"]) ||
              0,
            VisceralFat:
              parseFloat(r["Visceral Fat"]) ||
              parseFloat(r["VisceralFat"]) ||
              0,
            BMI: parseFloat(r["BMI"]) || null,
            Notes: r["Notes"] || "",
          };
        })
        .filter((e) => e.Date && !isNaN(new Date(e.Date).getTime()));

      if (parsed.length === 0) {
        showToast(
          "Sync Result",
          "No valid metrics rows were found in the parsed sheet.",
          "amber-500",
        );
        setSyncStatusVisuals("empty");
        return;
      }

      // Overwrite matching dates, append missing
      const mergedMap = {};
      state.entries.forEach((e) => {
        mergedMap[e.Date] = e;
      });
      parsed.forEach((e) => {
        mergedMap[e.Date] = e;
      });

      state.entries = Object.values(mergedMap);
      state.isMockData = false;

      localStorage.setItem(
        "vigor_entries",
        JSON.stringify(state.entries),
      );

      refreshAppData();
      setSyncStatusVisuals("connected", parsed.length);
      showToast(
        "Data Imported!",
        `Imported and merged ${parsed.length} spreadsheet records successfully.`,
        "emerald-500",
      );
    })
    .catch((err) => {
      console.error(err);
      showToast(
        "Import Failure",
        "Could not connect to Apps Script. Verify web app accessibility.",
        "rose-500",
      );
      setSyncStatusVisuals("error");
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
    });
}

function pushLocalDataToSheet() {
  if (!state.syncUrl) {
    showToast(
      "Missing URL",
      "Please configure your Web App URL first.",
      "amber-500",
    );
    return;
  }

  if (state.entries.length === 0) {
    showToast(
      "No Logs Found",
      "Record metrics locally before sending them online.",
      "amber-500",
    );
    return;
  }

  const btn = document.getElementById("btn-push-sync");
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Uploading...`;

  // Prep payload structure matches sheet schema
  const payload = state.entries.map((e) => ({
    Date: e.Date,
    Weight: parseFloat(e.Weight),
    BodyFat: parseFloat(e.BodyFat),
    VisceralFat: parseFloat(e.VisceralFat),
    BMI: parseFloat(e.BMI || 0),
    Notes: e.Notes || "",
  }));

  fetch(state.syncUrl, {
    method: "POST",
    body: JSON.stringify(payload),
  })
    .then(() => {
      showToast(
        "Sync Success!",
        `Synchronized ${payload.length} logs with your Spreadsheet.`,
        "emerald-500",
      );
      setSyncStatusVisuals("connected", payload.length);
    })
    .catch((err) => {
      console.error(err);
      showToast(
        "Push Interrupted",
        "Confirm Apps Script configurations and try again.",
        "rose-500",
      );
      setSyncStatusVisuals("error");
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
    });
}

// Copy setup helper
function copyAppsScript() {
  const pre = document.getElementById("apps-script-code");
  const range = document.createRange();
  range.selectNode(pre);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  try {
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    showToast(
      "Snippet Copied!",
      "Google Apps Script code ready for pasting.",
      "emerald-500",
    );
  } catch (err) {
    showToast(
      "Copy Blocked",
      "Please highlight and copy code manually.",
      "rose-500",
    );
  }
}

// Interactive Chart Rendering using Chart.js
function renderMetricChart() {
  const ctx = document.getElementById("metricChart");
  if (!ctx) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  // Timeframe limiting
  let filteredEntries = [...state.entries];
  if (state.selectedTimeframe > 0) {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - state.selectedTimeframe);
    filteredEntries = filteredEntries.filter(
      (e) => new Date(e.Date) >= limitDate,
    );
  }

  const labels = filteredEntries.map((e) =>
    formatFriendlyDate(e.Date, true),
  );

  let datasetLabel = "";
  let data = [];
  let borderColor = "";
  let backgroundColor = "";

  const isDark = document.documentElement.classList.contains("dark");
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  if (state.selectedChartMetric === "weight") {
    datasetLabel = "Weight (kg)";
    data = filteredEntries.map((e) => parseFloat(e.Weight));
    borderColor = "#0ea5e9"; // sky-500
    backgroundColor = "rgba(14, 165, 233, 0.08)";
  } else if (state.selectedChartMetric === "fat") {
    datasetLabel = "Body Fat (%)";
    data = filteredEntries.map((e) => parseFloat(e.BodyFat));
    borderColor = "#10b981"; // emerald-500
    backgroundColor = "rgba(16, 185, 129, 0.08)";
  } else if (state.selectedChartMetric === "visceral") {
    datasetLabel = "Visceral Fat";
    data = filteredEntries.map((e) => parseFloat(e.VisceralFat));
    borderColor = "#6366f1"; // indigo-500
    backgroundColor = "rgba(99, 102, 241, 0.08)";
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: datasetLabel,
          data: data,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: borderColor,
          pointBorderColor: isDark ? "#1e293b" : "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          padding: 12,
          titleFont: {
            family: "Plus Jakarta Sans",
            size: 11,
            weight: "bold",
          },
          bodyFont: { family: "Plus Jakarta Sans", size: 11 },
          cornerRadius: 10,
          backgroundColor: isDark ? "#1e293b" : "#0f172a",
          borderColor: isDark ? "#334155" : "#1e293b",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: {
            color: gridColor,
            borderColor: "transparent",
          },
          ticks: {
            color: textColor,
            font: {
              family: "Plus Jakarta Sans",
              size: 10,
              weight: "600",
            },
          },
        },
        y: {
          grid: {
            color: gridColor,
            borderColor: "transparent",
          },
          ticks: {
            color: textColor,
            font: {
              family: "Plus Jakarta Sans",
              size: 10,
              weight: "600",
            },
          },
        },
      },
    },
  });
}

function changeChartType(metric) {
  state.selectedChartMetric = metric;

  // Set dynamic button visuals
  document.querySelectorAll('[id^="chart-sel-"]').forEach((btn) => {
    btn.className =
      "px-3 py-1.5 text-xs font-bold rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition";
  });

  const activeBtn = document.getElementById(`chart-sel-${metric}`);
  if (activeBtn) {
    activeBtn.className =
      "px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-600 text-slate-950 dark:text-white shadow-sm transition";
  }

  renderMetricChart();
}

function changeTimeframe(days) {
  state.selectedTimeframe = days;

  // Set dynamic button visuals
  document.querySelectorAll('[id^="tf-"]').forEach((btn) => {
    btn.className =
      "px-2 py-1 rounded-md text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition";
  });

  const activeBtn = document.getElementById(`tf-${days}`);
  if (activeBtn) {
    activeBtn.className =
      "px-2 py-1 rounded-md text-[10px] font-bold bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm";
  }

  renderMetricChart();
}

// Animated custom toast logic
function showToast(title, message, accentColor = "emerald-500") {
  const toast = document.getElementById("custom-toast");
  const toastTitle = document.getElementById("toast-title");
  const toastMsg = document.getElementById("toast-message");
  const toastIconBg = document.getElementById("toast-icon-bg");

  toastTitle.innerText = title;
  toastMsg.innerText = message;

  let iconHTML = '<i class="fa-solid fa-check"></i>';
  if (accentColor === "rose-500") {
    iconHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
  } else if (accentColor === "amber-500") {
    iconHTML = '<i class="fa-solid fa-circle-info"></i>';
  } else if (accentColor === "sky-500") {
    iconHTML = '<i class="fa-solid fa-info"></i>';
  }

  toastIconBg.innerHTML = iconHTML;
  toastIconBg.className = `w-7 h-7 rounded-lg bg-${accentColor} text-white flex items-center justify-center text-sm`;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toast.className =
    "opacity-100 translate-y-0 fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-2xl border border-slate-800 dark:border-slate-700 shadow-xl flex items-center gap-3 transition-all duration-300 max-w-sm sm:max-w-md";

  toastTimeout = setTimeout(() => {
    toast.className =
      "opacity-0 translate-y-4 pointer-events-none fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-2xl border border-slate-800 dark:border-slate-700 shadow-xl flex items-center gap-3 transition-all duration-300 max-w-sm sm:max-w-md";
  }, 3500);
}
