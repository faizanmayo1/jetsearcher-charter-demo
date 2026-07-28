/* ------------------------------------------------------------------ *
 * The hero mission and the three-option board. ILLUSTRATIVE throughout.
 *
 * Every total on screen is computed from the line items below rather than
 * typed in as a result, so a reviewer can add up the quote and get the
 * same number. Johann has priced thousands of these and will do exactly
 * that.
 *
 * Every operator name is fictitious. Attaching an invented safety finding
 * or an invented price to a real charter operator would be indefensible,
 * so no real operator appears anywhere in this build.
 * ------------------------------------------------------------------ */

export const HERO_ID = 'REQ-4471'

/* ------------------------------------------------------------------ *
 * The request
 * ------------------------------------------------------------------ */

export interface Airport {
  icao: string
  iata: string
  name: string
  city: string
  country: string
  /* Decimal degrees, used to draw the great circle */
  lat: number
  lon: number
}

export const ORIGIN: Airport = {
  icao: 'LTAI',
  iata: 'AYT',
  name: 'Antalya',
  city: 'Antalya',
  country: 'Türkiye',
  lat: 36.9,
  lon: 30.79,
}

export const DESTINATION: Airport = {
  icao: 'EGKB',
  iata: 'BQH',
  name: 'London Biggin Hill',
  city: 'London',
  country: 'United Kingdom',
  lat: 51.33,
  lon: 0.03,
}

/* Great circle distance, computed rather than asserted. */
export function greatCircleNm(a: Airport, b: Airport) {
  const R = 3440.065 // earth radius in nautical miles
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(s)))
}

export const DISTANCE_NM = greatCircleNm(ORIGIN, DESTINATION)

export const MISSION = {
  id: HERO_ID,
  kind: 'Aeromedical' as const,
  priority: 'Time critical' as const,
  receivedAt: '06:12',
  quotedAt: '06:16',
  minutesToQuote: 4,
  /* What the desk currently averages on a medical request, by hand */
  deskAverageMinutes: 130,
  client: 'Wexford Assistance',
  clientType: 'Medical assistance company',
  clientContact: 'Marie Delacroix',
  patient: {
    ref: 'PT-2291',
    summary: 'Adult, post myocardial infarction, day four',
    status: 'ICU, ventilated, stable for transfer',
    escort: 'Physician and flight nurse',
    equipment: ['Stretcher and loading system', 'Oxygen, 4,200 litres', 'Ventilator', 'Two syringe pumps', 'Defibrillator'],
    constraints: [
      'Cabin altitude to be held at or below 6,000 ft',
      'Bed to bed, ground ambulance both ends',
      'Receiving bed confirmed at a London cardiac centre',
    ],
  },
  requires: {
    accreditation: 'EURAMI',
    medicalConfig: true,
    stretcher: true,
    oxygenLitres: 4200,
    escortSeats: 2,
    familySeats: 1,
  },
}

/* ------------------------------------------------------------------ *
 * The options. Sourced whole-of-market, which is the business model.
 * ------------------------------------------------------------------ */

export type QuoteGroup =
  | 'Aircraft'
  | 'Medical'
  | 'Airport and handling'
  | 'Airspace and permits'
  | 'Ground transfer'
  | 'JetSearcher'

export const QUOTE_GROUPS: QuoteGroup[] = [
  'Aircraft',
  'Medical',
  'Airport and handling',
  'Airspace and permits',
  'Ground transfer',
  'JetSearcher',
]

export interface QuoteLine {
  label: string
  group: QuoteGroup
  amount: number
  note?: string
}

export type Rating = 'ARGUS Platinum' | 'ARGUS Gold Plus' | 'ARGUS Gold' | 'Wyvern Wingman'

export interface FitCheck {
  requirement: string
  met: boolean
  detail: string
}

export interface Option {
  id: string
  rank: number
  aircraft: string
  registration: string
  category: string
  operator: string
  operatorBase: string
  ratings: Rating[]
  eurami: boolean
  camts: boolean
  medicalConfig: 'Installed' | 'Portable only' | 'None'
  /* Minutes */
  positioningMin: number
  flightMin: number
  techStopMin: number
  lines: QuoteLine[]
  fitScore: number
  fit: FitCheck[]
  verdict: 'best' | 'viable' | 'excluded'
  headline: string
  tradeoff: string
  excludedBecause?: string
}

/* JetSearcher's coordination fee, applied to the operator cost. Stated
   openly because all-in pricing is the promise on their own site. */
