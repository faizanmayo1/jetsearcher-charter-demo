/* ------------------------------------------------------------------ *
 * Client intelligence. ILLUSTRATIVE, all names invented.
 *
 * A broker's real asset is not the aircraft, which anyone can source. It
 * is knowing that this family office will not fly without a full galley,
 * and that this assistance company needs the invoice split by policy
 * before it can authorise. That knowledge usually lives in one person's
 * head, and walks out of the door with them.
 * ------------------------------------------------------------------ */

export type Segment = 'Assistance company' | 'Family office' | 'Corporate' | 'Private client' | 'Logistics'

export interface Preference {
  label: string
  detail: string
  /* Where this was learned, so it is never presented as a guess */
  source: string
}

export interface ClientRecord {
  id: string
  name: string
  segment: Segment
  since: number
  missions: number
  lifetimeValue: number
  winRate: number
  /* Average minutes JetSearcher takes to return options to them */
  avgQuoteMin: number
  contact: string
  contactRole: string
  preferences: Preference[]
  pattern?: string
  risk?: string
}

export const CLIENTS: ClientRecord[] = [
  {
    id: 'CL-01',
    name: 'Wexford Assistance',
    segment: 'Assistance company',
    since: 2018,
    missions: 64,
    lifetimeValue: 1_842_000,
    winRate: 71,
    avgQuoteMin: 38,
    contact: 'Marie Delacroix',
    contactRole: 'Senior case manager',
    preferences: [
      {
        label: 'EURAMI only, no exceptions',
        detail: 'Has declined two otherwise suitable aircraft on accreditation alone.',
        source: 'Case notes, Mar 2024 and Nov 2025',
      },
      {
        label: 'Invoice split by policy line',
        detail: 'Aircraft, medical crew and ground transfer itemised separately or it cannot be authorised.',
        source: 'Standing instruction on file',
      },
      {
        label: 'Direct where clinically possible',
        detail: 'Will accept a technical stop but wants it flagged in the first message, not discovered later.',
        source: 'Marie, by phone, Feb 2026',
      },
    ],
    pattern: 'Medical requests cluster Monday and Friday mornings and are almost always live within four hours.',
  },
  {
    id: 'CL-02',
    name: 'Halstead Family Office',
    segment: 'Family office',
    since: 2016,
    missions: 112,
    lifetimeValue: 3_960_000,
    winRate: 58,
    avgQuoteMin: 74,
    contact: 'Edward Halstead',
    contactRole: 'Principal',
    preferences: [
      {
        label: 'Full galley, always',
        detail: 'Declined two aircraft on catering capability. Do not present anything without one.',
        source: 'Declined quotes, Jan 2025 and Sep 2025',
      },
      { label: 'Two dogs travel', detail: 'Cabin, not hold. Operator must accept pets in cabin.', source: 'Every booking since 2019' },
      { label: 'Same crew where possible', detail: 'Has named a preferred captain twice.', source: 'Booking notes' },
    ],
    pattern: 'Books Geneva and Nice from Farnborough, rarely Luton. Peak is December and August.',
    risk: 'Win rate has slipped from 71% to 58% over two years while average quote time rose from 41 to 74 minutes.',
  },
  {
    id: 'CL-03',
    name: 'Veritas Life Sciences',
    segment: 'Logistics',
    since: 2021,
    missions: 29,
    lifetimeValue: 2_410_000,
    winRate: 83,
    avgQuoteMin: 62,
    contact: 'Dr Anya Kovac',
    contactRole: 'Head of clinical supply',
    preferences: [
      { label: 'Two to eight degrees, continuous', detail: 'Temperature logger data required with the proof of delivery.', source: 'Contract schedule' },
      { label: 'Named courier accompanies', detail: 'One seat always held for their own courier.', source: 'Every shipment' },
      { label: 'No technical stops', detail: 'Cold chain risk. Direct or it does not go.', source: 'Standing instruction' },
    ],
    pattern: 'Ships Basel to US east coast on a roughly six week cycle tied to trial milestones.',
  },
  {
    id: 'CL-04',
    name: 'Ardmore Capital',
    segment: 'Corporate',
    since: 2019,
    missions: 87,
    lifetimeValue: 1_530_000,
    winRate: 44,
    avgQuoteMin: 118,
    contact: 'Sasha Bright',
    contactRole: 'Executive assistant',
    preferences: [
      { label: 'Price first, then aircraft', detail: 'Consistently takes the cheapest compliant option.', source: 'Accepted quotes, 3 years' },
      { label: 'Wants three options', detail: 'Has asked for a third option on eleven occasions.', source: 'Email thread analysis' },
    ],
    pattern: 'Books late, usually inside 48 hours, and shops the same trip to two other brokers.',
    risk: 'Lowest win rate on the book and the slowest average quote. These two facts are probably the same fact.',
  },
  {
    id: 'CL-05',
    name: 'Northbridge Travel Insurance',
    segment: 'Assistance company',
    since: 2022,
    missions: 41,
    lifetimeValue: 968_000,
    winRate: 66,
    avgQuoteMin: 55,
    contact: 'Priya Raman',
    contactRole: 'Repatriation lead',
    preferences: [
      { label: 'Commercial escort considered first', detail: 'Will take a stretcher on a scheduled airline where the patient allows it.', source: 'Standing instruction' },
      { label: 'Cost cap by policy tier', detail: 'Ask which tier before sourcing. It changes the answer.', source: 'Priya, Apr 2026' },
    ],
    pattern: 'Volume rises sharply through the European summer, peaking late July and August.',
  },
  {
    id: 'CL-06',
    name: 'Mrs A. Lindqvist',
    segment: 'Private client',
    since: 2023,
    missions: 9,
    lifetimeValue: 742_000,
    winRate: 89,
    avgQuoteMin: 96,
    contact: 'Anneli Lindqvist',
    contactRole: 'Principal',
    preferences: [
      { label: 'Ground and villa arranged too', detail: 'Expects the whole itinerary, not just the flight.', source: 'Every booking' },
      { label: 'No early departures', detail: 'Nothing before 10:00.', source: 'Declined two itineraries' },
    ],
    pattern: 'One large leisure itinerary a year plus short European hops.',
  },
]

