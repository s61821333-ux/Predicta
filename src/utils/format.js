const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
]

export function formatCurrency(amount, { signed = false, type } = {}) {
  const n = Math.abs(Number(amount) || 0)
  const formatted = n.toLocaleString('he-IL', { maximumFractionDigits: 0 })
  const prefix = signed
    ? (type === 'income' || amount > 0 ? '+' : '-')
    : ''
  return `${prefix}₪${formatted}`
}

export function formatTxnAmount(amount, type) {
  const sign = type === 'income' ? '+' : '-'
  return `${sign}₪${Math.abs(Number(amount)).toLocaleString('he-IL')}`
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

export function formatDateFull(dateStr) {
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function getHebrewMonthName(monthIndex) {
  return HEBREW_MONTHS[monthIndex] ?? ''
}

export function getGreeting(firstName) {
  const hour = new Date().getHours()
  const time =
    hour < 12 ? 'בוקר טוב' : hour < 17 ? 'צהריים טובים' : hour < 21 ? 'ערב טוב' : 'לילה טוב'
  return firstName ? `${time}, ${firstName}` : time
}

export function getCurrentMonthYear() {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export { HEBREW_MONTHS }
