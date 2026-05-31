/* ============================================================
   PREDICTA — Brand assets: logo generator + icon set
   ============================================================ */
(function () {
  let uid = 0;

  function mark(opts) {
    const s = opts.size || 40;
    const id = 'pg' + (uid++);
    // monochrome / flat line version
    if (opts.flat) {
      const c = opts.flat;
      return `<svg class="pr-mark" width="${s}" height="${s}" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="4.2" y="4.2" width="39.6" height="39.6" rx="12.5" fill="none" stroke="${c}" stroke-width="2.4"/>
        <path d="M18.5 35 L18.5 15 L27 15 A6 6 0 0 1 27 27 L18.5 27" stroke="${c}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="33.2" cy="14.6" r="2.7" fill="${c}"/>
      </svg>`;
    }
    // full color medallion
    return `<svg class="pr-mark" width="${s}" height="${s}" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="${id}a" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3B7DFF"/><stop offset="1" stop-color="#1B3F9E"/>
        </linearGradient>
        <linearGradient id="${id}b" x1="8" y1="5" x2="26" y2="30" gradientUnits="userSpaceOnUse">
          <stop stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="${id}c" cx="0.5" cy="0.5" r="0.5">
          <stop stop-color="#9BE7FF"/><stop offset="1" stop-color="#38BDF8"/>
        </radialGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="14" fill="url(#${id}a)"/>
      <rect x="3" y="3" width="42" height="42" rx="14" fill="url(#${id}b)"/>
      <rect x="3.7" y="3.7" width="40.6" height="40.6" rx="13.3" fill="none" stroke="#fff" stroke-opacity=".28"/>
      <path d="M18.5 35 L18.5 15 L27 15 A6 6 0 0 1 27 27 L18.5 27" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="33.2" cy="14.6" r="3.1" fill="url(#${id}c)"/>
      <circle cx="33.2" cy="14.6" r="3.1" fill="none" stroke="#fff" stroke-opacity=".6"/>
    </svg>`;
  }

  function logo(opts) {
    opts = opts || {};
    const m = mark(opts);
    if (!opts.word) return `<span class="pr-logo" style="display:inline-flex">${m}</span>`;
    const size = (opts.wordSize || (opts.size ? opts.size * 0.62 : 22));
    const inkStyle = opts.ink ? `color:${opts.ink}` : '';
    const accent = opts.ink ? `style="color:${opts.ink};opacity:.85"` : '';
    const wc = opts.wordClass ? ' ' + opts.wordClass : '';
    return `<span class="pr-logo${wc}" style="display:inline-flex">${m}<span class="pr-word" style="font-size:${size}px;${inkStyle}">Predict<b ${accent}>a</b></span></span>`;
  }

  /* ---- Line icon library (2px, rounded) ---- */
  const I = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/>',
    add: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    ai: '<path d="M12 3a4 4 0 0 1 4 4v1a3 3 0 0 1 1 5.8V16a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-2.2A3 3 0 0 1 8 8V7a4 4 0 0 1 4-4z"/><path d="M9 10h.01M15 10h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="17" cy="14" r="1.4"/>',
    chart: '<path d="M4 19V5M4 19h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    forecast: '<path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v5h-5"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5a7 7 0 0 0 .1-1z"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 9h18M8 3v4M16 3v4"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    coffee: '<path d="M5 8h12v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M17 9h2a2 2 0 0 1 0 4h-2"/><path d="M8 3v2M12 3v2"/>',
    bag: '<path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    arrowDown: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8 7l1.5-2h5L16 7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
    moon: '<path d="M21 12.8A8 8 0 1 1 11.2 3a6 6 0 0 0 9.8 9.8z"/>',
    sparkle: '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>'
  };

  function icon(name, size, sw) {
    size = size || 22; sw = sw || 2;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[name] || ''}</svg>`;
  }

  function iconShowcase() {
    const names = ['home','add','search','ai','user','wallet','chart','forecast','target','calendar','bell','shield','coffee','bag','send','settings'];
    const labels = {home:'בית',add:'הוספה',search:'חיפוש',ai:'AI',user:'פרופיל',wallet:'ארנק',chart:'ניתוח',forecast:'תחזית',target:'יעד',calendar:'תאריך',bell:'התראה',shield:'אבטחה',coffee:'אוכל',bag:'קניות',send:'שליחה',settings:'הגדרות'};
    return names.map(n => `<div class="ico-cell">${icon(n,26)}<span>${labels[n]}</span></div>`).join('');
  }

  window.PredictaBrand = { logo, mark, icon, iconShowcase, icons: I };
})();
