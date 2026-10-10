// State management
const state = {
  unit: 'km', // 'km' or 'mi'
  balkeDistanceMeters: 3400,
  runnerLevel: 'intermediate',
  targetEvent: 'half',
  trainingDays: 5,
  intensityModifier: 1.0,
  athleteName: 'Jane Doe',
  targetDate: 'Upcoming Season'
};

// DOM Elements
const inputDistance = document.getElementById('test-distance');
const distanceUnitLabel = document.getElementById('distance-unit-label');
const selectRunnerLevel = document.getElementById('runner-level');
const selectTargetEvent = document.getElementById('target-event');
const inputDays = document.getElementById('input-days');
const daysDisplay = document.getElementById('days-display');
const intensitySlider = document.getElementById('intensity-slider');
const intensityPercentLabel = document.getElementById('intensity-percent-label');
const btnUnitKm = document.getElementById('unit-km');
const btnUnitMi = document.getElementById('unit-mi');
const btnExportPdf = document.getElementById('btn-export-pdf');
const athleteNameInput = document.getElementById('athlete-name');
const targetDateInput = document.getElementById('target-date');

// Helper Modal Elements
const btnTrackHelper = document.getElementById('btn-track-helper');
const trackHelperPanel = document.getElementById('track-helper-panel');
const btnCloseHelper = document.getElementById('btn-close-helper');
const btnApplyLaps = document.getElementById('btn-apply-laps');
const inputLaps = document.getElementById('input-laps');
const inputExtraMeters = document.getElementById('input-extra-meters');

// PDF Modal Elements
const pdfModal = document.getElementById('pdf-modal');
const btnClosePdfModal = document.getElementById('btn-close-pdf-modal');
const btnDirectDownloadPdf = document.getElementById('btn-direct-download-pdf');
const btnTriggerPrint = document.getElementById('btn-trigger-print');
const btnOpenPrintTab = document.getElementById('btn-open-print-tab');
const modalAthleteName = document.getElementById('modal-athlete-name');
const modalVo2 = document.getElementById('modal-vo2');
const modalVolume = document.getElementById('modal-volume');
const downloadText = document.getElementById('download-text');
const downloadIcon = document.getElementById('download-icon');

// Toast element
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

function showToast(msg) {
  toastMessage.textContent = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3000);
}

