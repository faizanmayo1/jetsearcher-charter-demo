/* ------------------------------------------------------------------ *
 * The request desk. ILLUSTRATIVE.
 *
 * A broker's day is a queue with a clock on it. The point this data has
 * to make is that the clock is the business: whoever quotes first, with
 * something credible, usually wins the trip.
 * ------------------------------------------------------------------ */

import { HERO_ID } from './mission'

export type RequestKind = 'Aeromedical' | 'Charter' | 'Experience' | 'Cargo'
export type RequestState = 'Unquoted' | 'Sourcing' | 'Quoted' | 'Confirmed' | 'Lost'

export interface ChartRequest {
  id: string
  kind: RequestKind
  client: string
  route: string
  departs: string
  pax: string
  receivedAt: string
  /* Minutes since the request landed */
  ageMin: number
  state: RequestState
  /* Minutes taken to return options, once quoted */
  quotedInMin?: number
  value?: number
  owner: string
  note?: string
  urgent?: boolean
}

export const REQUESTS: ChartRequest[] = [
  {
    id: HERO_ID,
    kind: 'Aeromedical',
    client: 'Wexford Assistance',
    route: 'Antalya to London Biggin Hill',
    departs: 'Today, 14:30',
    pax: 'Patient, 2 medical, 1 family',
    receivedAt: '06:12',
    ageMin: 4,
    state: 'Quoted',
    quotedInMin: 4,
    value: 41656,
    owner: 'Johann P.',
    note: 'ICU repatriation, ventilated cardiac patient. Two options presented, one held back.',
    urgent: true,
  },
  {
    id: 'REQ-4470',
    kind: 'Charter',
    client: 'Halstead Family Office',
    route: 'Farnborough to Geneva',
    departs: 'Tomorrow, 09:00',
    pax: '6 passengers, 2 dogs',
    receivedAt: '05:48',
    ageMin: 28,
    state: 'Sourcing',
    owner: 'Priya N.',
    note: 'Repeat client. Has declined anything without a full galley twice before.',
  },
  {
    id: 'REQ-4469',
    kind: 'Aeromedical',
    client: 'Northbridge Travel Insurance',
    route: 'Malaga to Dublin',
    departs: 'Today, 19:00',
    pax: 'Patient, 2 medical',
    receivedAt: '05:31',
    ageMin: 45,
    state: 'Unquoted',
    owner: 'Unassigned',
    note: 'Stretcher case, stable. Nobody has picked this up yet.',
    urgent: true,
  },
  {
    id: 'REQ-4468',
    kind: 'Charter',
    client: 'Ardmore Capital',
    route: 'Luton to Nice',
    departs: 'Fri 31 Jul, 07:30',
    pax: '8 passengers',
    receivedAt: 'Yesterday 17:20',
    ageMin: 772,
    state: 'Quoted',
    quotedInMin: 96,
    value: 21400,
    owner: 'Priya N.',
    note: 'Grand Prix weekend. Slot pressure at Nice, three of four options had no arrival slot.',
  },
  {
    id: 'REQ-4467',
    kind: 'Experience',
    client: 'Mrs A. Lindqvist',
    route: 'London to Malé',
    departs: 'Sat 15 Aug',
    pax: '4 passengers',
    receivedAt: 'Yesterday 14:05',
    ageMin: 967,
    state: 'Quoted',
    quotedInMin: 210,
    value: 148900,
    owner: 'Johann P.',
    note: 'Island transfer and villa coordination attached to the flight.',
  },
  {
    id: 'REQ-4466',
    kind: 'Cargo',
    client: 'Veritas Life Sciences',
    route: 'Basel to Boston',
    departs: 'Thu 30 Jul, 22:00',
    pax: 'Temperature controlled, 640kg',
    receivedAt: 'Yesterday 11:40',
    ageMin: 1112,
    state: 'Confirmed',
    quotedInMin: 74,
    value: 96500,
    owner: 'Tom R.',
    note: 'Clinical trial material. Two to eight degrees, continuous monitoring required.',
  },
  {
    id: 'REQ-4465',
    kind: 'Charter',
    client: 'Sable Motorsport',
    route: 'Farnborough to Budapest',
    departs: 'Mon 3 Aug, 06:00',
    pax: '12 passengers',
    receivedAt: '26 Jul 09:15',
    ageMin: 2941,
    state: 'Lost',
    quotedInMin: 265,
    value: 68000,
    owner: 'Tom R.',
    note: 'Quoted in four and a half hours. Client had already booked elsewhere.',
  },
  {
    id: 'REQ-4464',
    kind: 'Aeromedical',
    client: 'Wexford Assistance',
    route: 'Faro to Manchester',
    departs: '25 Jul, completed',
    pax: 'Patient, 1 medical',
    receivedAt: '25 Jul 08:02',
    ageMin: 5900,
    state: 'Confirmed',
    quotedInMin: 51,
    value: 28750,
    owner: 'Johann P.',
    note: 'Flown and closed. Same assistance company as the live medical request.',
  },
]

/* ------------------------------------------------------------------ *
 * Derived
 * ------------------------------------------------------------------ */

export const openRequests = () =>
  REQUESTS.filter((r) => r.state === 'Unquoted' || r.state === 'Sourcing')

export const unquoted = () => REQUESTS.filter((r) => r.state === 'Unquoted')

export const quotedRequests = () => REQUESTS.filter((r) => r.quotedInMin !== undefined)

export const wonValue = () =>
  REQUESTS.filter((r) => r.state === 'Confirmed').reduce((a, r) => a + (r.value ?? 0), 0)

export const pipelineValue = () =>
  REQUESTS.filter((r) => r.state === 'Quoted').reduce((a, r) => a + (r.value ?? 0), 0)

/* The desk's median time to return options, in minutes. Computed, so the
   headline on the desk cannot drift away from the rows underneath it. */
export function medianQuoteMinutes() {
  const times = quotedRequests()
    .map((r) => r.quotedInMin!)
    .sort((a, b) => a - b)
  if (times.length === 0) return 0
  const mid = Math.floor(times.length / 2)
  return times.length % 2 ? times[mid] : Math.round((times[mid - 1] + times[mid]) / 2)
}

/* Requests where the clock is the risk, not the sourcing */
export const atRisk = () => REQUESTS.filter((r) => r.state === 'Unquoted' && r.urgent)

export const KIND_TONE: Record<RequestKind, 'med' | 'navy' | 'gold' | 'neutral'> = {
  Aeromedical: 'med',
  Charter: 'navy',
  Experience: 'gold',
  Cargo: 'neutral',
}

/* The one number Johann is likely to push on: what a slow quote costs.
   Stated as a ratio drawn from the rows above rather than as a claim. */
export const LOST_TO_SPEED = {
  id: 'REQ-4465',
  quotedInMin: 265,
  value: 68000,
  note: 'Quoted in four and a half hours. The client had already booked elsewhere.',
}
