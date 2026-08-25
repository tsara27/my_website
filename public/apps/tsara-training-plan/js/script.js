fetch("/apps/tsara-training-plan/data.json")
  .then(r => r.json())
  .then(DAYS => renderDays(DAYS));

const COLORS = {
  easy: "var(--easy)", hard: "var(--hard)", long: "var(--long)",
  lower: "var(--lower)", upper: "var(--upper)", rest: "var(--rest)"
};

function dial(rpe, color){
  if(rpe === 0){
    return `<div class="dial"><svg width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r="13" fill="none" stroke="#262b37" stroke-width="3"/>
    </svg><div class="dial-label">—</div></div>`;
  }
  const r = 13, c = 2*Math.PI*r;
  const frac = rpe/10;
  const offset = c * (1-frac);
  return `<div class="dial">
    <svg width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r="${r}" fill="none" stroke="#262b37" stroke-width="3"/>
      <circle cx="17" cy="17" r="${r}" fill="none" stroke="${color}" stroke-width="3"
        stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}"
        transform="rotate(-90 17 17)"/>
      <text x="17" y="20" text-anchor="middle" font-family="IBM Plex Mono, monospace"
        font-size="10.5" fill="var(--ink)" font-weight="600">${rpe}</text>
    </svg>
    <div class="dial-label">RPE</div>
  </div>`;
}

function chev(){
  return `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
}

function bodyContent(d){
  let html = "";
  if(d.note){
    html += `<div class="note">${d.note}</div>`;
  }
  if(d.rows){
    html += `<table><thead><tr><th>Movement</th><th style="text-align:right">Sets × Reps</th><th style="text-align:right">RPE</th></tr></thead><tbody>`;
    d.rows.forEach(r => {
      html += `<tr><td class="mv">${r[0]}</td><td class="sr">${r[1]}</td><td class="rpe">${r[2]}</td></tr>`;
    });
    html += `</tbody></table>`;
  }
  if(d.extra === "run"){
    html += `<div class="run-detail" style="${d.rows ? 'margin-top:14px; padding-top:14px; border-top:1px solid var(--card-border);' : ''}">${d.runText}</div>`;
  }
  if(d.type === "rest"){
    html += `<div class="rest-detail">${d.restText}</div>`;
  }
  return html;
}

function renderDays(DAYS) {
  const container = document.getElementById("days");
  DAYS.forEach((d, i) => {
    const color = COLORS[d.type];
    const el = document.createElement("div");
    el.className = "day";
    el.dataset.open = "false";
    el.innerHTML = `
      <div class="day-head" role="button" tabindex="0">
        <div class="bar" style="background:${color}"></div>
        <div class="day-main">
          <div class="day-date">${d.day}</div>
          <div class="day-title">${d.title}</div>
          <div class="day-tag">${d.tag}</div>
        </div>
        ${dial(d.rpe, color)}
        ${chev()}
      </div>
      <div class="day-body"><div class="day-body-inner">${bodyContent(d)}</div></div>
    `;
    const head = el.querySelector(".day-head");
    function toggle(){
      const open = el.dataset.open === "true";
      el.dataset.open = open ? "false" : "true";
    }
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", (e) => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); toggle(); } });
    container.appendChild(el);
  });
}
