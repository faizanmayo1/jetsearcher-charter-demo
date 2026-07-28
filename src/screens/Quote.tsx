import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileSignature, Send } from 'lucide-react'
import { AiTag, Button, Panel, PanelHead, SpecRow, Stat, Tag, cn } from '../components/ui'
import { StageSpine } from '../components/Shell'
import { useToast } from '../components/Toast'
import {
  DESTINATION,
  FEE_RATE,
  MISSION,
  ORIGIN,
  QUOTE_GROUPS,
  OPTIONS,
  byId,
  groupTotal,
  operatorCost,
  optionTotal,
  patientTransit,
  tradeoff,
  viableOptions,
} from '../data/mission'
import { CLIENT, MARKET_BAND, PUBLISHED, gbp, gbpCompact, hhmm, pct } from '../data/jetsearcher'
import { heroClient } from '../data/clients'

let sentOnce = false

export function Quote() {
  const [selected, setSelected] = useState('OPT-A')
  const [sent, setSent] = useState(sentOnce)
  const { push } = useToast()
  const navigate = useNavigate()

  const option = byId(selected)!
  const gap = tradeoff()
  const client = heroClient()
  const total = optionTotal(option)

  return (
    <div className="space-y-5">
      {/* ------------------------------- header ------------------------------- */}
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">{MISSION.id}</span>
              <Tag level="med">{MISSION.kind}</Tag>
              <Tag level="neutral">{MISSION.client}</Tag>
            </div>
            <h2 className="mt-2 font-display text-lede font-semibold text-ink">
              All-in pricing, with nothing folded into the hourly rate
            </h2>
            <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-soft">
              {client.name} itemises by policy line before it can authorise anything, so the build-up is
              the deliverable rather than a total. The JetSearcher fee is shown as its own line at{' '}
              {pct(FEE_RATE * 100, 0)} of operator cost.
            </p>
          </div>
          <div className="flex min-w-0 max-w-full shrink flex-col items-start gap-3 sm:items-end">
            <AiTag />
            <StageSpine current={sent ? 'confirm' : 'compare'} />
          </div>
        </div>
      </Panel>

      {/* --------------------------- option switcher --------------------------- */}
      <Panel>
        <PanelHead
          eyebrow="Price the option"
          title="Two viable options, priced the same way"
          sub="The excluded aircraft is priced too, so the file shows it was ruled out on accreditation rather than on cost."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setSelected(o.id)}
              className={cn(
                'rounded-card border px-3.5 py-2.5 text-left transition-all duration-200 ease-arc',
                selected === o.id
                  ? 'border-navy bg-navy text-white shadow-rail'
                  : 'border-line bg-surface hover:border-line-strong hover:bg-mist',
                o.verdict === 'excluded' && selected !== o.id && 'opacity-60',
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-semibold">{o.aircraft}</span>
                {o.verdict === 'excluded' && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-[1px] text-[9.5px] font-semibold',
                      selected === o.id ? 'bg-white/20 text-white' : 'bg-stop-tint text-stop-deep',
                    )}
                  >
                    Not presented
                  </span>
                )}
              </div>
              <div
                className={cn(
                  'tnum mt-1 text-[11.5px]',
                  selected === o.id ? 'text-white/70' : 'text-ink-faint',
                )}
              >
                {gbp(optionTotal(o))} · {hhmm(patientTransit(o))} transit
              </div>
            </button>
          ))}
        </div>
      </Panel>

      {/* ------------------------------ build-up ------------------------------ */}
      <div className="grid items-start gap-5 lg:grid-cols-[1.25fr_1fr]">
        <Panel flush>
          <div className="p-5">
            <PanelHead
              eyebrow="Build-up"
              title={`${option.aircraft} · ${option.operator}`}
              sub={`${option.registration} · ${option.category}`}
              right={
                <div className="text-right">
                  <div className="eyebrow">All-in</div>
                  <div className="tnum mt-1 font-display text-figure-sm font-semibold text-navy">
                    {gbp(total)}
                  </div>
                </div>
              }
            />
          </div>

          <div className="border-t border-line px-5 py-2">
            {QUOTE_GROUPS.map((g) => {
              const lines = option.lines.filter((l) => l.group === g)
              if (lines.length === 0) return null
              return (
                <div key={g} className="border-b border-line py-3 last:border-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="eyebrow">{g}</span>
                    <span className="tnum text-[12px] font-semibold text-ink">
                      {gbp(groupTotal(option, g))}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    {lines.map((l) => (
                      <SpecRow key={l.label} label={l.label} note={l.note} value={gbp(l.amount)} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-t border-line px-5 py-3">
            <SpecRow label="Operator cost" value={gbp(operatorCost(option))} />
            <SpecRow
              label={`JetSearcher fee, ${pct(FEE_RATE * 100, 0)}`}
              value={gbp(total - operatorCost(option))}
            />
            <SpecRow label="Total, all in" value={gbp(total)} tone="total" />
          </div>

          <div className="border-t border-line p-5">
            <p className="text-[11.5px] leading-relaxed text-ink-soft">
              Nothing is marked up inside the hourly rate and nothing is described as a surcharge without a
              line. That is what all-in pricing has to mean if a case manager is going to authorise it.
            </p>
          </div>
        </Panel>

        {/* ---------------------------- the comparison ---------------------------- */}
        <div className="space-y-5">
          <Panel>
            <PanelHead
              eyebrow="Side by side"
              title="What the cheaper option actually costs"
              sub="The two viable options differ by less than the price of the technical stop, and the difference lands on the patient rather than on the invoice."
            />
            <div className="mt-5 space-y-4">
              {viableOptions().map((o) => {
                const isFaster = o.id === gap.faster.id
                return (
                  <div
                    key={o.id}
                    className={cn(
                      'rounded-card border p-4',
                      isFaster ? 'border-navy/25 bg-navy-wash' : 'border-line bg-canvas',
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[12.5px] font-semibold text-ink">{o.aircraft}</span>
                      <span className="tnum font-display text-[19px] font-semibold text-ink">
                        {gbp(optionTotal(o))}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-ink-soft">
                      <span className="tnum">{hhmm(patientTransit(o))} patient transit</span>
                      <span>{o.techStopMin > 0 ? '1 technical stop' : 'Direct'}</span>
                      <span className="tnum">Fit {o.fitScore}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 rounded-card border border-med/25 bg-med-tint/40 p-4">
              <div className="eyebrow text-med-deep">The trade, stated plainly</div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink">
                {gap.cheaper.aircraft} saves{' '}
                <span className="tnum font-semibold text-med-deep">{gbp(gap.saving)}</span>. It also puts a
                ventilated cardiac patient in the air{' '}
                <span className="tnum font-semibold text-med-deep">{hhmm(gap.timeCost)}</span> longer, with
                a fuel stop on the ground at Brindisi in the middle of it.
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-ink-soft">
                {CLIENT.ai} presents both and says which it would rank first. It does not decide this one.
              </p>
            </div>
          </Panel>

          {/* ------------------------------ the send ------------------------------ */}
          <Panel className={cn(sent && 'border-navy/25 bg-navy-wash')}>
            <PanelHead
              eyebrow={sent ? 'Sent' : 'Ready to send'}
              title={sent ? 'Quote sent to the case manager' : 'Send both options with the working shown'}
              sub={
                sent
                  ? `Sent to ${client.contact} at ${MISSION.quotedAt}, ${MISSION.minutesToQuote} minutes after the request landed. E-sign link attached to each option.`
                  : `${PUBLISHED.promise}`
              }
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant={sent ? 'ghost' : 'primary'}
                icon={sent ? <FileSignature className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                onClick={() => {
                  sentOnce = true
                  setSent(true)
                  push({
                    kind: 'ok',
                    title: sent ? 'E-sign link resent' : 'Quote sent to Wexford Assistance',
                    body: sent
                      ? `Sent again to ${client.contact}.`
                      : `Two options, itemised by policy line, with the excluded aircraft and its reason attached to the file.`,
                  })
                }}
              >
                {sent ? 'Resend the e-sign link' : 'Send both options'}
              </Button>
              <Button variant="quiet" onClick={() => navigate('/mission')}>
                Go to coordination
              </Button>
            </div>
          </Panel>
        </div>
      </div>

      {/* -------------------------- where this sits -------------------------- */}
      {/* A price with no reference point is just a number. This is the published
          market band, with the quote placed on it. */}
      <Panel>
        <PanelHead
          eyebrow="Sense check"
          title="Where this quote sits in the market"
          sub={MARKET_BAND.note}
          right={<AiTag>Published range</AiTag>}
        />
        <div className="mt-6">
          <div className="relative h-11">
            <div className="absolute inset-x-0 top-4 h-2.5 overflow-hidden rounded-full bg-mist">
              <div className="h-full w-full bg-gradient-to-r from-navy-tint via-navy-soft to-navy-deep opacity-70" />
            </div>
            {/* The marker */}
            <div
              className="absolute top-0 -translate-x-1/2 transition-all duration-700 ease-arc"
              style={{
                left: `${Math.min(97, Math.max(3, ((total - MARKET_BAND.low) / (MARKET_BAND.high - MARKET_BAND.low)) * 100))}%`,
              }}
            >
              <div className="flex flex-col items-center">
                <span className="tnum whitespace-nowrap rounded-md bg-navy px-2 py-[3px] text-[11.5px] font-semibold text-white shadow-rail">
                  {gbp(total)}
                </span>
                <span className="mt-0.5 h-4 w-px bg-navy" />
              </div>
            </div>
          </div>
          <div className="mt-1 flex justify-between text-[11px] font-medium text-ink-faint">
            <span className="tnum">{gbpCompact(MARKET_BAND.low)}</span>
            <span className="tnum">{gbpCompact(MARKET_BAND.high)}</span>
          </div>
        </div>
        <p className="mt-4 text-[11.5px] leading-relaxed text-ink-soft">
          {CLIENT.ai} shows the band rather than asserting the quote is competitive. A case manager
          approving a five figure sum wants to know where it sits, and a broker who volunteers that
          before being asked is a different kind of supplier.
        </p>
      </Panel>

      {/* ---------------------------- route reference ---------------------------- */}
      <Panel>
        <PanelHead
          eyebrow="On the quote document"
          title="What the client sees"
          sub="Route, aircraft, accreditation, the itemised build-up, and the aircraft that was considered and ruled out. The last one is unusual and it is the reason assistance companies come back."
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Route" value={`${ORIGIN.iata} to ${DESTINATION.iata}`} note="Bed to bed" />
          <Stat label="Departs" value="14:30" note="Today, slot held" />
          <Stat label="Patient transit" value={hhmm(patientTransit(option))} tone="med" note={option.techStopMin > 0 ? 'Includes one technical stop' : 'Direct'} />
          <Stat label="All-in" value={gbp(total)} tone="navy" note={`Operator cost ${gbp(operatorCost(option))} plus fee`} />
        </div>
      </Panel>
    </div>
  )
}