export const FEE_RATE = 0.08

function withFee(lines: QuoteLine[]): QuoteLine[] {
  const operatorCost = lines.reduce((a, l) => a + l.amount, 0)
  return [
    ...lines,
    {
      label: 'JetSearcher coordination fee',
      group: 'JetSearcher',
      amount: Math.round(operatorCost * FEE_RATE),
      note: `${(FEE_RATE * 100).toFixed(0)}% of operator cost, shown rather than buried in the hourly rate`,
    },
  ]
}

export const OPTIONS: Option[] = [
  {
    id: 'OPT-A',
    rank: 1,
    aircraft: 'Learjet 45XR',
    registration: 'D-CMED',
    category: 'Light jet, dedicated air ambulance',
    operator: 'Meridian Air Ambulance',
    operatorBase: 'Munich',
    ratings: ['ARGUS Platinum'],
    eurami: true,
    camts: false,
    medicalConfig: 'Installed',
    /* Munich to Antalya is 1,080 nm. At the type's 465 kt cruise, derated to
       430 kt for a medical payload and a westerly wind component. */
    positioningMin: 151,
    flightMin: 219,
    techStopMin: 0,
    fitScore: 96,
    verdict: 'best',
    headline: 'Fastest patient transit, fully accredited',
    tradeoff:
      'The dearer of the two viable options by £4,877. It buys 1h 17m less time in the air for a ventilated cardiac patient, which is a clinical decision rather than a commercial one.',
    fit: [
      { requirement: 'EURAMI accreditation', met: true, detail: 'Accredited, valid to March 2028' },
      { requirement: 'Stretcher and loading system', met: true, detail: 'Installed, electric loading' },
      { requirement: 'Oxygen, 4,200 litres', met: true, detail: '5,600 litres available' },
      { requirement: 'Two medical escort seats', met: true, detail: 'Physician and nurse seats certified' },
      { requirement: 'One family seat', met: true, detail: 'Available' },
      { requirement: 'Cabin altitude at or below 6,000 ft', met: true, detail: 'Holds 5,400 ft at FL410' },
      { requirement: 'No technical stop', met: true, detail: 'Direct. 1,566 nm against a 2,039 nm range for the type' },
    ],
    lines: withFee([
      { label: 'Aircraft charter, 7h 18m block', group: 'Aircraft', amount: 28308, note: '£3,950 per block hour. Market rate for the type is $4,250 to $4,450, plus a premium for the installed medical configuration' },
      { label: 'Fuel surcharge', group: 'Aircraft', amount: 2180 },
      { label: 'Crew duty extension provision', group: 'Aircraft', amount: 560 },
      { label: 'Medical crew, physician and flight nurse', group: 'Medical', amount: 4850, note: '14 hour duty, bed to bed' },
      { label: 'ICU equipment and consumables', group: 'Medical', amount: 1680, note: 'Ventilator, two syringe pumps, oxygen, defibrillator' },
      { label: 'Landing and handling, Antalya', group: 'Airport and handling', amount: 1140 },
      { label: 'Landing and handling, Biggin Hill', group: 'Airport and handling', amount: 1860, note: 'Quoted by the handler, not a published tariff' },
      { label: 'Eurocontrol route charges, five zones', group: 'Airspace and permits', amount: 1640, note: 'Ambulance flights are exempt in some charging zones. Claimed where it applies, and not netted off until it is confirmed' },
      { label: 'Türkiye permit handling and medical clearance', group: 'Airspace and permits', amount: 280, note: 'The Turkish CAA charges no fee for the permit itself. This is the agent filing it' },
      { label: 'Ground ambulance, hospital to Antalya', group: 'Ground transfer', amount: 720, note: 'ICU capable' },
      { label: 'Ground ambulance, Biggin Hill to London', group: 'Ground transfer', amount: 980 },
    ]),
  },
  {
    id: 'OPT-B',
    rank: 2,
    aircraft: 'Learjet 35A',
    registration: 'TC-AMB',
    category: 'Light jet, dedicated air ambulance',
    operator: 'Aurora MedFlight',
    operatorBase: 'Antalya',
    ratings: ['Wyvern Wingman', 'ARGUS Gold'],
    eurami: true,
    camts: true,
    medicalConfig: 'Installed',
    /* Already on base at Antalya, which is most of why it is cheaper.
       Cruise 418 kt derated to 390 kt, with a fuel stop at Brindisi. */
    positioningMin: 0,
    flightMin: 241,
    techStopMin: 55,
    fitScore: 84,
    verdict: 'viable',
    headline: 'Lower cost, one technical stop',
    tradeoff:
      'Saves £4,877 and adds 1h 17m to patient transit, including a fuel stop at Brindisi with the patient on board. Dual accredited and already on base at Antalya, which is most of why it is cheaper.',
    fit: [
      { requirement: 'EURAMI accreditation', met: true, detail: 'Accredited, valid to September 2027. Also CAMTS' },
      { requirement: 'Stretcher and loading system', met: true, detail: 'Installed, manual loading ramp' },
      { requirement: 'Oxygen, 4,200 litres', met: true, detail: '4,400 litres carried, which leaves no margin for a diversion' },
      { requirement: 'Two medical escort seats', met: true, detail: 'Certified' },
      { requirement: 'One family seat', met: false, detail: 'No seat left once the medical team is aboard' },
      { requirement: 'Cabin altitude at or below 6,000 ft', met: true, detail: 'Holds 5,900 ft at FL390' },
      { requirement: 'No technical stop', met: false, detail: 'Fuel stop at Brindisi, 55 minutes on the ground with the patient aboard' },
    ],
    lines: withFee([
      { label: 'Aircraft charter, 8h 02m block', group: 'Aircraft', amount: 22092, note: '£2,750 per block hour. Older airframe, and no positioning leg because it is already on base' },
      { label: 'Fuel surcharge', group: 'Aircraft', amount: 2320 },
      { label: 'Crew duty extension provision', group: 'Aircraft', amount: 980, note: 'Longer duty day because of the technical stop' },
      { label: 'Medical crew, physician and flight nurse', group: 'Medical', amount: 4600 },
      { label: 'ICU equipment and consumables', group: 'Medical', amount: 1610 },
      { label: 'Landing and handling, Antalya', group: 'Airport and handling', amount: 1140 },
      { label: 'Technical stop, Brindisi', group: 'Airport and handling', amount: 1320, note: 'Landing, handling and fuel uplift, 641 nm out of Antalya' },
      { label: 'Landing and handling, Biggin Hill', group: 'Airport and handling', amount: 1860 },
      { label: 'Eurocontrol route charges, six zones', group: 'Airspace and permits', amount: 1780, note: 'One extra charging zone because of the routing through the stop' },
      { label: 'Türkiye permit handling and medical clearance', group: 'Airspace and permits', amount: 280 },
      { label: 'Ground ambulance, hospital to Antalya', group: 'Ground transfer', amount: 720 },
      { label: 'Ground ambulance, Biggin Hill to London', group: 'Ground transfer', amount: 980 },
    ]),
  },
  {
    id: 'OPT-C',
    rank: 3,
    aircraft: 'Challenger 604',
    registration: 'G-NGEA',
    category: 'Large cabin, executive configuration',
    operator: 'Northgate Executive Aviation',
    operatorBase: 'Farnborough',
    ratings: ['ARGUS Gold'],
    eurami: false,
    camts: false,
    medicalConfig: 'Portable only',
    /* Farnborough to Antalya is 1,640 nm, so the positioning leg is longer
       than the mission itself. Cruise 470 kt derated to 440 kt. */
    positioningMin: 224,
    flightMin: 214,
    techStopMin: 0,
    fitScore: 31,
    verdict: 'excluded',
    headline: 'Ruled out on accreditation, not on price',
    excludedBecause:
      'No EURAMI accreditation and no installed medical configuration. A portable stretcher kit in an executive cabin is not an equivalent, and this mission is a ventilated ICU transfer.',
    tradeoff:
      'It came back because it is available, close and large. Vector holds it off the board rather than presenting three options where one cannot legally or clinically do the job. Two strong options beat three where one is padding.',
    fit: [
      { requirement: 'EURAMI accreditation', met: false, detail: 'Not accredited. Operator has no aeromedical programme' },
      { requirement: 'Stretcher and loading system', met: false, detail: 'Portable kit only, no certified loading system' },
      { requirement: 'Oxygen, 4,200 litres', met: false, detail: 'Therapeutic oxygen only, not to ICU volume' },
      { requirement: 'Two medical escort seats', met: true, detail: 'Ample cabin seating' },
      { requirement: 'One family seat', met: true, detail: 'Available' },
      { requirement: 'Cabin altitude at or below 6,000 ft', met: true, detail: 'Holds 5,700 ft at FL410' },
      { requirement: 'No technical stop', met: true, detail: 'Direct' },
    ],
    lines: withFee([
      { label: 'Aircraft charter, 10h 25m block', group: 'Aircraft', amount: 54167, note: '£5,200 per block hour. The positioning leg out of Farnborough is longer than the mission' },
      { label: 'Fuel surcharge', group: 'Aircraft', amount: 4180 },
      { label: 'Crew duty extension provision', group: 'Aircraft', amount: 1240 },
      { label: 'Third party medical escort team', group: 'Medical', amount: 6200, note: 'Sub-contracted, because the operator has no medical programme' },
      { label: 'Portable ICU kit hire', group: 'Medical', amount: 2650 },
      { label: 'Landing and handling, Antalya', group: 'Airport and handling', amount: 1380 },
      { label: 'Landing and handling, Biggin Hill', group: 'Airport and handling', amount: 2240 },
      { label: 'Eurocontrol route charges, five zones', group: 'Airspace and permits', amount: 1940 },
      { label: 'Türkiye permit handling and medical clearance', group: 'Airspace and permits', amount: 280 },
      { label: 'Ground ambulance, hospital to Antalya', group: 'Ground transfer', amount: 720 },
      { label: 'Ground ambulance, Biggin Hill to London', group: 'Ground transfer', amount: 980 },
    ]),
  },
]

