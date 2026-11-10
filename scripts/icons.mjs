/**
 * Zentrale Icon-Sammlung.
 *
 * Alle Icons sind auf ein 24 × 24-Raster gezeichnet, nutzen `currentColor`
 * und werden als Inline-SVG ausgegeben. So bleiben sie scharf, lassen sich
 * per CSS einfärben und verursachen keine zusätzlichen Requests.
 */
const paths = {
  mountain:
    '<path d="M3 19h18L14.5 7.5 10 14l-2.5-3.5L3 19Z"/><path d="m12.4 10.8 2.1 3.2"/>',
  cow:
    '<path d="M6 8.5 3.5 6.8v3.6M18 8.5l2.5-1.7v3.6"/><path d="M6 8.5c0-2 2.7-3.5 6-3.5s6 1.5 6 3.5v3.2c0 4.3-2.7 7.3-6 7.3s-6-3-6-7.3V8.5Z"/><path d="M9.5 11.2h.01M14.5 11.2h.01"/><path d="M10.2 15.2c1.2.8 2.4.8 3.6 0"/>',
  basket:
    '<path d="M4 10h16l-1.6 8.5a2 2 0 0 1-2 1.5H7.6a2 2 0 0 1-2-1.5L4 10Z"/><path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3"/><path d="M8 14h.01M12 14h.01M16 14h.01"/>',
  kids:
    '<path d="m12 3 6 6-6 6-6-6 6-6Z"/><path d="M12 15v3"/><path d="M12 18c0 2-2 2-2 3"/>',
  hiking:
    '<circle cx="13" cy="4.5" r="1.5"/><path d="m10 21 2-5 2 2v3"/><path d="m8 12 2-3 3-1 3 3 2 1"/><path d="m8 12-2 5"/><path d="M3 21h4"/>',
  wifi:
    '<path d="M4 9a13 13 0 0 1 16 0"/><path d="M7 12.5a8.5 8.5 0 0 1 10 0"/><path d="M10 16a4 4 0 0 1 4 0"/><circle cx="12" cy="19" r=".8" fill="currentColor" stroke="none"/>',
  pin:
    '<path d="M20 10c0 5.5-8 11-8 11s-8-5.5-8-11a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  phone:
    '<path d="M6.6 3h3l1.5 4-2 1.5a12 12 0 0 0 5.4 5.4l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3Z"/>',
  mail:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  star:
    '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
  arrow: '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
  check: '<path d="m4 12.5 5 5L20 6.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  bed:
    '<path d="M3 19v-7h18v7"/><path d="M3 19v2M21 19v2"/><path d="M6 12V8h5v4"/><path d="M11 12h10"/>',
  bath:
    '<path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z"/><path d="M7 12V6a2 2 0 0 1 4 0"/><path d="m7 19-1 2M17 19l1 2"/>',
  kitchen:
    '<path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6Z"/><path d="M4 10 2.5 8M20 10l1.5-2"/><path d="M8 6.5c0-1 1-1 1-2M12 6.5c0-1 1-1 1-2"/>',
  balcony:
    '<circle cx="7" cy="6" r="2.5"/><path d="M7 1v1M2 6h1M3.5 2.5l.7.7"/><path d="M11 20v-8h9v8"/><path d="M11 15h9M13 12v8M16 12v8M19 12v8"/>',
  parking:
    '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5"/>',
  laundry:
    '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 7h.01"/>',
  paw:
    '<circle cx="7" cy="9" r="1.6"/><circle cx="12" cy="7" r="1.6"/><circle cx="17" cy="9" r="1.6"/><path d="M12 11c-3 0-5 2.2-5 4.3 0 1.6 1.3 2.7 2.8 2.7 1 0 1.5-.4 2.2-.4s1.2.4 2.2.4c1.5 0 2.8-1.1 2.8-2.7C17 13.2 15 11 12 11Z"/>',
  sauna:
    '<path d="M8 4c-2 3 2 3.5 0 6.5M12 4c-2 3 2 3.5 0 6.5M16 4c-2 3 2 3.5 0 6.5"/><path d="M4 20h16"/><path d="M6 12h12v4H6z"/>',
  leaf:
    '<path d="M20 4C10 4 4 8 4 14a6 6 0 0 0 6 6c6 0 10-6 10-16Z"/><path d="M4 20c2-6 7-9 12-11"/>',
  sun:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/>',
  snow:
    '<path d="M12 2v20M4 6l16 12M20 6 4 18"/><path d="m9.5 3.5 2.5 2 2.5-2M9.5 20.5l2.5-2 2.5 2"/>',
  house:
    '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  heart:
    '<path d="M12 20s-8-4.9-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.1-8 10-8 10Z"/>',
  users:
    '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><path d="M16 5.5a3 3 0 0 1 0 5.5M17 15c2.3.5 4 2.3 4 5"/>',
  ruler:
    '<path d="m3 15 12-12 6 6-12 12H3v-6Z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  chat:
    '<path d="M21 12a9 9 0 1 1-4.5-7.8L21 3l-1.2 4.5A9 9 0 0 1 21 12Z"/><path d="M8.5 8.5c.5 3 2.5 5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-1.5-1-2-2l1-1-1-2-1.5 1Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
};

export function iconSvg(name, className = "") {
  const body = paths[name];
  if (!body) {
    console.warn(`[icons] Unbekanntes Icon: ${name}`);
    return "";
  }
  return `<svg class="icon${className ? ` ${className}` : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

export const iconNames = Object.keys(paths);
