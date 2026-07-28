import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, TrendingDown } from 'lucide-react'
import { AiTag, Button, Meter, Panel, PanelHead, Stat, Tag, cn } from '../components/ui'
import {
  CLIENTS,
  CORRELATION_CAVEAT,
  atRiskClients,
  speedVersusWin,
  totalLifetimeValue,
  totalMissions,

} from '../data/clients'
import { CLIENT, gbpCompact, hhmm, num, pct } from '../data/jetsearcher'

export function Clients() {
  const [selected, setSelected] = useState(CLIENTS[0].id)
  const navigate = useNavigate()
  const client = CLIENTS.find((c) => c.id === selected)!
  const corr = speedVersusWin()

  return (
    <div className="space-y-5">
      {/* ------------------------------- headline ------------------------------- */}
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="eyebrow">Client intelligence</div>
            <h2 className="mt-1.5 max-w-2xl font-display text-lede font-semibold text-ink">
              The knowledge that currently lives in one person&rsquo;s head
            </h2>
            <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-ink-soft">
              Anyone can source an aircraft. Knowing that this family office will not fly without a full
              galley, and that this assistance company cannot authorise an invoice unless it is split by
              policy line, is the part that is hard to replace. Every preference below carries where it was
              learned.
            </p>
          </div>
          <AiTag />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 border-t border-line pt-5 sm:grid-cols-4">
          <Stat label="Clients on the book" value={`${CLIENTS.length}`} />
          <Stat label="Missions flown" value={num(totalMissions())} note="Across all segments" />
          <Stat label="Lifetime value" value={gbpCompact(totalLifetimeValue())} tone="navy" />
          <Stat
            label="Showing a pattern worth acting on"
            value={`${atRiskClients().length}`}
            tone="stop"
            note="Win rate falling as quote time rises"
          />
        </div>
      </Panel>

      {/* --------------------------- the correlation --------------------------- */}
      <Panel>
        <PanelHead
          eyebrow="The pattern"
          title="Faster quotes and higher win rates travel together on this book"
          sub="Not a claim about causation. A comparison of the three fastest and three slowest, drawn from the rows below."
          right={<AiTag>{`${CLIENTS.length} clients`}</AiTag>}
        />

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-card border border-jade/25 bg-jade-wash p-4">
            <div className="eyebrow text-jade-deep">Three fastest to quote</div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="tnum font-display text-figure-sm font-semibold text-jade-deep">
                {pct(corr.fastestWin, 0)}
              </span>
              <span className="text-[12px] leading-tight text-ink-soft">
                average win rate
                <br />
                at {hhmm(corr.fastestAvgMin)} to options
              </span>
            </div>
            <div className="mt-3 text-[11.5px] leading-relaxed text-ink-soft">
              {corr.fastestNames.join(', ')}
            </div>
          </div>

          <div className="rounded-card border border-stop/25 bg-stop-tint/40 p-4">
            <div className="eyebrow text-stop-deep">Three slowest to quote</div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="tnum font-display text-figure-sm font-semibold text-stop-deep">
                {pct(corr.slowestWin, 0)}
              </span>
              <span className="text-[12px] leading-tight text-ink-soft">
                average win rate
                <br />
                at {hhmm(corr.slowestAvgMin)} to options
              </span>
            </div>
            <div className="mt-3 text-[11.5px] leading-relaxed text-ink-soft">
              {corr.slowestNames.join(', ')}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-card border border-jade/30 bg-jade-wash p-3.5">
          <Info className="mt-[2px] h-4 w-4 shrink-0 text-jade" />
          <p className="text-[11.5px] leading-relaxed text-ink-soft">{CORRELATION_CAVEAT}</p>
        </div>
      </Panel>

      {/* -------------------------------- the book -------------------------------- */}
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.2fr]">
        <Panel flush>
          <div className="p-5">
            <PanelHead eyebrow="The book" title="Clients by lifetime value" />
          </div>
          <div className="border-t border-line">
            {[...CLIENTS]
              .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    'flex w-full items-start justify-between gap-4 border-b border-line px-5 py-3.5 text-left transition-colors last:border-0',
                    selected === c.id ? 'bg-navy-wash' : 'hover:bg-mist',
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[12.5px] font-semibold text-ink">{c.name}</span>
                      {c.risk && <Tag level="stop">Slipping</Tag>}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-ink-faint">
                      <span>{c.segment}</span>
                      <span className="tnum">{c.missions} missions</span>
                      <span className="tnum">since {c.since}</span>
                    </div>
                    <div className="mt-2 flex max-w-[240px] items-center gap-2.5">
                      <Meter value={c.winRate} tone={c.winRate >= 70 ? 'navy' : c.winRate >= 55 ? 'caution' : 'stop'} />
                      <span className="tnum shrink-0 text-[11px] font-semibold text-ink">
                        {pct(c.winRate, 0)}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="tnum font-display text-[17px] font-semibold text-ink">
                      {gbpCompact(c.lifetimeValue)}
                    </div>
                    <div className="tnum mt-0.5 text-[10px] text-ink-faint">{hhmm(c.avgQuoteMin)} to quote</div>
                  </div>
                </button>
              ))}
          </div>
        </Panel>

        {/* ------------------------------ the record ------------------------------ */}
        <Panel>
          <PanelHead
            eyebrow={client.segment}
            title={client.name}
            sub={`${client.contact}, ${client.contactRole} · client since ${client.since}`}
            right={
              <div className="text-right">
                <div className="eyebrow">Win rate</div>
                <div className="tnum mt-1 font-display text-[22px] font-semibold text-ink">
                  {pct(client.winRate, 0)}
                </div>
              </div>
            }
          />

          {client.risk && (
            <div className="mt-4 flex items-start gap-2.5 rounded-card border border-stop/25 bg-stop-tint/40 p-3.5">
              <TrendingDown className="mt-[2px] h-4 w-4 shrink-0 text-stop" />
              <p className="text-[11.5px] leading-relaxed text-ink-soft">{client.risk}</p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-3 gap-4 border-t border-line pt-4">
            <Stat label="Missions" value={`${client.missions}`} />
            <Stat label="Lifetime" value={gbpCompact(client.lifetimeValue)} tone="navy" />
            <Stat label="Avg to quote" value={hhmm(client.avgQuoteMin)} tone={client.avgQuoteMin > 90 ? 'stop' : 'ink'} />
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <div className="eyebrow mb-3">What we know, and how we know it</div>
            <div className="space-y-2.5">
              {client.preferences.map((p) => (
                <div key={p.label} className="rounded-card border border-line bg-canvas p-3.5">
                  <div className="text-[12px] font-semibold text-ink">{p.label}</div>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{p.detail}</p>
                  <p className="mt-1.5 text-[10.5px] text-ink-faint">Learned from: {p.source}</p>
                </div>
              ))}
            </div>
          </div>

          {client.pattern && (
            <div className="mt-4 rounded-card border border-navy/20 bg-navy-wash p-3.5">
              <div className="eyebrow text-navy">Booking pattern</div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-soft">{client.pattern}</p>
            </div>
          )}

          <div className="mt-4 border-t border-line pt-4">
            <Button variant="quiet" size="sm" onClick={() => navigate('/sourcing')}>
              Source against these preferences
            </Button>
          </div>
        </Panel>
      </div>

      <Panel>
        <p className="text-[11.5px] leading-relaxed text-ink-soft">
          {CLIENT.ai} does not invent preferences. Every line above traces to a declined quote, a booking
          note or a recorded conversation, and the source is shown with it. A preference the platform cannot
          evidence is a preference it will not assert.
        </p>
      </Panel>
    </div>
  )
}