function renderApp() {
  const isMiles = state.unit === 'mi';
  const unitLabel = isMiles ? 'Miles' : 'KM';
  const paceUnit = isMiles ? 'min/mi' : 'min/km';

  // 1. Calculate VO2 Max
  const vo2 = calculateBalkeVO2(state.balkeDistanceMeters);
  const tier = getFitnessTier(vo2);

  // Radial progress calculation (circumference: 2 * PI * 46 = ~289)
  const radialProgress = document.getElementById('radial-progress');
  const maxVo2Expected = 70;
  const minVo2Expected = 20;
  const vo2Ratio = Math.min(Math.max((vo2 - minVo2Expected) / (maxVo2Expected - minVo2Expected), 0.05), 1.0);
  const strokeOffset = 289 - (289 * vo2Ratio);
  radialProgress.style.strokeDashoffset = strokeOffset;

  document.getElementById('vo2-number').textContent = vo2.toFixed(1);
  
  const badgeEl = document.getElementById('fitness-badge');
  badgeEl.textContent = tier.label;
  badgeEl.className = `px-2.5 py-1 text-xs font-bold rounded-full border ${tier.badgeClass}`;

  // Paces & Velocities
  const paces = calculatePaces(state.balkeDistanceMeters);
  const vKmhDisplay = isMiles ? `${(paces.vKmh * KM_TO_MILES).toFixed(1)} mph` : `${paces.vKmh.toFixed(1)} km/h`;
  document.getElementById('vvo2-val').textContent = vKmhDisplay;

  // 12-min Cooper Equivalent estimation (12/15 approx)
  const cooperMeters = Math.round(state.balkeDistanceMeters * (12 / 15));
  document.getElementById('cooper-equiv').textContent = `${cooperMeters.toLocaleString()} m`;
  document.getElementById('aerobic-rating-text').textContent = tier.label.includes('Elite') ? 'Top 3%' : (tier.label.includes('Excellent') ? 'Top 15%' : 'Standard');

  // 2. Weekly Mileage Calculation
  const mileageKm = calculateWeeklyMileage(vo2, state.runnerLevel, state.targetEvent, state.intensityModifier);

  let targetVal = mileageKm.target;
  let minVal = mileageKm.min;
  let maxVal = mileageKm.max;

  if (isMiles) {
    targetVal = Math.round(targetVal * KM_TO_MILES);
    minVal = Math.round(minVal * KM_TO_MILES);
    maxVal = Math.round(maxVal * KM_TO_MILES);
  }

  document.getElementById('target-mileage').textContent = targetVal;
  document.getElementById('mileage-unit-display').textContent = `${unitLabel.toLowerCase()} / week`;
  document.getElementById('safe-target-mileage').textContent = `${targetVal} ${unitLabel.toLowerCase()}`;
  document.getElementById('safe-min-mileage').textContent = `${minVal} ${unitLabel.toLowerCase()}`;
  document.getElementById('safe-max-mileage').textContent = `${maxVal} ${unitLabel.toLowerCase()}`;

  // 80/20 Distribution values
  const easyVol = (targetVal * 0.78).toFixed(1);
  const tempoVol = (targetVal * 0.14).toFixed(1);
  const intervalVol = (targetVal * 0.08).toFixed(1);

  document.getElementById('vol-easy-display').textContent = `${easyVol} ${unitLabel.toLowerCase()}`;
  document.getElementById('vol-tempo-display').textContent = `${tempoVol} ${unitLabel.toLowerCase()}`;
  document.getElementById('vol-interval-display').textContent = `${intervalVol} ${unitLabel.toLowerCase()}`;

  // Pacing cards
  document.getElementById('pace-unit-label').textContent = paceUnit;
  document.getElementById('pace-easy').textContent = `${formatPace(paces.easy[0], isMiles)} - ${formatPace(paces.easy[1], isMiles)}`;
  document.getElementById('pace-marathon').textContent = `${formatPace(paces.marathon[0], isMiles)} - ${formatPace(paces.marathon[1], isMiles)}`;
  document.getElementById('pace-threshold').textContent = `${formatPace(paces.threshold[0], isMiles)} - ${formatPace(paces.threshold[1], isMiles)}`;
  document.getElementById('pace-vo2').textContent = `${formatPace(paces.interval[0], isMiles)} - ${formatPace(paces.interval[1], isMiles)}`;

  // 3. Weekly Schedule Generation
  const schedule = generateWeeklySchedule(targetVal, state.trainingDays, unitLabel.toLowerCase());
  const scheduleTbody = document.getElementById('schedule-tbody');
  scheduleTbody.innerHTML = '';

  schedule.forEach(item => {
    const isRest = item.type === 'Rest';
    const badgeColor = isRest ? 'bg-gray-800 text-gray-400 border-gray-700' : 
      (item.type === 'Quality' || item.type === 'Interval' ? 'bg-magenta-500/20 text-magenta-300 border-magenta-500/40' : 
      (item.type === 'Long' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'));

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-surface-cardHover/50 transition-colors';
    tr.innerHTML = `
      <td class="py-3 px-3 font-bold text-white">${item.day}</td>
      <td class="py-3 px-3">
        <span class="block font-semibold text-white text-xs">${item.name}</span>
        <span class="block text-[11px] text-gray-400 font-sans">${item.desc}</span>
      </td>
      <td class="py-3 px-3">
        <span class="px-2 py-0.5 text-[10px] rounded-full border font-sans font-bold ${badgeColor}">
          ${item.type}
        </span>
      </td>
      <td class="py-3 px-3 text-right font-bold ${isRest ? 'text-gray-500' : 'text-magenta-400'}">
        ${item.distanceFormatted}
      </td>
    `;
    scheduleTbody.appendChild(tr);
  });

  document.getElementById('schedule-days-summary').textContent = `${state.trainingDays} Active Sessions / ${7 - state.trainingDays} Recovery Days`;

  // 4. 4-Week Mesocycle
  const w1 = Math.round(targetVal * 0.93);
  const w2 = targetVal;
  const w3 = Math.round(targetVal * 1.08);
  const w4 = Math.round(targetVal * 0.74);

  document.getElementById('meso-w1').textContent = `${w1} ${unitLabel.toLowerCase()}`;
  document.getElementById('meso-w2').textContent = `${w2} ${unitLabel.toLowerCase()}`;
  document.getElementById('meso-w3').textContent = `${w3} ${unitLabel.toLowerCase()}`;
  document.getElementById('meso-w4').textContent = `${w4} ${unitLabel.toLowerCase()}`;

  // 5. Update PDF Header values
  document.getElementById('print-athlete-name').textContent = state.athleteName || 'Jane Doe';
  document.getElementById('print-target').textContent = selectTargetEvent.options[selectTargetEvent.selectedIndex].text;
  document.getElementById('print-date').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  document.getElementById('print-dist').textContent = `${state.balkeDistanceMeters.toLocaleString()} m (15 min)`;
  document.getElementById('print-vo2').textContent = `${vo2.toFixed(1)} ml/kg/min`;
  document.getElementById('print-tier').textContent = tier.label;
  document.getElementById('print-vol').textContent = `${targetVal} ${unitLabel.toLowerCase()} / week`;
}

// Input Event Listeners
inputDistance.addEventListener('input', (e) => {
  let val = parseFloat(e.target.value);
  if (isNaN(val) || val <= 0) val = 1200;
  state.balkeDistanceMeters = val;
  renderApp();
});

selectRunnerLevel.addEventListener('change', (e) => {
  state.runnerLevel = e.target.value;
  renderApp();
});

selectTargetEvent.addEventListener('change', (e) => {
  state.targetEvent = e.target.value;
  renderApp();
});

inputDays.addEventListener('input', (e) => {
  const days = parseInt(e.target.value);
  state.trainingDays = days;
  daysDisplay.textContent = `${days} Days`;
  renderApp();
});

intensitySlider.addEventListener('input', (e) => {
  const pct = parseInt(e.target.value);
  state.intensityModifier = pct / 100;
  intensityPercentLabel.textContent = `${pct}% ${pct === 100 ? '(Target)' : (pct < 100 ? '(Conservative)' : '(Aggressive)')}`;
  renderApp();
});

athleteNameInput.addEventListener('input', (e) => {
  state.athleteName = e.target.value;
  document.getElementById('print-athlete-name').textContent = state.athleteName;
});

targetDateInput.addEventListener('input', (e) => {
  state.targetDate = e.target.value;
});

// Unit Toggles
btnUnitKm.addEventListener('click', () => {
  if (state.unit === 'km') return;
  state.unit = 'km';
  btnUnitKm.className = 'px-3 py-1 rounded font-medium transition-all bg-magenta-600 text-white shadow-sm';
  btnUnitMi.className = 'px-3 py-1 rounded font-medium transition-all text-gray-400 hover:text-white';
  renderApp();
  showToast('Switched to Kilometers (KM)');
});

btnUnitMi.addEventListener('click', () => {
  if (state.unit === 'mi') return;
  state.unit = 'mi';
  btnUnitMi.className = 'px-3 py-1 rounded font-medium transition-all bg-magenta-600 text-white shadow-sm';
  btnUnitKm.className = 'px-3 py-1 rounded font-medium transition-all text-gray-400 hover:text-white';
  renderApp();
  showToast('Switched to Miles (MI)');
});

// Track Helper Events
btnTrackHelper.addEventListener('click', () => {
  trackHelperPanel.classList.toggle('hidden');
});

btnCloseHelper.addEventListener('click', () => {
  trackHelperPanel.classList.add('hidden');
});

btnApplyLaps.addEventListener('click', () => {
  const laps = parseInt(inputLaps.value) || 0;
  const extra = parseInt(inputExtraMeters.value) || 0;
  const total = (laps * 400) + extra;
  if (total >= 1000) {
    state.balkeDistanceMeters = total;
    inputDistance.value = total;
    trackHelperPanel.classList.add('hidden');
    renderApp();
    showToast(`Calculated: ${laps} laps + ${extra}m = ${total}m`);
  }
});

// Modal Events
btnExportPdf.addEventListener('click', () => {
  // Sync modal summary info
  const vo2 = calculateBalkeVO2(state.balkeDistanceMeters);
  const targetVol = document.getElementById('target-mileage').textContent;
  const unitLabel = state.unit === 'mi' ? 'miles' : 'km';

  modalAthleteName.textContent = state.athleteName || 'Jane Doe';
  modalVo2.textContent = `${vo2.toFixed(1)} ml/kg/min`;
  modalVolume.textContent = `${targetVol} ${unitLabel} / week`;

  pdfModal.classList.remove('hidden');
});

btnClosePdfModal.addEventListener('click', () => {
  pdfModal.classList.add('hidden');
});

pdfModal.addEventListener('click', (e) => {
  if (e.target === pdfModal) pdfModal.classList.add('hidden');
});

btnDirectDownloadPdf.addEventListener('click', () => {
  triggerDirectPDFDownload();
});

btnTriggerPrint.addEventListener('click', () => {
  pdfModal.classList.add('hidden');
  showToast('Opening print dialog...');
  setTimeout(() => {
    triggerReportPrint().catch(() => {
      showToast('Browser blocked print dialog. Use Direct Download button instead.');
    });
  }, 200);
});

btnOpenPrintTab.addEventListener('click', () => {
  pdfModal.classList.add('hidden');
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(generateCleanReportHTML());
    win.document.close();
    win.focus();
    showToast('Opened printable report in new tab.');
  } else {
    showToast('Popup was blocked by browser. Please use Direct Download.');
  }
});

// Initial render on load
window.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