/* ------------------------------------------------------------------ *
 * Derived. Nothing below is typed in as a result.
 * ------------------------------------------------------------------ */

/* The number that matters clinically: how long the patient is actually in
   transit. Derived, never stored, so it can never drift away from the legs
   it is made of. */
export const patientTransit = (o: Option) => o.flightMin + o.techStopMin

export const optionTotal = (o: Option) => o.lines.reduce((a, l) => a + l.amount, 0)

export const operatorCost = (o: Option) =>
  o.lines.filter((l) => l.group !== 'JetSearcher').reduce((a, l) => a + l.amount, 0)

export const groupTotal = (o: Option, g: QuoteGroup) =>
  o.lines.filter((l) => l.group === g).reduce((a, l) => a + l.amount, 0)

export const byId = (id: string) => OPTIONS.find((o) => o.id === id)

export const viableOptions = () => OPTIONS.filter((o) => o.verdict !== 'excluded')

export const bestOption = () => OPTIONS.find((o) => o.verdict === 'best')!

/* The commercial and clinical gap between the two viable options */
export function tradeoff() {
  const [a, b] = viableOptions()
  return {
    /* What the cheaper option saves, expressed positively */
    saving: optionTotal(a) - optionTotal(b),
    /* What that saving costs in patient transit time */
    timeCost: patientTransit(b) - patientTransit(a),
    cheaper: b,
    faster: a,
  }
}