/* ------------------------------------------------------------------ *
 * Derived
 * ------------------------------------------------------------------ */

export const totalLifetimeValue = () => CLIENTS.reduce((a, c) => a + c.lifetimeValue, 0)

export const totalMissions = () => CLIENTS.reduce((a, c) => a + c.missions, 0)

export const atRiskClients = () => CLIENTS.filter((c) => c.risk)

export const heroClient = () => CLIENTS.find((c) => c.name === 'Wexford Assistance')!

/* The correlation worth putting in front of a managing director. Computed
   from the rows rather than asserted, so it cannot drift. */
export function speedVersusWin() {
  const rows = [...CLIENTS].sort((a, b) => a.avgQuoteMin - b.avgQuoteMin)
  const fastest = rows.slice(0, 3)
  const slowest = rows.slice(-3)
  const avg = (xs: ClientRecord[]) => Math.round(xs.reduce((a, c) => a + c.winRate, 0) / xs.length)
  return {
    fastestNames: fastest.map((c) => c.name),
    slowestNames: slowest.map((c) => c.name),
    fastestWin: avg(fastest),
    slowestWin: avg(slowest),
    fastestAvgMin: Math.round(fastest.reduce((a, c) => a + c.avgQuoteMin, 0) / fastest.length),
    slowestAvgMin: Math.round(slowest.reduce((a, c) => a + c.avgQuoteMin, 0) / slowest.length),
  }
}

/* Vector will not claim causation from six clients. It says so. */
export const CORRELATION_CAVEAT =
  'Six clients is not a sample that proves anything. The pattern is worth testing, not acting on as settled. The honest read is that faster quotes and higher win rates travel together on this book, and the direction of that relationship is a question for the desk rather than for a model.'
