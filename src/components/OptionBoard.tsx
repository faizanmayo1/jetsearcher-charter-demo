import { Check, X, Plane, ShieldCheck, Clock } from 'lucide-react'
import { OPTIONS, optionTotal, patientTransit, type Option } from '../data/mission'
import { gbp, hhmm } from '../data/jetsearcher'
import { cn } from './ui'

/* ------------------------------------------------------------------ *
 * The option board. The second signature, and the one JetSearcher
 * effectively specified themselves: their published promise is "up to
 * three strong options".
 *
 * The word that matters is UP TO. Three options where one cannot do the
 * job is two options and a piece of padding, and a medical assistance
 * company will notice. So the board shows what Vector found, and holds
 * the unusable one off the board with the reason on its face.
 * ------------------------------------------------------------------ */

const VERDICT = {
  best: { label: 'Best fit', cls: 'bg-jade-lit text-cabin', border: 'border-jade-lit/50' },
  viable: { label: 'Viable', cls: 'bg-white/15 text-white', border: 'border-white/20' },
  excluded: { label: 'Held off the board', cls: 'bg-med/25 text-med-lit', border: 'border-med/40' },
} as const

export function OptionBoard({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid gap-3.5 md:grid-cols-3">
      {OPTIONS.map((o) => (
        <OptionCard key={o.id} option={o} active={o.id === selected} onSelect={() => onSelect(o.id)} />
      ))}
    </div>
  )
}

function OptionCard({
  option: o,
  active,
  onSelect,
}: {
  option: Option
  active: boolean
  onSelect: () => void
}) {
  const v = VERDICT[o.verdict]
  const total = optionTotal(o)
  const excluded = o.verdict === 'excluded'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group flex flex-col rounded-card border p-4 text-left transition-all duration-200 ease-arc',
        excluded ? 'border-med/25 bg-white/[0.02]' : 'border-white/12 bg-white/[0.05]',
        active && !excluded && 'border-jade-lit/60 bg-white/[0.09] shadow-glow',
        active && excluded && 'border-med/50 bg-med/[0.08]',
        !active && 'hover:bg-white/[0.08]',
      )}
    >
      {/* Verdict banner */}
      <div className="flex items-center justify-between gap-2">
        <span className={cn('rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold', v.cls)}>
          {v.label}
        </span>
        <span className="tnum text-[10.5px] font-medium text-cabin-mute">
          {excluded ? 'not presented' : `option ${o.rank}`}
        </span>
      </div>

      {/* Aircraft */}
      <div className="mt-3.5">
        <div className={cn('font-display text-[17px] font-semibold leading-tight', excluded ? 'text-cabin-faint' : 'text-white')}>
          {o.aircraft}
        </div>
        <div className="tnum mt-1 text-[11px] text-cabin-mute">
          {o.registration} · {o.category}
        </div>
      </div>

      {/* Operator and vetting */}
      <div className="mt-3 border-t border-white/10 pt-3">
        <div className="text-[12px] font-medium text-cabin-faint">{o.operator}</div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {o.ratings.map((r) => (
            <span
              key={r}
              className="rounded border border-white/15 bg-white/[0.06] px-1.5 py-[1px] text-[9.5px] font-semibold text-cabin-faint"
            >
              {r}
            </span>
          ))}
          <span
            className={cn(
              'rounded border px-1.5 py-[1px] text-[9.5px] font-semibold',
              o.eurami
                ? 'border-white/15 bg-white/[0.06] text-cabin-faint'
                : 'border-med/40 bg-med/15 text-med-lit',
            )}
          >
            {o.eurami ? 'EURAMI' : 'No EURAMI'}
          </span>
        </div>
      </div>

      {/* The three numbers that decide it */}
      <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
        <Metric
          icon={<Clock className="h-3 w-3" />}
          label="Transit"
          value={hhmm(patientTransit(o))}
          tone={o.techStopMin > 0 ? 'warn' : 'plain'}
        />
        <Metric
          icon={<ShieldCheck className="h-3 w-3" />}
          label="Fit"
          value={`${o.fitScore}`}
          tone={o.fitScore >= 90 ? 'good' : o.fitScore >= 60 ? 'plain' : 'warn'}
        />
        <Metric
          icon={<Plane className="h-3 w-3" />}
          label="Stops"
          value={o.techStopMin > 0 ? '1' : 'Direct'}
          tone={o.techStopMin > 0 ? 'warn' : 'plain'}
        />
      </div>

      {/* Price */}
      <div className="mt-auto pt-4">
        <div className="eyebrow-lit">All-in</div>
        <div
          className={cn(
            'tnum mt-1 font-display text-[26px] font-semibold leading-none',
            excluded ? 'text-cabin-mute line-through' : active ? 'text-jade-lit' : 'text-white',
          )}
        >
          {gbp(total)}
        </div>
        <p className="mt-2 text-[11px] leading-snug text-cabin-mute">{o.headline}</p>
      </div>

      {/* Fit checklist, compact */}
      <div className="mt-3 flex flex-wrap gap-1 border-t border-white/10 pt-3">
        {o.fit.map((f) => (
          <span
            key={f.requirement}
            title={`${f.requirement}: ${f.detail}`}
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded-full',
              f.met ? 'bg-white/12 text-cabin-faint' : 'bg-med/25 text-med-lit',
            )}
          >
            {f.met ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
          </span>
        ))}
        <span className="tnum ml-1 text-[10px] text-cabin-mute">
          {o.fit.filter((f) => f.met).length} of {o.fit.length} met
        </span>
      </div>
    </button>
  )
}

function Metric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: 'good' | 'plain' | 'warn'
}) {
  const colour = { good: 'text-jade-lit', plain: 'text-white', warn: 'text-med-lit' }[tone]
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-cabin-mute">
        {icon}
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.08em]">{label}</span>
      </div>
      <div className={cn('tnum mt-1 whitespace-nowrap text-[12.5px] font-semibold', colour)}>{value}</div>
    </div>
  )
}