/* How many aircraft Vector looked at to get here. The whole-of-market
   claim is the business model, so the funnel is worth showing. */
export const SOURCING_FUNNEL = [
  { stage: 'Operators in network', count: 412, note: 'Across the regions that could reach Antalya in the window' },
  { stage: 'Aircraft available in window', count: 63, note: 'Live availability, positioned within six hours' },
  { stage: 'Aeromedical capable', count: 11, note: 'Installed medical configuration and a stretcher system' },
  { stage: 'Accreditation and insurance current', count: 6, note: 'EURAMI valid, insurance and audit dates in date' },
  { stage: 'Presented to the client', count: 2, note: 'Two strong options rather than three padded ones' },
]

/* What Vector will not decide. The clinical call is not a broker's to make. */
export interface Deferral {
  question: string
  why: string
  owner: string
}

export const DEFERRALS: Deferral[] = [
  {
    question: 'Is the patient fit to fly with one technical stop?',
    why: 'A fuel stop with a ventilated cardiac patient on board is a clinical judgement about that patient on that day. Nothing in the availability data answers it, and a wrong answer is not recoverable.',
    owner: 'The transferring physician and the medical escort lead',
  },
  {
    question: 'Which option does the assistance company want presented first?',
    why: 'Wexford has a case manager and a payer behind them. Vector can rank on fit and cost. It cannot see the authorisation limit on this case.',
    owner: 'Marie Delacroix at Wexford Assistance',
  },
  {
    question: 'Is the receiving bed confirmed before wheels up?',
    why: 'A bed-to-bed transfer with no confirmed receiving bed becomes an aircraft holding on a ramp with a patient on board. This is a phone call, not a data field.',
    owner: 'JetSearcher operations, with the receiving cardiac centre',
  },
]
