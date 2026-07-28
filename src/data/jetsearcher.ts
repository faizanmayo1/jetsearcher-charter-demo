/* ------------------------------------------------------------------ *
 * Shared constants and formatters.
 *
 * PROVENANCE. Two kinds of fact appear in this demo and they are kept
 * apart on purpose.
 *
 *  PUBLISHED   how JetSearcher describes itself on its own site, and the
 *  named industry standards a broker actually works to. Collected here so
 *  it can be checked in one place.
 *
 *  ILLUSTRATIVE   the mission, the operators, the aircraft, the clients,
 *  the prices. Invented for the demonstration. Every operator name below
 *  is fictitious: naming a real charter operator next to an invented
 *  safety finding would be indefensible, so we do not do it.
 * ------------------------------------------------------------------ */

export const CLIENT = {
  company: 'JetSearcher',
  legal: 'JetSearcher Ltd',
  principal: 'Johann Pillai',
  principalTitle: 'Managing Director',
  initials: 'JP',
  ai: 'Vector',
  base: 'London',
  today: 'Wednesday 29 July 2026',
  todayShort: '29 Jul 2026',
  now: '06:16',
}

/* PUBLISHED. How JetSearcher describes its own business. */
export const PUBLISHED = {
  founded: 2005,
  yearsBroking: '20+',
  missions: 'thousands of',
  model: 'Whole-of-market broker. No owned fleet.',
  optionsPromised: 3,
  services: ['Private jet charter', 'Air ambulance', 'Experiences'],
  safetyRatings: ['ARGUS', 'Wyvern'],
  medicalStandards: ['EURAMI', 'CAMTS'],
  promise: 'Up to three strong options, all-in pricing, e-sign confirmation, 24/7 support.',
}

/* PUBLISHED market reference. Air ambulance repatriation from Türkiye to the
   UK is quoted publicly at USD 46,000 to 120,000, and Middle East to UK at
   GBP 40,000 to 100,000. The hero quote is shown against this band on screen
   so a reviewer can see where it sits rather than taking it on trust. */
export const MARKET_BAND = {
  low: 40000,
  high: 100000,
  note: 'Published range for air ambulance repatriation from Türkiye to the UK. A ventilated ICU transfer on a light jet sits in the lower half of it.',
}

/* The vetting vocabulary a broker genuinely works with. These are real
   industry programmes; the ratings attached to operators in this demo are
   illustrative. */
export const STANDARDS = {
  argus: {
    name: 'ARGUS',
    levels: ['Platinum', 'Gold Plus', 'Gold'],
    note: 'Historical review of operator, aircraft and pilot records, plus an on-site safety audit at the Platinum level.',
  },
  wyvern: {
    name: 'Wyvern Wingman',
    levels: ['Wingman'],
    note: 'Requires a physical audit at the operator base. Remote certification is not accepted.',
  },
  eurami: {
    name: 'EURAMI',
    levels: ['Accredited'],
    note: 'European aeromedical accreditation. Minimum two years trading and 250 medical flights before a first audit. Valid three years.',
  },
  camts: {
    name: 'CAMTS',
    levels: ['Accredited'],
    note: 'Medical transport accreditation covering crew, equipment and patient care standards.',
  },
}

/* ------------------------------------------------------------------ *
 * Formatters. Every one of these pairs with the .tnum class on screen.
 * JetSearcher is a London house, so the book currency is sterling.
 * ------------------------------------------------------------------ */

export const gbp = (n: number) =>
  `£${Math.round(n).toLocaleString('en-GB')}`

export const gbpExact = (n: number) =>
  `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function gbpCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `£${Math.round(n / 1_000)}K`
  return `£${Math.round(n)}`
}

export const num = (n: number) => n.toLocaleString('en-GB')

export const pct = (n: number, dp = 1) => `${n.toFixed(dp)}%`

/* Flight and duty times are spoken as hours and minutes, never as decimals.
   A broker says "three forty", not "3.67 hours". */
export function hhmm(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60)
  const m = Math.round(totalMinutes % 60)
  /* Under an hour a broker just says "four minutes", never "0h 04m". */
  if (h === 0) return `${m}m`
  return `${h}h ${m.toString().padStart(2, '0')}m`
}

/* Elapsed time on an unquoted request, for the desk clock */
export function elapsed(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  return `${Math.floor(minutes / 60)}h ${(minutes % 60).toString().padStart(2, '0')}m`
}
