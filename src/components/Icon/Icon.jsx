const PATHS = {
  home:      <><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/><path d="M10 20v-5h4v5"/></>,
  search:    <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></>,
  profile:   <><circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></>,
  add:       <><path d="M12 6v12M6 12h12"/></>,
  gear:      <><circle cx="12" cy="12" r="3.2"/><path d="M12 2.6v2.4M12 19v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.6 12H5M19 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></>,
  bell:      <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
  chevron:   <path d="M14 6 8 12l6 6"/>,
  chevronL:  <path d="M10 6l6 6-6 6"/>,
  chevronDown: <path d="M6 10l6 6 6-6"/>,
  close:     <path d="M6 6l12 12M18 6 6 18"/>,
  check:     <path d="M5 12.5 10 17l9-10"/>,
  trash:     <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/><path d="M10 11v6M14 11v6"/></>,
  copy:      <><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></>,
  refresh:   <><path d="M20 11a8 8 0 1 0-1.9 6.3"/><path d="M20 5v6h-6"/></>,
  calendar:  <><rect x="4" y="5" width="16" height="16" rx="3"/><path d="M4 9h16M8 3v4M16 3v4"/></>,
  edit:      <><path d="M5 19h14"/><path d="M16 4.5 19.5 8 9 18.5 5 19.5 6 15.5 16 4.5Z"/></>,
  camera:    <><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.4"/></>,
  lock:      <><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  send:      <path d="M5 12 20 5l-5 15-3.5-6.5L5 12Z"/>,
  arrowUp:   <path d="M12 19V6M6 11l6-6 6 6"/>,
  arrowDown: <path d="M12 5v13M6 12l6 6 6-6"/>,
  eye:       <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></>,
  star:      <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8 6.8 19.5l1-5.8L3.6 9.6l5.8-.8L12 3.5Z"/>,
  users:     <><circle cx="9" cy="8" r="3.4"/><path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><path d="M16 5.2a3.3 3.3 0 0 1 0 6.4M17.5 14.7c2.2.6 3.8 2.4 3.8 5"/></>,
  filter:    <path d="M4 5h16l-6.5 8v5l-3 1.5V13L4 5Z"/>,
  logout:    <><path d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7"/><path d="M16 8l4 4-4 4M20 12H10"/></>,
  spark:     <path d="M12 3l1.6 5.6L19 10l-5.4 1.4L12 17l-1.6-5.6L5 10l5.4-1.4L12 3Z"/>,
  send2:     <><path d="M5.5 12h13"/><path d="M13 6.5 18.5 12 13 17.5"/></>,
  wallet:    <><rect x="3.5" y="6" width="17" height="13" rx="3"/><path d="M3.5 9.5h17"/><circle cx="16.5" cy="13" r="1.3" fill="currentColor" stroke="none"/></>,
  trend:     <><path d="M4 16l5-5 3.5 3.5L20 7"/><path d="M20 12V7h-5"/></>,
  food:      <><path d="M7 3v7a3 3 0 0 0 3 3v8M7 3v4M9 3v4"/><path d="M16 3c-1.6 0-2.5 2-2.5 5s.9 4 2.5 4v8"/></>,
  car:       <><path d="M4 14l1.6-4.2A2 2 0 0 1 7.5 8.5h9a2 2 0 0 1 1.9 1.3L20 14"/><path d="M3.5 14h17v3a1 1 0 0 1-1 1H18a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-3Z"/><path d="M6.5 16h.01M17.5 16h.01"/></>,
  bag:       <><path d="M6 8h12l-1 11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 8Z"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9"/></>,
  health:    <path d="M12 20S4 14.5 4 8.8A4.3 4.3 0 0 1 12 6.5 4.3 4.3 0 0 1 20 8.8C20 14.5 12 20 12 20Z"/>,
  fun:       <><path d="M5 21l3.5-9.5"/><path d="M14 4.5c2.5 0 4.5 4 4.5 8s-2 6.5-7 6.5L8 11.5C8 7 11.5 4.5 14 4.5Z"/><path d="M13 3.5l1 1.5M17.5 5l-1 1.5M19.5 9l-1.6.4"/></>,
  bills:     <><path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4V3.5Z"/><path d="M9 8h6M9 11.5h6M9 15h3"/></>,
  school:    <><path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z"/><path d="M6 11v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V11"/><path d="M21.5 8.5v5"/></>,
  clothes:   <path d="M9 4l3 2 3-2 5 3.5-2.5 3L15 13v7H9v-7L6.5 10.5 4 7.5 9 4Z"/>,
  homecat:   <><path d="M4 11 12 4l8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/></>,
  salary:    <><rect x="3" y="6.5" width="18" height="11" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5h.01M17.5 14.5h.01"/></>,
  freelance: <><rect x="3.5" y="7.5" width="17" height="12" rx="2.5"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5"/><path d="M3.5 12.5h17"/></>,
  gift:      <><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18v3.5H3zM12 9v11"/><path d="M12 9S10.5 4.5 8 5s.5 4 4 4ZM12 9s1.5-4.5 4-4-.5 4-4 4Z"/></>,
  refund:    <><path d="M20 11a8 8 0 1 0-2 6"/><path d="M20 5v6h-6"/><path d="M12 8v4l2.5 1.5"/></>,
  savings:   <><path d="M4 13a6 6 0 0 1 6-6h2.5c3 0 5.5 2 6 5l1.5.6V16l-2 .3a6 6 0 0 1-2 2.2V21h-3v-1.5h-3V21H7v-2a6 6 0 0 1-3-5.2Z"/><path d="M9 7.5C9 5.5 11 5 12 5M15.5 12h.01"/></>,
  other:     <><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>,
}

export default function Icon({ name, size = 22, sw = 1.9, style }) {
  const d = PATHS[name] || PATHS.other
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {d}
    </svg>
  )
}
