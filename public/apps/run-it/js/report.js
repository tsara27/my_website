// Helper: Build standalone clean HTML document for printing or new tab
function generateCleanReportHTML() {
  const isMiles = state.unit === 'mi';
  const unitLabel = isMiles ? 'miles' : 'km';
  const paceUnit = isMiles ? 'min/mi' : 'min/km';
  const vo2 = calculateBalkeVO2(state.balkeDistanceMeters);
  const tier = getFitnessTier(vo2);
  const mileage = calculateWeeklyMileage(vo2, state.runnerLevel, state.targetEvent, state.intensityModifier);
  const targetVol = isMiles ? Math.round(mileage.target * KM_TO_MILES) : mileage.target;
  const paces = calculatePaces(state.balkeDistanceMeters);
  const schedule = generateWeeklySchedule(targetVol, state.trainingDays, unitLabel);

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>RunIT - ${state.athleteName || 'Athlete'} Training Program</title>
    <style>${REPORT_CSS}</style>
  </head>
  <body class="report-root">
    <div class="header">
      <div>
        <div class="title">RUN<span>IT</span> &bull; TRAINING PRESCRIPTION</div>
        <div class="sub">Scientific Aerobic Periodization Engine &bull; Dr. Bruno Balke 15-Minute Protocol</div>
      </div>
      <div style="text-align: right; font-size: 11px;">
        <div><strong>Athlete:</strong> ${state.athleteName || 'Jane Doe'}</div>
        <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
        <div><strong>Target Focus:</strong> ${selectTargetEvent.options[selectTargetEvent.selectedIndex].text}</div>
      </div>
    </div>

    <div class="grid-4">
      <div class="card">
        <div class="card-title">15-Min Distance</div>
        <div class="card-val">${state.balkeDistanceMeters.toLocaleString()} m</div>
      </div>
      <div class="card">
        <div class="card-title">Estimated VO₂ Max</div>
        <div class="card-val accent">${vo2.toFixed(1)} <small style="font-size:10px;">ml/kg</small></div>
      </div>
      <div class="card">
        <div class="card-title">Fitness Rating</div>
        <div class="card-val">${tier.label}</div>
      </div>
      <div class="card">
        <div class="card-title">Weekly Mileage</div>
        <div class="card-val accent">${targetVol} ${unitLabel}/wk</div>
      </div>
    </div>

    <h3 style="font-size: 14px; margin: 16px 0 8px 0; color: #111;">Prescribed Training Paces (${paceUnit})</h3>
    <div class="grid-4">
      <div class="card">
        <div class="card-title">Easy / Recovery</div>
        <div class="card-val">${formatPace(paces.easy[0], isMiles)} - ${formatPace(paces.easy[1], isMiles)}</div>
      </div>
      <div class="card">
        <div class="card-title">Marathon / Aerobic</div>
        <div class="card-val">${formatPace(paces.marathon[0], isMiles)} - ${formatPace(paces.marathon[1], isMiles)}</div>
      </div>
      <div class="card">
        <div class="card-title">Lactate Threshold</div>
        <div class="card-val">${formatPace(paces.threshold[0], isMiles)} - ${formatPace(paces.threshold[1], isMiles)}</div>
      </div>
      <div class="card">
        <div class="card-title">VO₂ Max Intervals</div>
        <div class="card-val accent">${formatPace(paces.interval[0], isMiles)} - ${formatPace(paces.interval[1], isMiles)}</div>
      </div>
    </div>

    <h3 style="font-size: 14px; margin: 18px 0 8px 0; color: #111;">7-Day Microcycle Schedule</h3>
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Day</th>
          <th style="width: 45%;">Session Description</th>
          <th style="width: 20%;">Focus</th>
          <th style="width: 20%; text-align: right;">Target Distance</th>
        </tr>
      </thead>
      <tbody>
        ${schedule.map(s => `
          <tr>
            <td><strong>${s.day}</strong></td>
            <td><strong>${s.name}</strong><br><span style="color:#6b7280; font-size:11px;">${s.desc}</span></td>
            <td><span class="badge">${s.type}</span></td>
            <td style="text-align: right; font-family: monospace; font-weight: bold; color: ${s.type === 'Rest' ? '#9ca3af' : '#be185d'};">${s.distanceFormatted}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="footer">
      <div>RunIT &copy; 2026 &bull; Physiology Diagnostic & Training Engine</div>
      <div>Page 1 of 1</div>
    </div>
  </body>
  </html>`;
}

// Render the standalone report (same document as print.html) in a hidden iframe.
function createReportFrame() {
  return new Promise(resolve => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;left:0;top:0;width:794px;height:1123px;border:0;z-index:-1;background:#fff;';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    doc.open();
    doc.write(generateCleanReportHTML());
    doc.close();
    setTimeout(() => resolve(iframe), 200);
  });
}

// Load html2pdf inside the iframe so the report is captured with its own styles.
function loadHtml2PdfInto(iframe) {
  return new Promise((resolve, reject) => {
    const win = iframe.contentWindow;
    if (win.html2pdf) return resolve(win.html2pdf);
    const script = iframe.contentDocument.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve(win.html2pdf);
    script.onerror = reject;
    iframe.contentDocument.head.appendChild(script);
  });
}

// Browser print dialog using the standalone report layout
async function triggerReportPrint() {
  const iframe = await createReportFrame();
  const win = iframe.contentWindow;
  win.onafterprint = () => iframe.remove();
  win.focus();
  win.print();
}

// Direct PDF download: open the report in a new tab (print layout) and generate the PDF from that tab.
function triggerDirectPDFDownload() {
  // Must open synchronously inside the click handler or popup blockers will stop it.
  const tab = window.open('', '_blank');
  if (!tab) {
    showToast('Popup blocked. Allow popups for this site and try again.');
    return;
  }

  const athleteSlug = (state.athleteName || 'Athlete').replace(/\s+/g, '_');
  const filename = `RunIT_${athleteSlug}_Training_Plan.pdf`;

  let html = generateCleanReportHTML();
  const extras = `
    <style>
      .report-root { max-width: 794px; margin: 20px auto; }
      .toolbar { position: sticky; top: 0; background: #111827; color: #fff; padding: 10px 16px; display: flex; gap: 8px; align-items: center; font: 13px sans-serif; }
      .toolbar button { background: #e11488; color: #fff; border: 0; border-radius: 6px; padding: 6px 12px; font-weight: 600; cursor: pointer; }
      @media print { .toolbar { display: none; } .report-root { margin: 0; max-width: none; } }
    </style>
    <div class="toolbar" data-html2canvas-ignore="true">
      <span id="status">Preparing PDF...</span>
      <button id="dl">Download PDF</button>
      <button onclick="window.print()">Print</button>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>
    <script>
      const filename = ${JSON.stringify(filename)};
      const status = document.getElementById('status');
      async function download() {
        status.textContent = 'Generating PDF...';
        try {
          const el = document.querySelector('.report-root');
          await html2pdf().set({
            margin: [10, 10, 10, 10],
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          }).from(el).save();
          status.textContent = 'Downloaded ' + filename;
        } catch (e) {
          console.error(e);
          status.textContent = 'Download failed. Use Print > Save as PDF.';
        }
      }
      document.getElementById('dl').addEventListener('click', download);
      window.addEventListener('load', () => setTimeout(download, 300));
    <\/script>`;
  html = html.replace('<body class="report-root">', '<body>' + extras + '<div class="report-root">').replace('</body>', '</div></body>');

  tab.document.open();
  tab.document.write(html);
  tab.document.close();

  pdfModal.classList.add('hidden');
  showToast('Report opened in a new tab.');
}
