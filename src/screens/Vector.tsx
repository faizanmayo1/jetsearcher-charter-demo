import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleHelp, FileDown, Send, Sparkles } from 'lucide-react'
import { AiTag, Button, Panel, PanelHead, Tag, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import {
  DESTINATION,
  DISTANCE_NM,
  MISSION,
  ORIGIN,
  SOURCING_FUNNEL,
  bestOption,
  optionTotal,
  patientTransit,
  operatorCost,
  tradeoff,
  viableOptions,
} from '../data/mission'
import { CLIENT, gbp, hhmm, num, pct } from '../data/jetsearcher'
import { onHold } from '../data/operators'
import { medianQuoteMinutes } from '../data/requests'
import { speedVersusWin } from '../data/clients'

interface Evidence {
  label: string
  detail: string
}

interface Turn {
  q: string
  a: string
  evidence: Evidence[]
  declines?: boolean
  action?: { label: string; to: string }
}

const BEST = bestOption()
const GAP = tradeoff()
const CORR = speedVersusWin()

const SCRIPT: Turn[] = [
  {
    q: 'Why did you rank the Learjet first when it is the more expensive option?',
    a: `Because the gap is ${gbp(GAP.saving)} and what it buys is ${hhmm(GAP.timeCost)} less time in the air for a ventilated cardiac patient, including a fuel stop at Brindisi with the patient on board. Both aircraft are EURAMI accredited and both meet every hard requirement except one: the 35A has no family seat left once the medical team is aboard. On fit and transit time the Learjet wins. On price it does not. I have ranked it first and presented both, because the trade is not mine to settle.`,
    evidence: [
      { label: 'Price gap', detail: `${gbp(optionTotal(GAP.faster))} against ${gbp(optionTotal(GAP.cheaper))}` },
      { label: 'Transit', detail: `${hhmm(patientTransit(GAP.faster))} against ${hhmm(patientTransit(GAP.cheaper))}` },
      { label: 'Accreditation', detail: 'Both EURAMI. Aurora also holds CAMTS' },
      { label: 'Fit', detail: `${GAP.faster.fitScore} against ${GAP.cheaper.fitScore}` },
    ],
    action: { label: 'Open the option board', to: '/sourcing' },
  },
  {
    q: 'What did you rule out, and on what grounds?',
    a: `One aircraft, the Challenger 604 from Northgate. It is available, it is close, and it is the largest cabin of the three. It has no EURAMI accreditation and no installed medical configuration, so a portable stretcher kit in an executive cabin would have been the proposition. For a ventilated ICU transfer that is not an equivalent, and Wexford has declined two aircraft on accreditation alone in the last two years. I held it off the board rather than present three options where one was padding. It is on the file with the reason, so an auditor can see the whole shortlist.`,
    evidence: [
      { label: 'Funnel', detail: `${num(SOURCING_FUNNEL[0].count)} operators to ${SOURCING_FUNNEL[SOURCING_FUNNEL.length - 1].count} options` },
      { label: 'Ruled out', detail: 'No EURAMI, no installed medical configuration' },
      { label: 'Client history', detail: 'Wexford has declined two aircraft on accreditation, Mar 2024 and Nov 2025' },
    ],
    action: { label: 'See the full shortlist', to: '/sourcing' },
  },
  {
    q: 'Is there anything wrong in the operator network this morning?',
    a: `One thing. ${onHold()[0].name} has an insurance certificate that expired eleven days ago, so I removed them from sourcing and told the desk. They have three aircraft and JetSearcher has placed seven missions with them, which is exactly why it matters: they are familiar enough to be reached for without anyone re-checking the file. Separately, Bellhaven's ARGUS Gold Plus expires in seventy-seven days and should be chased before the autumn schedule is built.`,
    evidence: [
      { label: 'Pulled from sourcing', detail: `${onHold()[0].name}, insurance expired 18 Jul 2026` },
      { label: 'Expiring', detail: 'Bellhaven Air Charter, ARGUS Gold Plus, 77 days' },
      { label: 'Checked', detail: 'Certificate, insurance, safety rating and accreditation, nightly' },
    ],
    action: { label: 'Open operator vetting', to: '/operators' },
  },
  {
    q: 'Should we take the cheaper aircraft to protect the margin on this one?',
    a: `I am not going to answer that. The difference is ${gbp(GAP.saving)} and it lands on a ventilated cardiac patient as ${hhmm(GAP.timeCost)} of additional transit with a fuel stop in the middle. Whether that is acceptable is a clinical judgement about this patient on this day, and it belongs to the transferring physician and the escort lead. I can tell you what each option costs and what each one does. I should not be the thing that decides a patient spends another seventy seven minutes in the air to protect a margin.`,
    evidence: [
      { label: 'What I can rank', detail: 'Fit, accreditation, transit time, cost' },
      { label: 'What I cannot see', detail: 'Fitness to fly with a technical stop, on this patient, today' },
      { label: 'Owner', detail: 'Transferring physician and the medical escort lead' },
    ],
    declines: true,
  },
  {
    q: 'Where is this mission actually at risk right now?',
    a: `In one place, and it is ours. The receiving cardiac centre confirmed the bed verbally at 10:40 with no paperwork behind it. The London ground ambulance will not be released without written confirmation, and if it does not arrive before 12:50 the slot goes and the next one is 15:20. That would turn a bed-to-bed transfer into a patient waiting on a ramp at Biggin Hill. Everything else on the timeline is either done or sits with the operator, who is on schedule.`,
    evidence: [
      { label: 'Blocked', detail: 'London ground ambulance, pending written bed confirmation' },
      { label: 'Deadline', detail: '12:50, after which the next slot is 15:20' },
      { label: 'Ours or theirs', detail: 'Ours. The operator side is on schedule' },
    ],
    action: { label: 'Open mission coordination', to: '/mission' },
  },
]

let askedSoFar: Turn[] = [SCRIPT[0]]
let briefBuilt = false

export function Vector() {
  const [asked, setAsked] = useState<Turn[]>(askedSoFar)
  const [draft, setDraft] = useState('')
  const [brief, setBrief] = useState(briefBuilt)
  const { push } = useToast()
  const navigate = useNavigate()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (asked.length > 1) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [asked.length])

  const remaining = SCRIPT.filter((s) => !asked.includes(s))

  const ask = (t: Turn) => {
    askedSoFar = [...askedSoFar, t]
    setAsked(askedSoFar)
    setDraft('')
  }

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="eyebrow">{CLIENT.ai} copilot</div>
            <h2 className="mt-1.5 max-w-2xl font-display text-lede font-semibold text-ink">
              Grounded in the mission file, and clear about what it will not decide
            </h2>
            <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-ink-soft">
              Every answer below cites the line it came from. One of the five refuses, because the question
              asks a sourcing engine to make a clinical trade to protect a margin. That refusal is the
              feature.
            </p>
          </div>
          <AiTag />
        </div>
      </Panel>

      <div className="grid items-start gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* -------------------------------- the chat -------------------------------- */}
        <div className="space-y-4">
          {asked.map((t, i) => (
            <div key={i} className="space-y-2.5">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-card rounded-br-sm bg-navy px-3.5 py-2.5 text-[12.5px] leading-relaxed text-white">
                  {t.q}
                </div>
              </div>

              <Panel className={cn(t.declines && 'border-jade/40 bg-jade-wash')}>
                <div className="flex items-start gap-2.5">
                  <span className="mt-[2px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jade-tint">
                    {t.declines ? (
                      <CircleHelp className="h-3.5 w-3.5 text-jade-deep" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-jade-deep" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    {t.declines && (
                      <Tag level="med" className="mb-2">
                        {CLIENT.ai} declined to answer
                      </Tag>
                    )}
                    <p className="text-[12.5px] leading-relaxed text-ink">{t.a}</p>

                    <div className="mt-3 space-y-1.5 border-t border-line pt-3">
                      {t.evidence.map((e) => (
                        <div key={e.label} className="flex gap-2 text-[11px]">
                          <span className="shrink-0 font-semibold text-ink-soft">{e.label}</span>
                          <span className="text-ink-faint">{e.detail}</span>
                        </div>
                      ))}
                    </div>

                    {t.action && (
                      <Button variant="ghost" size="sm" className="mt-3" onClick={() => navigate(t.action!.to)}>
                        {t.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              </Panel>
            </div>
          ))}
          <div ref={endRef} />

          <Panel flush className="p-3">
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && remaining.length > 0) ask(remaining[0])
                }}
                placeholder={
                  remaining.length > 0 ? 'Ask about this mission' : 'That is the scripted set for today'
                }
                className="w-full bg-transparent px-1.5 text-[12.5px] text-ink outline-none placeholder:text-ink-faint"
              />
              <Button
                variant="ai"
                size="sm"
                icon={<Send className="h-3.5 w-3.5" />}
                disabled={remaining.length === 0}
                onClick={() => remaining.length > 0 && ask(remaining[0])}
              >
                Ask
              </Button>
            </div>

            {remaining.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                {remaining.map((t) => (
                  <button
                    key={t.q}
                    type="button"
                    onClick={() => ask(t)}
                    className="rounded-full border border-line bg-surface px-2.5 py-1 text-left text-[11px] font-medium text-ink-soft transition-colors hover:border-jade/40 hover:bg-jade-wash hover:text-ink"
                  >
                    {t.q}
                  </button>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* ------------------------------- the artifact ------------------------------- */}
        <div className="space-y-5">
          <Panel>
            <PanelHead
              eyebrow="Mission brief"
              title="One page for the case manager"
              sub="Route, aircraft, accreditation, the price build-up, what was ruled out and why, and the three calls that are not ours to make."
              right={
                <Button
                  variant={brief ? 'ghost' : 'ai'}
                  size="sm"
                  icon={<FileDown className="h-3.5 w-3.5" />}
                  onClick={() => {
                    briefBuilt = true
                    setBrief(true)
                    push({
                      kind: 'ai',
                      title: 'Mission brief generated',
                      body: 'The excluded aircraft and its reason are on the front page, not buried at the back.',
                    })
                  }}
                >
                  {brief ? 'Regenerate' : 'Build the brief'}
                </Button>
              }
            />
          </Panel>

          {brief ? (
            <Panel flush className="animate-rise overflow-hidden">
              <div className="border-b border-line bg-canvas px-6 py-5">
                <div className="eyebrow">Aeromedical mission brief</div>
                <h3 className="mt-1.5 font-display text-[19px] font-semibold leading-tight text-ink">
                  {MISSION.id} · {ORIGIN.city} to {DESTINATION.city}
                </h3>
                <p className="mt-1 text-[11.5px] text-ink-soft">
                  {MISSION.client} · patient {MISSION.patient.ref} · prepared {CLIENT.today}
                </p>
              </div>

              <div className="space-y-5 px-6 py-5">
                <Block title="Recommendation">
                  <p className="text-[12.5px] leading-relaxed text-ink">
                    {BEST.aircraft} {BEST.registration}, operated by {BEST.operator}. All-in{' '}
                    {gbp(optionTotal(BEST))}, of which {gbp(operatorCost(BEST))} is operator cost.{' '}
                    {hhmm(patientTransit(BEST))} patient transit, direct, {num(DISTANCE_NM)} nm.
                    EURAMI accredited, ARGUS Platinum, installed medical configuration.
                  </p>
                </Block>

                <Block title="Alternative presented">
                  <p className="text-[12px] leading-relaxed text-ink-soft">
                    {GAP.cheaper.aircraft} {GAP.cheaper.registration}, {GAP.cheaper.operator}. All-in{' '}
                    {gbp(optionTotal(GAP.cheaper))}, a saving of {gbp(GAP.saving)}. Adds{' '}
                    {hhmm(GAP.timeCost)} to patient transit including a fuel stop at Brindisi with the
                    patient on board. Dual EURAMI and CAMTS accredited. No family seat available.
                  </p>
                </Block>

                <Block title="Considered and ruled out">
                  <p className="text-[12px] leading-relaxed text-ink-soft">
                    Challenger 604 G-NGEA, Northgate Executive Aviation. Available and suitably sized, but
                    holds no EURAMI accreditation and has no installed medical configuration. Not presented.
                    Recorded here so the shortlist is auditable.
                  </p>
                </Block>

                <Block title="Not decided by the platform" tone="flag">
                  <ol className="space-y-2">
                    {[
                      'Fitness to fly with one technical stop, for this patient today.',
                      'Which option the assistance company wants presented first, against its authorisation limit.',
                      'Written confirmation of the receiving bed before wheels up.',
                    ].map((q, i) => (
                      <li key={q} className="flex gap-2.5">
                        <span className="tnum shrink-0 text-[11.5px] font-semibold text-jade-deep">{i + 1}.</span>
                        <span className="text-[11.5px] leading-relaxed text-ink-soft">{q}</span>
                      </li>
                    ))}
                  </ol>
                </Block>

                <div className="rounded-card border border-line bg-canvas p-3.5">
                  <p className="text-[11px] leading-relaxed text-ink-faint">
                    Sourced whole of market in {MISSION.minutesToQuote} minutes against a desk median of{' '}
                    {hhmm(medianQuoteMinutes())}. {viableOptions().length} options presented of{' '}
                    {SOURCING_FUNNEL[0].count} operators screened. Prepared by {CLIENT.ai} for{' '}
                    {MISSION.clientContact}. JetSearcher is a broker and does not operate aircraft.
                  </p>
                </div>
              </div>
            </Panel>
          ) : (
            <Panel className="border-dashed">
              <p className="text-[12px] leading-relaxed text-ink-soft">
                The brief puts the excluded aircraft and the three undecided questions on the front page.
                A case manager who can see what the platform did not decide is far more likely to trust what
                it did.
              </p>
            </Panel>
          )}

          {/* One useful standing figure */}
          <Panel>
            <PanelHead eyebrow="Standing observation" title="Speed and win rate on this book" />
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-soft">
              The three clients JetSearcher quotes fastest win at {pct(CORR.fastestWin, 0)}. The three
              slowest win at {pct(CORR.slowestWin, 0)}. Six clients is not proof of anything, and the
              direction of that relationship is a question for the desk rather than for me.
            </p>
            <Button variant="quiet" size="sm" className="mt-3" onClick={() => navigate('/clients')}>
              Open client intelligence
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function Block({
  title,
  children,
  tone,
}: {
  title: string
  children: React.ReactNode
  tone?: 'flag'
}) {
  return (
    <div className={cn(tone === 'flag' && '-mx-2 rounded-card bg-jade-wash px-3 py-3')}>
      <div className="eyebrow mb-2">{title}</div>
      {children}
    </div>
  )
}
