/* ------------------------------------------------------------------ *
 * Operator vetting. ILLUSTRATIVE, and every operator name is invented.
 *
 * This is the part of broking that clients never see and that carries all
 * the liability. A broker who puts a client on an aircraft whose insurance
 * lapsed last week has a very bad day, and the paperwork proving it did
 * not lapse is what an assistance company or a corporate travel desk
 * actually asks for.
 *
 * The vetting ladder deliberately uses no green. ARGUS and Wyvern already
 * grade in platinum and gold, so the palette borrows their vocabulary and
 * leaves green to mean Vector.
 * ------------------------------------------------------------------ */

export type DocState = 'current' | 'expiring' | 'expired' | 'missing'

export interface OperatorDoc {
  name: string
  state: DocState
  detail: string
}

export interface Operator {
  id: string
  name: string
  base: string
  country: string
  aircraft: number
  argus?: 'Platinum' | 'Gold Plus' | 'Gold'
  wyvern: boolean
  eurami: boolean
  camts: boolean
  /* Missions JetSearcher has placed with them */
  missionsPlaced: number
  onTimeRate: number
  lastAudit: string
  docs: OperatorDoc[]
  status: 'Approved' | 'Approved with conditions' | 'On hold'
  note?: string
}

export const OPERATORS: Operator[] = [
  {
    id: 'OP-101',
    name: 'Meridian Air Ambulance',
    base: 'Munich',
    country: 'Germany',
    aircraft: 6,
    argus: 'Platinum',
    wyvern: false,
    eurami: true,
    camts: false,
    missionsPlaced: 48,
    onTimeRate: 96.2,
    lastAudit: '14 Mar 2026',
    status: 'Approved',
    docs: [
      { name: 'Air operator certificate', state: 'current', detail: 'Valid to 30 Nov 2027' },
      { name: 'Insurance certificate', state: 'current', detail: 'Valid to 12 Feb 2027, limits verified' },
      { name: 'EURAMI accreditation', state: 'current', detail: 'Valid to 09 Mar 2028' },
      { name: 'ARGUS Platinum', state: 'current', detail: 'Renewed 14 Mar 2026' },
      { name: 'Medical equipment schedule', state: 'current', detail: 'Signed off 02 Jun 2026' },
    ],
  },
  {
    id: 'OP-102',
    name: 'Aurora MedFlight',
    base: 'Athens',
    country: 'Greece',
    aircraft: 4,
    argus: 'Gold',
    wyvern: true,
    eurami: true,
    camts: true,
    missionsPlaced: 31,
    onTimeRate: 92.8,
    lastAudit: '22 Jan 2026',
    status: 'Approved',
    docs: [
      { name: 'Air operator certificate', state: 'current', detail: 'Valid to 18 Aug 2027' },
      { name: 'Insurance certificate', state: 'current', detail: 'Valid to 01 Oct 2026' },
      { name: 'EURAMI accreditation', state: 'current', detail: 'Valid to 27 Sep 2027' },
      { name: 'CAMTS accreditation', state: 'current', detail: 'Valid to 27 Sep 2027' },
      { name: 'Wyvern Wingman', state: 'current', detail: 'On-site audit 22 Jan 2026' },
    ],
  },
  {
    id: 'OP-103',
    name: 'Northgate Executive Aviation',
    base: 'Farnborough',
    country: 'United Kingdom',
    aircraft: 11,
    argus: 'Gold',
    wyvern: false,
    eurami: false,
    camts: false,
    missionsPlaced: 76,
    onTimeRate: 94.1,
    lastAudit: '08 May 2026',
    status: 'Approved with conditions',
    note: 'Executive charter only. Not approved for aeromedical work, and Vector will not place a medical mission with them.',
    docs: [
      { name: 'Air operator certificate', state: 'current', detail: 'Valid to 04 Apr 2028' },
      { name: 'Insurance certificate', state: 'current', detail: 'Valid to 30 Jun 2027' },
      { name: 'ARGUS Gold', state: 'current', detail: 'Renewed 08 May 2026' },
      { name: 'EURAMI accreditation', state: 'missing', detail: 'No aeromedical programme' },
    ],
  },
  {
    id: 'OP-104',
    name: 'Corvus Jet Partners',
    base: 'Vienna',
    country: 'Austria',
    aircraft: 9,
    argus: 'Platinum',
    wyvern: true,
    eurami: false,
    camts: false,
    missionsPlaced: 52,
    onTimeRate: 97.4,
    lastAudit: '19 Jun 2026',
    status: 'Approved',
    docs: [
      { name: 'Air operator certificate', state: 'current', detail: 'Valid to 22 Dec 2027' },
      { name: 'Insurance certificate', state: 'current', detail: 'Valid to 15 Mar 2027' },
      { name: 'ARGUS Platinum', state: 'current', detail: 'Renewed 19 Jun 2026' },
      { name: 'Wyvern Wingman', state: 'current', detail: 'On-site audit 19 Jun 2026' },
    ],
  },
  {
    id: 'OP-105',
    name: 'Adriatic Wings',
    base: 'Zagreb',
    country: 'Croatia',
    aircraft: 3,
    argus: 'Gold',
    wyvern: false,
    eurami: false,
    camts: false,
    missionsPlaced: 7,
    onTimeRate: 88.5,
    lastAudit: '30 Sep 2025',
    status: 'On hold',
    note: 'Insurance certificate expired eleven days ago. Vector removed them from sourcing automatically and told the desk.',
    docs: [
      { name: 'Air operator certificate', state: 'current', detail: 'Valid to 11 Jan 2027' },
      { name: 'Insurance certificate', state: 'expired', detail: 'Expired 18 Jul 2026, eleven days ago' },
      { name: 'ARGUS Gold', state: 'expiring', detail: 'Expires 30 Sep 2026, 63 days' },
    ],
  },
  {
    id: 'OP-106',
    name: 'Bellhaven Air Charter',
    base: 'Dublin',
    country: 'Ireland',
    aircraft: 5,
    argus: 'Gold Plus',
    wyvern: true,
    eurami: false,
    camts: false,
    missionsPlaced: 23,
    onTimeRate: 91.3,
    lastAudit: '11 Feb 2026',
    status: 'Approved with conditions',
    note: 'Wyvern audit is current. ARGUS Gold Plus expires inside 90 days and needs chasing before the autumn schedule.',
    docs: [
      { name: 'Air operator certificate', state: 'current', detail: 'Valid to 07 Jul 2028' },
      { name: 'Insurance certificate', state: 'current', detail: 'Valid to 28 Feb 2027' },
      { name: 'ARGUS Gold Plus', state: 'expiring', detail: 'Expires 14 Oct 2026, 77 days' },
      { name: 'Wyvern Wingman', state: 'current', detail: 'On-site audit 11 Feb 2026' },
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Derived
 * ------------------------------------------------------------------ */

export const approvedOperators = () => OPERATORS.filter((o) => o.status === 'Approved')

export const onHold = () => OPERATORS.filter((o) => o.status === 'On hold')

export const aeromedicalApproved = () => OPERATORS.filter((o) => o.eurami)

export const totalAircraft = () => OPERATORS.reduce((a, o) => a + o.aircraft, 0)

export function documentIssues() {
  return OPERATORS.flatMap((o) =>
    o.docs
      .filter((d) => d.state === 'expired' || d.state === 'expiring' || d.state === 'missing')
      .map((d) => ({ operator: o.name, operatorId: o.id, ...d })),
  )
}

export const DOC_TONE: Record<DocState, 'platinum' | 'caution' | 'stop' | 'neutral'> = {
  current: 'platinum',
  expiring: 'caution',
  expired: 'stop',
  missing: 'stop',
}

export const DOC_LABEL: Record<DocState, string> = {
  current: 'In date',
  expiring: 'Expiring',
  expired: 'Expired',
  missing: 'Not held',
}

/* What the vetting layer is actually for. A broker gets asked this by
   every assistance company and every corporate travel desk. */
export const VETTING_NOTE =
  'Vector checks accreditation, insurance and audit dates before an aircraft reaches an option board, not after a client has asked. An operator whose insurance lapsed is out of sourcing the same morning, and the desk is told which mission it would have affected.'
