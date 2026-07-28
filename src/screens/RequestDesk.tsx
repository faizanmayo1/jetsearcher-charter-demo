import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, Timer, TrendingDown } from 'lucide-react'
import { AiTag, Button, Panel, PanelHead, Stat, Tag, cn } from '../components/ui'
import { StageSpine } from '../components/Shell'
import {
  KIND_TONE,
  LOST_TO_SPEED,
  REQUESTS,
  atRisk,

  medianQuoteMinutes,
  openRequests,
  pipelineValue,
  wonValue,
  type ChartRequest,
} from '../data/requests'
import { CLIENT, PUBLISHED, elapsed, gbp, gbpCompact, hhmm } from '../data/jetsearcher'
import { HERO_ID, MISSION } from '../data/mission'

const STATE_TONE = {
  Unquoted: 'stop',
  Sourcing: 'caution',
  Quoted: 'navy',
  Confirmed: 'platinum',
  Lost: 'neutral',
} as const

export function RequestDesk() {
  const navigate = useNavigate()
  const median = medianQuoteMinutes()
  const waiting = atRisk()[0]

  return (
    <div className="space-y-5">
      {/* --------------------------- the standing alert --------------------------- */}
      {/* The desk's thesis in one figure: a medical request nobody has picked
          up, with the clock running. */}
      <Panel className="border-stop/25 bg-stop-tint/40">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-10">
          <div className="lg:border-r lg:border-stop/20 lg:pr-10">
            <div className="flex items-center gap-2">
              <Timer className="h-3.5 w-3.5 shrink-0 text-stop animate-tick" />
              <span className="eyebrow text-stop-deep">Unquoted, clock running</span>
            </div>
            <div className="tnum mt-3 font-display text-figure font-semibold text-stop-deep">
              {elapsed(waiting.ageMin)}
            </div>
            <div className="mt-2.5 text-[12.5px] font-medium leading-snug text-ink-soft">
              since {waiting.id} landed, and nobody has picked it up
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div>
              <h2 className="font-display text-lede font-semibold text-ink">
                {waiting.route}, stretcher case
              </h2>
              <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-ink-soft">
                {waiting.client} · {waiting.pax} · departs {waiting.departs}. {waiting.note} An assistance
                company that does not hear back inside the hour will have asked someone else, and on this
                book the trip is usually gone by then.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                icon={<ArrowRight className="h-3.5 w-3.5" />}
                onClick={() => navigate('/sourcing')}
              >
                Source this now
              </Button>
              <span className="text-[11.5px] text-ink-faint">
                {openRequests().length} requests open across the desk
              </span>
            </div>
          </div>
        </div>
      </Panel>

      {/* -------------------------------- the desk -------------------------------- */}
      <div className="grid items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Panel>
          <PanelHead
            eyebrow={CLIENT.legal}
            title="The desk this morning"
            sub={`${PUBLISHED.model} ${PUBLISHED.yearsBroking} years broking, ${PUBLISHED.missions} missions flown.`}
            right={<AiTag />}
          />
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
            <Stat label="Open requests" value={`${openRequests().length}`} note="Unquoted or sourcing" />
            <Stat
              label="Median time to options"
              value={hhmm(median)}
              tone="stop"
              note="Across everything quoted on this board"
            />
            <Stat label="Quoted, awaiting decision" value={gbpCompact(pipelineValue())} tone="navy" note="Three requests" />
            <Stat label="Confirmed this week" value={gbpCompact(wonValue())} note="Two missions" />
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <div className="eyebrow mb-3">Where the live mission has got to</div>
            <StageSpine current="compare" />
          </div>
        </Panel>

        {/* ----------------------------- the speed case ----------------------------- */}
        <Panel>
          <PanelHead
            eyebrow="Why the clock matters"
            title="The trip that went elsewhere"
            sub="Speed is not a nice-to-have on a charter desk. It is most of the win rate."
          />

          <div className="mt-4 rounded-card border border-line bg-canvas p-4">
            <div className="flex items-start gap-3">
              <TrendingDown className="mt-[2px] h-4 w-4 shrink-0 text-stop" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[12.5px] font-semibold text-ink">{LOST_TO_SPEED.id}</span>
                  <Tag level="neutral">Lost</Tag>
                </div>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-soft">{LOST_TO_SPEED.note}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="tnum font-display text-[22px] font-semibold text-ink">
                  {gbpCompact(LOST_TO_SPEED.value)}
                </div>
                <div className="text-[10px] text-ink-faint">value</div>
              </div>
            </div>
          </div>

          {/* The comparison that carries the pitch */}
          <div className="mt-4 space-y-3">
            <SpeedBar label="Slowest quote on the board" minutes={LOST_TO_SPEED.quotedInMin} max={LOST_TO_SPEED.quotedInMin} tone="stop" />
            <SpeedBar label="Desk median" minutes={median} max={LOST_TO_SPEED.quotedInMin} tone="caution" />
            <SpeedBar
              label={`${CLIENT.ai} on the live medical request`}
              minutes={MISSION.minutesToQuote}
              max={LOST_TO_SPEED.quotedInMin}
              tone="jade"
            />
          </div>

          <p className="mt-4 text-[11.5px] leading-relaxed text-ink-soft">
            {CLIENT.ai} did not fly anything faster. It removed the part of the process that is phone calls
            and spreadsheets, which on a medical request is most of it.
          </p>
        </Panel>
      </div>

      {/* -------------------------------- the queue -------------------------------- */}
      <Panel flush>
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <PanelHead
            eyebrow="Live queue"
            title="Every request on the desk"
            sub="Sorted by how long it has been waiting. The clock column is the one that decides whether a request becomes a trip."
          />
          <Button variant="ghost" size="sm" onClick={() => navigate('/sourcing')}>
            Open the medical repatriation
          </Button>
        </div>

        <div className="xscroll border-t border-line">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="border-b border-line bg-mist">
                {['Request', 'Route', 'Client', 'Departs', 'State', 'Time to options', 'Value', 'Owner'].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-faint',
                        i >= 5 && i <= 6 ? 'text-right' : 'text-left',
                      )}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {[...REQUESTS]
                .sort((a, b) => a.ageMin - b.ageMin)
                .map((r) => (
                  <Row
                    key={r.id}
                    request={r}
                    onOpen={() => navigate(r.id === HERO_ID ? '/sourcing' : '/sourcing')}
                  />
                ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-line p-5">
          <p className="text-[11.5px] leading-relaxed text-ink-soft">
            {PUBLISHED.promise} {CLIENT.ai} does the sourcing and the checking. The desk still decides what
            gets presented and to whom.
          </p>
        </div>
      </Panel>
    </div>
  )
}

function SpeedBar({
  label,
  minutes,
  max,
  tone,
}: {
  label: string
  minutes: number
  max: number
  tone: 'stop' | 'caution' | 'jade'
}) {
  const pct = Math.max(1.5, (minutes / max) * 100)
  const fill = { stop: 'bg-stop', caution: 'bg-caution', jade: 'bg-jade' }[tone]
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11.5px] font-medium text-ink-soft">{label}</span>
        <span className={cn('tnum text-[12px] font-semibold', tone === 'jade' ? 'text-jade-deep' : 'text-ink')}>
          {hhmm(minutes)}
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-mist">
        <div className={cn('h-full rounded-full transition-all duration-700 ease-arc', fill)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Row({ request: r, onOpen }: { request: ChartRequest; onOpen: () => void }) {
  return (
    <tr
      className="cursor-pointer border-b border-line last:border-0 transition-colors hover:bg-navy-wash"
      onClick={onOpen}
    >
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12.5px] font-semibold text-ink">{r.id}</span>
          {r.id === HERO_ID && <Tag level="med">Live</Tag>}
        </div>
        <div className="mt-1">
          <Tag level={KIND_TONE[r.kind]}>{r.kind}</Tag>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-[12px] text-ink">{r.route}</div>
        <div className="mt-0.5 text-[11px] text-ink-faint">{r.pax}</div>
      </td>
      <td className="px-4 py-3 text-[12px] text-ink-soft">{r.client}</td>
      <td className="whitespace-nowrap px-4 py-3 text-[12px] text-ink-soft">{r.departs}</td>
      <td className="px-4 py-3">
        <Tag level={STATE_TONE[r.state]}>{r.state}</Tag>
      </td>
      <td className="px-4 py-3 text-right">
        {r.quotedInMin !== undefined ? (
          <span
            className={cn(
              'tnum whitespace-nowrap text-[12.5px] font-medium',
              r.quotedInMin <= 10 ? 'text-jade-deep' : r.quotedInMin > 180 ? 'text-stop-deep' : 'text-ink',
            )}
          >
            {hhmm(r.quotedInMin)}
          </span>
        ) : (
          <span className="tnum inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium text-stop-deep">
            <Clock className="h-3 w-3 animate-tick" />
            {elapsed(r.ageMin)}
          </span>
        )}
      </td>
      <td className="tnum whitespace-nowrap px-4 py-3 text-right text-[12.5px] text-ink">
        {r.value ? gbp(r.value) : 'Not quoted'}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-[12px] text-ink-soft">{r.owner}</td>
    </tr>
  )
}
