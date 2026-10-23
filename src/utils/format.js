const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
export const formatEuro = (cents) => euro.format((cents || 0) / 100)
export const formatDate = (d) =>
  d ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(d) : '—'
// "12,50" or "12.5" -> 1250 (cents). Returns null if invalid.
export const parsePriceToCents = (str) => {
  if (!/^\d+([.,]\d{1,2})?$/.test(String(str).trim())) return null
  return Math.round(parseFloat(String(str).replace(',', '.')) * 100)
}
export const isValidUrl = (str) => {
  try { const u = new URL(str); return ['http:', 'https:'].includes(u.protocol) } catch { return false }
}
