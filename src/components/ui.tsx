import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

/* ------------------------------------------------------------------ *
 * Panel. Three surfaces and they mean different things: the page is
 * porcelain, a panel is white, and the cabin is the one dark surface,
 * used for the route chart and the option board.
 * ------------------------------------------------------------------ */
export function Panel({
  children,
  className,
  flush,
  tone = 'surface',
}: {
  children: ReactNode
  className?: string
  flush?: boolean
  tone?: 'surface' | 'cabin' | 'quiet'
}) {
  const tones = {
    surface: 'rounded-card border-line bg-surface shadow-card',
    quiet: 'rounded-card border-line bg-canvas shadow-none',
    cabin: 'rounded-board cabin-ground border-cabin-line text-white shadow-cabin',
  }[tone]

  return (
    <section className={cn('min-w-0 border', tones, !flush && 'p-5', className)}>{children}</section>
  )
}

export function PanelHead({
  eyebrow,
  title,
  sub,
  right,
  className,
  onCabin,
}: {
  eyebrow?: string
  title: string
  sub?: string
  right?: ReactNode
  className?: string
  onCabin?: boolean
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && <div className={cn(onCabin ? 'eyebrow-lit' : 'eyebrow', 'mb-1.5')}>{eyebrow}</div>}
        <h2
          className={cn(
            'font-display text-[16px] font-semibold leading-tight',
            onCabin ? 'text-white' : 'text-ink',
          )}
        >
          {title}
        </h2>
        {sub && (
          <p
            className={cn(
              'mt-1.5 text-[12.5px] leading-relaxed',
              onCabin ? 'text-cabin-faint' : 'text-ink-soft',
            )}
          >
            {sub}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Tags. The status vocabulary borrows the vetting ladder the industry
 * already uses, and never uses green, so jade stays uniquely Vector's.
 * ------------------------------------------------------------------ */
export type TagLevel =
  | 'platinum'
  | 'gold'
  | 'caution'
  | 'stop'
  | 'med'
  | 'navy'
  | 'neutral'

const TAG_STYLES: Record<TagLevel, string> = {
  platinum: 'bg-platinum-tint/70 text-platinum-deep border-platinum/25',
  gold: 'bg-gold-tint/70 text-gold-deep border-gold/25',
  caution: 'bg-caution-tint/70 text-caution-deep border-caution/25',
  stop: 'bg-stop-tint/70 text-stop-deep border-stop/25',
  med: 'bg-med-tint/70 text-med-deep border-med/25',
  navy: 'bg-navy-tint/60 text-navy-deep border-navy/20',
  neutral: 'bg-mist text-ink-soft border-line',
}

export function Tag({
  children,
  level = 'neutral',
  icon,
  className,
}: {
  children: ReactNode
  level?: TagLevel
  icon?: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-[3px] text-[11px] font-medium',
        TAG_STYLES[level],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

/* Vector marker. Jade, and only ever used for AI output. */
export function AiTag({
  children = 'Vector',
  className,
  onCabin,
}: {
  children?: ReactNode
  className?: string
  onCabin?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-[3px] text-[11px] font-semibold',
        onCabin
          ? 'border-jade-lit/30 bg-jade-lit/10 text-jade-lit'
          : 'border-jade/25 bg-jade-wash text-jade-deep',
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse-soft', onCabin ? 'bg-jade-lit' : 'bg-jade')} />
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Stat. The largest size is for the two or three figures on a screen
 * that are allowed to carry it.
 * ------------------------------------------------------------------ */
export function Stat({
  label,
  value,
  unit,
  note,
  tone = 'ink',
  size = 'md',
  className,
}: {
  label: string
  value: string
  unit?: string
  note?: ReactNode
  tone?: 'ink' | 'navy' | 'jade' | 'med' | 'stop' | 'lit' | 'lit-jade' | 'lit-med'
  size?: 'md' | 'lg' | 'xl'
  className?: string
}) {
  const toneClass = {
    ink: 'text-ink',
    navy: 'text-navy',
    jade: 'text-jade-deep',
    med: 'text-med-deep',
    stop: 'text-stop-deep',
    lit: 'text-white',
    'lit-jade': 'text-jade-lit',
    'lit-med': 'text-med-lit',
  }[tone]

  const onCabin = tone.startsWith('lit')

  const sizeClass = {
    md: 'text-[26px] leading-none tracking-[-0.022em]',
    lg: 'text-figure-sm',
    xl: 'text-figure',
  }[size]

  return (
    <div className={cn('min-w-0', className)}>
      <div className={onCabin ? 'eyebrow-lit' : 'eyebrow'}>{label}</div>
      <div className={cn('flex items-baseline gap-1.5', size === 'xl' ? 'mt-2.5' : 'mt-1.5')}>
        <span className={cn('tnum font-display font-semibold', sizeClass, toneClass)}>{value}</span>
        {unit && (
          <span className={cn('text-[12px] font-medium', onCabin ? 'text-cabin-mute' : 'text-ink-faint')}>
            {unit}
          </span>
        )}
      </div>
      {note && (
        <div
          className={cn(
            'mt-1.5 text-[11.5px] leading-snug',
            onCabin ? 'text-cabin-faint' : 'text-ink-soft',
          )}
        >
          {note}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Buttons
 * ------------------------------------------------------------------ */
export function Button({
  children,
  onClick,
  variant = 'ghost',
  size = 'md',
  icon,
  className,
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ai' | 'ghost' | 'quiet' | 'cabin'
  size?: 'sm' | 'md'
  icon?: ReactNode
  className?: string
  disabled?: boolean
}) {
  const variants = {
    primary:
      'bg-navy text-white border-navy/60 shadow-crown shadow-rail hover:bg-navy-deep active:translate-y-[0.5px]',
    ai: 'bg-jade text-white border-jade/60 shadow-crown shadow-glow hover:bg-jade-deep active:translate-y-[0.5px]',
    ghost:
      'bg-surface text-ink border-line hover:border-line-strong hover:bg-mist active:translate-y-[0.5px]',
    quiet: 'bg-transparent text-ink-soft border-transparent hover:bg-mist hover:text-ink',
    cabin: 'bg-white/[0.07] text-white border-white/15 hover:bg-white/[0.13] active:translate-y-[0.5px]',
  }[variant]

  const sizes = {
    sm: 'px-2.5 py-1.5 text-[11.5px] gap-1.5',
    md: 'px-3.5 py-2 text-[12.5px] gap-2',
  }[size]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg border font-medium',
        'transition-all duration-150 ease-arc',
        'disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0',
        variants,
        sizes,
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}

/* Where a figure or a claim came from. */
export function Cite({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-line bg-mist px-1.5 py-[1px] text-[10px] font-medium text-ink-faint">
      {children}
    </span>
  )
}

/* A labelled value row, as it appears on a quote sheet. */
export function SpecRow({
  label,
  value,
  note,
  tone,
  onCabin,
}: {
  label: string
  value: ReactNode
  note?: string
  tone?: 'default' | 'total'
  onCabin?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-4 border-b py-2 last:border-0',
        onCabin ? 'border-white/10' : 'border-line',
        tone === 'total' && (onCabin ? 'border-t-2 border-t-white/25' : 'border-t-2 border-t-ink/15'),
      )}
    >
      <div className="min-w-0">
        <div
          className={cn(
            'text-[12px]',
            tone === 'total'
              ? onCabin ? 'font-semibold text-white' : 'font-semibold text-ink'
              : onCabin ? 'text-cabin-faint' : 'text-ink-soft',
          )}
        >
          {label}
        </div>
        {note && (
          <div className={cn('mt-0.5 text-[10.5px]', onCabin ? 'text-cabin-mute' : 'text-ink-faint')}>
            {note}
          </div>
        )}
      </div>
      <span
        className={cn(
          'tnum shrink-0 text-[12.5px]',
          tone === 'total' ? 'text-[13.5px] font-bold' : 'font-medium',
          onCabin ? 'text-white' : 'text-ink',
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function Meter({
  value,
  max = 100,
  tone = 'navy',
  className,
}: {
  value: number
  max?: number
  tone?: 'navy' | 'jade' | 'med' | 'caution' | 'stop'
  className?: string
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const fill = {
    navy: 'bg-navy',
    jade: 'bg-jade',
    med: 'bg-med',
    caution: 'bg-caution',
    stop: 'bg-stop',
  }[tone]

  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-mist', className)}>
      <div className={cn('h-full rounded-full transition-all duration-700 ease-arc', fill)} style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Vector's deferral card. Some calls are not a broker's to make, and
 * the ones on this mission are clinical. Vector hands them back with a
 * named owner rather than guessing.
 * ------------------------------------------------------------------ */
export function DeferTo({
  question,
  why,
  owner,
}: {
  question: string
  why: string
  owner: string
}) {
  return (
    <div className="rounded-card border border-dashed border-jade/40 bg-jade-wash p-3.5 transition-colors duration-200 hover:border-jade/70">
      <div className="text-[12.5px] font-semibold leading-snug text-ink">{question}</div>
      <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{why}</p>
      <p className="mt-1.5 text-[11.5px] font-medium leading-relaxed text-jade-deep">
        Sits with: {owner}
      </p>
    </div>
  )
}

export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-card border border-dashed border-line bg-surface/60 p-10 text-center">
      <div className="max-w-sm">
        <h3 className="font-display text-[15px] font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{note}</p>
      </div>
    </div>
  )
}
