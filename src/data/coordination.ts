/* ------------------------------------------------------------------ *
 * Mission coordination. ILLUSTRATIVE.
 *
 * IMPORTANT SCOPE NOTE. JetSearcher is a broker, not an operator. It does
 * not dispatch aircraft, hold an operating certificate, or control crew
 * duty. Everything below is BROKER-SIDE coordination: the things a broker
 * is accountable for between confirming a quote and closing a file.
 *
 * The operator flies the aeroplane. The broker makes sure the ambulance is
 * at the ramp, the permit came through, and the client knows what is
 * happening. That distinction is the whole business and this screen must
 * not blur it.
 * ------------------------------------------------------------------ */

export type TaskState = 'done' | 'live' | 'waiting' | 'blocked'

export type Party = 'JetSearcher' | 'Operator' | 'Client' | 'Ground' | 'Authority' | 'Hospital'

export interface CoordTask {
  id: string
  time: string
  label: string
  detail: string
  owner: Party
  state: TaskState
  /* True when this is JetSearcher's to chase rather than to watch */
  ours: boolean
}

export const TIMELINE: CoordTask[] = [
  {
    id: 'T1',
    time: '06:12',
    label: 'Request received',
    detail: 'Wexford Assistance, ICU repatriation, patient stable for transfer.',
    owner: 'Client',
    state: 'done',
    ours: false,
  },
  {
    id: 'T2',
    time: '06:16',
    label: 'Options returned',
    detail: 'Two viable options presented, one held off the board on accreditation.',
    owner: 'JetSearcher',
    state: 'done',
    ours: true,
  },
  {
    id: 'T3',
    time: '07:04',
    label: 'Option A accepted',
    detail: 'Meridian Air Ambulance, Learjet 45XR D-CMED. E-signed by the case manager.',
    owner: 'Client',
    state: 'done',
    ours: false,
  },
  {
    id: 'T4',
    time: '07:20',
    label: 'Operator confirmed and crewed',
    detail: 'Aircraft released, physician and flight nurse assigned, positioning from Munich at 11:15.',
    owner: 'Operator',
    state: 'done',
    ours: false,
  },
  {
    id: 'T5',
    time: '07:48',
    label: 'Türkiye ambulance flight permit filed',
    detail: 'Filed with medical clearance attached. Reference TR-AMB-88214.',
    owner: 'Authority',
    state: 'done',
    ours: true,
  },
  {
    id: 'T6',
    time: '09:30',
    label: 'Permit approved',
    detail: 'Approved for the 14:30 slot. Copy sent to the operator and the handler.',
    owner: 'Authority',
    state: 'done',
    ours: false,
  },
  {
    id: 'T7',
    time: '10:05',
    label: 'Ground ambulance, Antalya',
    detail: 'Booked hospital to LTAI ramp, ICU capable, 13:15 pickup.',
    owner: 'Ground',
    state: 'done',
    ours: true,
  },
  {
    id: 'T8',
    time: '10:40',
    label: 'Receiving bed confirmation',
    detail: 'Cardiac centre has confirmed the bed verbally. Written confirmation still outstanding.',
    owner: 'Hospital',
    state: 'live',
    ours: true,
  },
  {
    id: 'T9',
    time: '11:15',
    label: 'Positioning leg airborne',
    detail: 'Munich to Antalya, 1h 05m. Nothing for the desk to do while this runs.',
    owner: 'Operator',
    state: 'waiting',
    ours: false,
  },
  {
    id: 'T10',
    time: '12:50',
    label: 'Ground ambulance, London',
    detail: 'Biggin Hill to the cardiac centre. Held pending the written bed confirmation.',
    owner: 'Ground',
    state: 'blocked',
    ours: true,
  },
  {
    id: 'T11',
    time: '14:30',
    label: 'Patient loading and departure',
    detail: 'Scheduled. Handler briefed, stretcher loading from the ramp.',
    owner: 'Operator',
    state: 'waiting',
    ours: false,
  },
  {
    id: 'T12',
    time: '18:10',
    label: 'Arrival and handover',
    detail: 'Estimated. Bed to bed complete on handover signature.',
    owner: 'Ground',
    state: 'waiting',
    ours: false,
  },
]

/* The one thing genuinely at risk, and it is JetSearcher's to chase. */
export const BLOCKER = {
  taskId: 'T10',
  headline: 'Written bed confirmation is the only thing holding this mission',
  detail:
    'The London ground ambulance will not be released without it, and the aircraft departs Antalya in four hours. Vector flagged it at 10:40 when the verbal confirmation came in without paperwork behind it.',
  consequence:
    'If it does not arrive before 12:50 the ambulance slot is released and the next one is 15:20, which turns a bed-to-bed transfer into a patient waiting on a ramp at Biggin Hill.',
  action: 'Chase the cardiac centre bed manager now',
}

export const STATE_LABEL: Record<TaskState, string> = {
  done: 'Done',
  live: 'In progress',
  waiting: 'Scheduled',
  blocked: 'Blocked',
}

export const STATE_TONE: Record<TaskState, 'platinum' | 'navy' | 'neutral' | 'stop'> = {
  done: 'platinum',
  live: 'navy',
  waiting: 'neutral',
  blocked: 'stop',
}

export const oursCount = () => TIMELINE.filter((t) => t.ours).length
export const doneCount = () => TIMELINE.filter((t) => t.state === 'done').length
export const blockedTasks = () => TIMELINE.filter((t) => t.state === 'blocked')

/* What the broker is and is not accountable for. Stated on screen because
   blurring it is the fastest way to lose credibility with an operator. */
export const SCOPE_NOTE =
  'JetSearcher does not dispatch aircraft or control crew duty. The operator does, and holds the certificate for it. What sits here is what a broker is accountable for: permits, ground transfers, client communication and the paperwork that lets the operator fly.'
