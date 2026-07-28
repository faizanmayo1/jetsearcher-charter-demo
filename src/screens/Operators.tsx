import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileCheck2, ShieldAlert, ShieldCheck } from 'lucide-react'
import { AiTag, Button, Meter, Panel, PanelHead, Stat, Tag, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import {
  DOC_LABEL,
  DOC_TONE,
  OPERATORS,
  VETTING_NOTE,
  aeromedicalApproved,
  approvedOperators,
  documentIssues,
  onHold,
  totalAircraft,

} from '../data/operators'
import { CLIENT, num, pct } from '../data/jetsearcher'

export function Operators() {
  const [selected, setSelected] = useState(OPERATORS[0].id)
  const { push } = useToast()
  const navigate = useNavigate()
  const operator = OPERATORS.find((o) => o.id === selected)!
  const issues = documentIssues()
  const held = onHold()[0]

  return (
    <div className="space-y-5">
      {/* ------------------------------- headline ------------------------------- */}
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="eyebrow">Operator vetting</div>
            <h2 className="mt-1.5 max-w-2xl font-display text-lede font-semibold text-ink">
              The part of broking the client never sees and never forgives
            </h2>
            <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-ink-soft">{VETTING_NOTE}</p>
          </div>
          <AiTag />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 border-t border-line pt-5 sm:grid-cols-4">
          <Stat label="Operators on file" value={`${OPERATORS.length}`} note={`${num(totalAircraft())} aircraft`} />
          <Stat label="Approved" value={`${approvedOperators().length}`} tone="navy" note="No conditions attached" />
          <Stat
            label="Aeromedical capable"
            value={`${aeromedicalApproved().length}`}
            tone="med"
            note="EURAMI accredited"
          />
          <Stat
            label="Documents needing action"
            value={`${issues.length}`}
            tone="stop"
            note="Expired, expiring or not held"
          />
        </div>
      </Panel>

      {/* ------------------------ the one that got pulled ------------------------ */}
      <Panel className="border-stop/25 bg-stop-tint/40">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <ShieldAlert className="mt-[2px] h-5 w-5 shrink-0 text-stop" />
            <div className="min-w-0">
              <h3 className="font-display text-[16px] font-semibold text-ink">
                {held.name} was pulled from sourcing this morning
              </h3>
              <p className="mt-1.5 max-w-3xl text-[12.5px] leading-relaxed text-ink-soft">{held.note}</p>
              <p className="mt-2 max-w-3xl text-[11.5px] leading-relaxed text-ink-faint">
                They have three aircraft and JetSearcher has placed seven missions with them. None of that
                matters for the next fourteen days. This is exactly the check that gets skipped when a desk
                is quoting against a clock.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelected(held.id)}>
            Open their file
          </Button>
        </div>
      </Panel>

      {/* -------------------------------- the list -------------------------------- */}
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.15fr]">
        <Panel flush>
          <div className="p-5">
            <PanelHead
              eyebrow="Network"
              title="Approved operators"
              sub="Vetting status, not marketing. An operator can be excellent and still be unusable this week."
            />
          </div>
          <div className="border-t border-line">
            {OPERATORS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setSelected(o.id)}
                className={cn(
                  'flex w-full items-start justify-between gap-4 border-b border-line px-5 py-3.5 text-left transition-colors last:border-0',
                  selected === o.id ? 'bg-navy-wash' : 'hover:bg-mist',
                )}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12.5px] font-semibold text-ink">{o.name}</span>
                    <Tag
                      level={
                        o.status === 'Approved' ? 'platinum' : o.status === 'On hold' ? 'stop' : 'caution'
                      }
                    >
                      {o.status}
                    </Tag>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-ink-faint">
                    <span>
                      {o.base}, {o.country}
                    </span>
                    <span className="tnum">{o.aircraft} aircraft</span>
                    <span className="tnum">{o.missionsPlaced} missions placed</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {o.argus && <Tag level={o.argus === 'Platinum' ? 'platinum' : 'gold'}>{`ARGUS ${o.argus}`}</Tag>}
                    {o.wyvern && <Tag level="platinum">Wyvern Wingman</Tag>}
                    {o.eurami && <Tag level="med">EURAMI</Tag>}
                    {o.camts && <Tag level="med">CAMTS</Tag>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="tnum font-display text-[17px] font-semibold text-ink">
                    {pct(o.onTimeRate)}
                  </div>
                  <div className="text-[10px] text-ink-faint">on time</div>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        {/* ------------------------------ the file ------------------------------ */}
        <Panel>
          <PanelHead
            eyebrow={`${operator.base}, ${operator.country}`}
            title={operator.name}
            sub={`${operator.aircraft} aircraft · ${operator.missionsPlaced} missions placed by JetSearcher · last audit ${operator.lastAudit}`}
            right={
              <Tag
                level={
                  operator.status === 'Approved'
                    ? 'platinum'
                    : operator.status === 'On hold'
                      ? 'stop'
                      : 'caution'
                }
              >
                {operator.status}
              </Tag>
            }
          />

          {operator.note && (
            <div className="mt-4 rounded-card border border-caution/30 bg-caution-tint/40 p-3.5">
              <p className="text-[11.5px] leading-relaxed text-ink-soft">{operator.note}</p>
            </div>
          )}

          <div className="mt-5">
            <div className="eyebrow mb-2">On-time performance</div>
            <div className="flex items-center gap-3">
              <Meter value={operator.onTimeRate} tone={operator.onTimeRate >= 95 ? 'navy' : 'caution'} />
              <span className="tnum shrink-0 text-[12.5px] font-semibold text-ink">
                {pct(operator.onTimeRate)}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-ink-faint">
              Measured on missions JetSearcher placed, not on the operator&rsquo;s own reporting.
            </p>
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <div className="eyebrow mb-3">Documents on file</div>
            <div className="space-y-2">
              {operator.docs.map((d) => (
                <div
                  key={d.name}
                  className={cn(
                    'flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5',
                    d.state === 'current' ? 'border-line bg-canvas' : 'border-stop/25 bg-stop-tint/30',
                  )}
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    {d.state === 'current' ? (
                      <ShieldCheck className="mt-[1px] h-4 w-4 shrink-0 text-platinum" />
                    ) : (
                      <ShieldAlert className="mt-[1px] h-4 w-4 shrink-0 text-stop" />
                    )}
                    <div className="min-w-0">
                      <div className="text-[12px] font-medium text-ink">{d.name}</div>
                      <div className="mt-0.5 text-[11px] text-ink-soft">{d.detail}</div>
                    </div>
                  </div>
                  <Tag level={DOC_TONE[d.state]}>{DOC_LABEL[d.state]}</Tag>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
            <Button
              variant="ghost"
              size="sm"
              icon={<FileCheck2 className="h-3.5 w-3.5" />}
              onClick={() =>
                push({
                  kind: 'ok',
                  title: `Compliance pack assembled for ${operator.name}`,
                  body: 'Certificate, insurance, accreditation and audit dates in one document, ready to send to the assistance company.',
                })
              }
            >
              Build the compliance pack
            </Button>
            <Button variant="quiet" size="sm" onClick={() => navigate('/sourcing')}>
              Back to the option board
            </Button>
          </div>
        </Panel>
      </div>

      {/* --------------------------- what Vector watches --------------------------- */}
      <Panel>
        <PanelHead
          eyebrow="Standing watch"
          title={`What ${CLIENT.ai} checks before an aircraft reaches a board`}
          sub="These run on every operator, every night, and on every request at the moment of sourcing."
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: 'Air operator certificate', v: 'Valid, and valid for the region being flown' },
            { k: 'Insurance certificate', v: 'In date, with limits appropriate to the mission' },
            { k: 'Third party safety rating', v: 'ARGUS or Wyvern, with the audit date attached' },
            { k: 'Aeromedical accreditation', v: 'EURAMI or CAMTS, checked only where a patient is aboard' },
          ].map((c) => (
            <div key={c.k} className="rounded-card border border-line bg-canvas p-3.5">
              <div className="text-[12px] font-semibold text-ink">{c.k}</div>
              <p className="mt-1 text-[11px] leading-snug text-ink-soft">{c.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11.5px] leading-relaxed text-ink-faint">
          A rating is a snapshot of an audit on a date, not a guarantee about a flight next Tuesday.{' '}
          {CLIENT.ai} shows the date alongside the rating for exactly that reason, and will not present a
          rating without one.
        </p>
      </Panel>
    </div>
  )
}
