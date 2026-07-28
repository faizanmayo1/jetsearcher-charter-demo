import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Radar, ShieldAlert, Timer, X } from 'lucide-react'
import { AiTag, Button, DeferTo, Meter, Panel, PanelHead, Stat, Tag, cn } from '../components/ui'
import { StageSpine } from '../components/Shell'
import { RouteArc } from '../components/RouteArc'
import { OptionBoard } from '../components/OptionBoard'
import { useToast } from '../components/Toast'
import {
  DEFERRALS,
  DESTINATION,
  DISTANCE_NM,
  MISSION,
  ORIGIN,
  OPTIONS,
  SOURCING_FUNNEL,
  byId,
  optionTotal,
  patientTransit,
  tradeoff,
} from '../data/mission'
import { CLIENT, gbp, hhmm, num } from '../data/jetsearcher'

/* Held outside the component so the search result survives navigation.
   The first visit gets the search reveal; coming back from the quote or
   the operator file lands on the board, not on an empty screen. */
let hasSearched = false

export function Sourcing() {
  const [searched, setSearched] = useState(hasSearched)
  const [selected, setSelected] = useState('OPT-A')
  const { push } = useToast()
  const navigate = useNavigate()

  const option = useMemo(() => byId(selected)!, [selected])
  const gap = useMemo(() => tradeoff(), [])

  const runSearch = () => {
    hasSearched = true
    setSearched(true)
    push({
      kind: 'ai',
      title: `Whole-of-market search complete in ${MISSION.minutesToQuote} minutes`,
      body: `${num(SOURCING_FUNNEL[0].count)} operators screened, ${SOURCING_FUNNEL[SOURCING_FUNNEL.length - 1].count} options presented. One aircraft was held off the board.`,
    })
  }

  return (
    <div className="space-y-5">
      {/* ------------------------------- the brief ------------------------------- */}
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">{MISSION.id}</span>
              <Tag level="med">{MISSION.kind}</Tag>
              <Tag level="stop" icon={<Timer className="h-3 w-3" />}>
                {MISSION.priority}
              </Tag>
              <span className="tnum text-[11.5px] text-ink-faint">Received {MISSION.receivedAt}</span>
            </div>
            <h2 className="mt-2 font-display text-lede font-semibold text-ink">
              {ORIGIN.city} to {DESTINATION.city}, bed to bed
            </h2>
            <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-soft">
              {MISSION.client} · {MISSION.patient.summary}. {MISSION.patient.status}. The aircraft has to
              carry a stretcher, {num(MISSION.requires.oxygenLitres)} litres of oxygen, a physician and a
              flight nurse, and the operator has to hold {MISSION.requires.accreditation} accreditation.
            </p>
          </div>
          <div className="flex min-w-0 max-w-full shrink flex-col items-start gap-3 sm:items-end">
            <AiTag />
            <StageSpine current={searched ? 'compare' : 'source'} />
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Great circle" value={num(DISTANCE_NM)} unit="nm" note={`${ORIGIN.icao} to ${DESTINATION.icao}`} />
          <Stat label="Departs" value="14:30" note="Today, slot held against the permit" />
          <Stat
            label="Time to options"
            value={`${MISSION.minutesToQuote} min`}
            tone="jade"
            note={`The desk averages ${hhmm(MISSION.deskAverageMinutes)} on a medical request`}
          />
          <Stat
            label="Clinical constraint"
            value="6,000 ft"
            tone="med"
            note="Maximum cabin altitude for this patient"
          />
        </div>
      </Panel>

      {/* ------------------------------ the search ------------------------------ */}
      {!searched ? (
        <Panel className="border-jade/25 bg-jade-wash">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="min-w-0">
              <h3 className="font-display text-[17px] font-semibold text-ink">
                Search the whole market
              </h3>
              <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-soft">
                Availability, accreditation, medical configuration, insurance dates and positioning time,
                checked together rather than one phone call at a time. {CLIENT.ai} returns what it found and
                says what it ruled out.
              </p>
            </div>
            <Button variant="ai" icon={<Radar className="h-3.5 w-3.5" />} onClick={runSearch}>
              Run whole-of-market search
            </Button>
          </div>
        </Panel>
      ) : (
        <div className="stagger space-y-5">
          {/* ---------------------------- the funnel ---------------------------- */}
          <Panel>
            <PanelHead
              eyebrow="Whole of market"
              title="From 412 operators to two options"
              sub="The narrowing is the work. Every step below is a filter a broker applies by hand today, usually by phone, usually in sequence rather than at once."
              right={<AiTag>{`${MISSION.minutesToQuote} minutes`}</AiTag>}
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {SOURCING_FUNNEL.map((s, i) => {
                const pctOfTop = (s.count / SOURCING_FUNNEL[0].count) * 100
                const last = i === SOURCING_FUNNEL.length - 1
                return (
                  <div
                    key={s.stage}
                    className={cn(
                      'rounded-card border p-3.5',
                      last ? 'border-jade/30 bg-jade-wash' : 'border-line bg-canvas',
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[11px] font-medium leading-tight text-ink-soft">{s.stage}</span>
                      <span
                        className={cn(
                          'tnum font-display text-[20px] font-semibold leading-none',
                          last ? 'text-jade-deep' : 'text-ink',
                        )}
                      >
                        {s.count}
                      </span>
                    </div>
                    <Meter value={pctOfTop} tone={last ? 'jade' : 'navy'} className="mt-2.5" />
                    <p className="mt-2 text-[10.5px] leading-snug text-ink-faint">{s.note}</p>
                  </div>
                )
              })}
            </div>
          </Panel>

          {/* --------------------------- the option board --------------------------- */}
          {/* The one dark surface. The board and the route belong together, and
              they are the thing Johann will remember. */}
          <Panel tone="cabin" flush>
            <div className="cabin-graticule rounded-board">
              <div className="p-6 lg:p-7">
                <PanelHead
                  onCabin
                  eyebrow="The option board"
                  title="Two strong options, and the one that was held back"
                  sub="JetSearcher promises up to three strong options. Up to is the operative phrase: a third option that cannot do the job is padding, and a medical assistance company will spot it."
                  right={<AiTag onCabin>Ranked by fit, then cost</AiTag>}
                />

                <div className="mt-6">
                  <OptionBoard selected={selected} onSelect={setSelected} />
                </div>

                {/* ------------------------- the selected route ------------------------- */}
                <div className="mt-7 border-t border-white/10 pt-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <div className="eyebrow-lit">Selected route</div>
                      <h3 className="mt-1 font-display text-[17px] font-semibold text-white">
                        {option.aircraft} · {option.operator}
                      </h3>
                    </div>
                    <span className="tnum font-display text-[24px] font-semibold text-jade-lit">
                      {gbp(optionTotal(option))}
                    </span>
                  </div>

                  <div className="mt-4 xscroll">
                    <RouteArc
                      origin={ORIGIN}
                      destination={DESTINATION}
                      distanceNm={DISTANCE_NM}
                      positioningMin={option.positioningMin}
                      flightMin={option.flightMin}
                      techStopMin={option.techStopMin}
                      techStopName={option.techStopMin > 0 ? 'Rome Ciampino' : undefined}
                      operatorBase={option.operatorBase}
                    />
                  </div>
                </div>

                {/* --------------------------- fit checklist --------------------------- */}
                <div className="mt-6 grid gap-5 border-t border-white/10 pt-6 lg:grid-cols-[1.1fr_1fr]">
                  <div>
                    <div className="eyebrow-lit">Requirement by requirement</div>
                    <div className="mt-3 space-y-1.5">
                      {option.fit.map((f) => (
                        <div
                          key={f.requirement}
                          className={cn(
                            'flex items-start gap-2.5 rounded-lg px-2.5 py-2',
                            f.met ? 'bg-white/[0.04]' : 'bg-med/10',
                          )}
                        >
                          <span
                            className={cn(
                              'mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                              f.met ? 'bg-white/15 text-white' : 'bg-med/30 text-med-lit',
                            )}
                          >
                            {f.met ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                          </span>
                          <div className="min-w-0">
                            <div className={cn('text-[12px] font-medium', f.met ? 'text-white' : 'text-med-lit')}>
                              {f.requirement}
                            </div>
                            <div className="mt-0.5 text-[11px] leading-snug text-cabin-mute">{f.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {option.verdict === 'excluded' ? (
                      <div className="rounded-card border border-med/40 bg-med/10 p-4">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4 text-med-lit" />
                          <span className="eyebrow-lit text-med-lit">Held off the board</span>
                        </div>
                        <p className="mt-2.5 text-[12.5px] leading-relaxed text-white">
                          {option.excludedBecause}
                        </p>
                        <p className="mt-2.5 text-[11.5px] leading-relaxed text-cabin-faint">
                          {option.tradeoff}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-card border border-white/12 bg-white/[0.05] p-4">
                        <div className="eyebrow-lit">The trade</div>
                        <p className="mt-2 text-[12.5px] leading-relaxed text-white">{option.tradeoff}</p>
                      </div>
                    )}

                    {/* The commercial and clinical gap, in one line */}
                    <div className="rounded-card border border-jade-lit/25 bg-jade-lit/[0.07] p-4">
                      <div className="eyebrow-lit text-jade-lit">The decision in one line</div>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-white">
                        {gap.cheaper.aircraft} saves{' '}
                        <span className="tnum font-semibold text-jade-lit">{gbp(gap.saving)}</span> and costs
                        the patient{' '}
                        <span className="tnum font-semibold text-med-lit">{hhmm(gap.timeCost)}</span> more in
                        transit, including a fuel stop with the patient on board.
                      </p>
                      <p className="mt-2 text-[11.5px] leading-relaxed text-cabin-faint">
                        {CLIENT.ai} ranks on fit and cost. Whether that trade is acceptable for this patient
                        is a clinical call, and it is not the platform&rsquo;s to make.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="cabin"
                        size="sm"
                        onClick={() => navigate('/operators')}
                      >
                        Open the operator file
                      </Button>
                      <Button
                        variant="ai"
                        size="sm"
                        icon={<ArrowRight className="h-3.5 w-3.5" />}
                        onClick={() => navigate('/quote')}
                      >
                        Build the client quote
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* ------------------------- what Vector defers ------------------------- */}
          <Panel>
            <PanelHead
              eyebrow="Handed back"
              title={`Three calls ${CLIENT.ai} will not make`}
              sub="A sourcing engine can rank aircraft. It cannot decide whether a patient is fit to fly, what a payer has authorised, or whether a bed is genuinely held. Each of these goes back with a named owner."
              right={<Tag level="med">{DEFERRALS.length} open</Tag>}
            />
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {DEFERRALS.map((d) => (
                <DeferTo key={d.question} question={d.question} why={d.why} owner={d.owner} />
              ))}
            </div>
          </Panel>

          {/* ---------------------------- all options ---------------------------- */}
          <Panel flush>
            <div className="p-5">
              <PanelHead
                eyebrow="For the file"
                title="Everything the search returned"
                sub="Including the aircraft that was ruled out, with the reason recorded. An assistance company auditing this trip later can see the whole shortlist, not just what was sold."
              />
            </div>
            <div className="xscroll border-t border-line">
              <table className="w-full min-w-[860px] border-collapse">
                <thead>
                  <tr className="border-b border-line bg-mist">
                    {['Aircraft', 'Operator', 'Vetting', 'Medical', 'Transit', 'All-in', 'Outcome'].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-faint',
                          i >= 4 && i <= 5 ? 'text-right' : 'text-left',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OPTIONS.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelected(o.id)}
                      className={cn(
                        'cursor-pointer border-b border-line last:border-0 transition-colors',
                        selected === o.id ? 'bg-navy-wash' : 'hover:bg-mist',
                        o.verdict === 'excluded' && 'opacity-70',
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="text-[12.5px] font-semibold text-ink">{o.aircraft}</div>
                        <div className="tnum mt-0.5 text-[11px] text-ink-faint">{o.registration}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[12px] text-ink">{o.operator}</div>
                        <div className="mt-0.5 text-[11px] text-ink-faint">{o.operatorBase}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {o.ratings.map((r) => (
                            <Tag key={r} level={r.includes('Platinum') ? 'platinum' : 'gold'}>
                              {r}
                            </Tag>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Tag level={o.eurami ? 'navy' : 'stop'}>
                          {o.eurami ? 'EURAMI' : 'Not accredited'}
                        </Tag>
                      </td>
                      <td className="tnum whitespace-nowrap px-4 py-3 text-right text-[12.5px] text-ink">
                        {hhmm(patientTransit(o))}
                      </td>
                      <td className="tnum whitespace-nowrap px-4 py-3 text-right text-[12.5px] font-medium text-ink">
                        {gbp(optionTotal(o))}
                      </td>
                      <td className="px-4 py-3">
                        <Tag
                          level={
                            o.verdict === 'best' ? 'navy' : o.verdict === 'excluded' ? 'stop' : 'neutral'
                          }
                        >
                          {o.verdict === 'best'
                            ? 'Presented, ranked first'
                            : o.verdict === 'viable'
                              ? 'Presented'
                              : 'Held off the board'}
                        </Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}
