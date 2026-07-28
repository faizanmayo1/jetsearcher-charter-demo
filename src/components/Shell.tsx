import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Command as CommandIcon, Search } from 'lucide-react'
import { cn } from './ui'
import { CommandPalette } from './CommandPalette'
import { CLIENT } from '../data/jetsearcher'

/* Top navigation rather than a left rail. A broker's day is a sequence,
   not a set of departments, and the stage spine below carries that
   sequence explicitly. */
export const NAV = [
  { to: '/', label: 'Request Desk', hint: 'Live requests and the quote clock' },
  { to: '/sourcing', label: 'Sourcing', hint: 'Whole-of-market search and the option board' },
  { to: '/operators', label: 'Operators', hint: 'Vetting, accreditation and insurance' },
  { to: '/quote', label: 'Quote', hint: 'All-in build-up and the client document' },
  { to: '/mission', label: 'Mission', hint: 'Coordination before, during and after' },
  { to: '/clients', label: 'Clients', hint: 'History, preferences and repeat patterns' },
  { to: '/vector', label: 'Vector', hint: 'Ask the desk, build the brief' },
]

/* The actual JetSearcher process, encoded rather than decorated. The spine
   shows where the live mission has got to, so every screen answers the
   question "where are we in this deal". */
export const STAGES = [
  { key: 'request', label: 'Request', route: '/' },
  { key: 'source', label: 'Source', route: '/sourcing' },
  { key: 'compare', label: 'Compare', route: '/quote' },
  { key: 'confirm', label: 'Confirm', route: '/quote' },
  { key: 'fly', label: 'Fly', route: '/mission' },
] as const

export type StageKey = (typeof STAGES)[number]['key']

function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      {/* A great circle: two points and the arc between them. */}
      <svg viewBox="0 0 28 28" className="h-6 w-6 shrink-0" aria-hidden="true">
        <path d="M4 20 C 9 6, 19 6, 24 20" fill="none" stroke="#16283C" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="4" cy="20" r="2.6" fill="#16283C" />
        <circle cx="24" cy="20" r="2.6" fill="#1B7A63" />
      </svg>
      <div className="min-w-0 leading-none">
        <div className="font-display text-[15px] font-semibold tracking-tight text-ink">JetSearcher</div>
        <div className="mt-[3px] text-[9.5px] font-semibold uppercase tracking-[0.16em] text-jade-deep">
          {CLIENT.ai}
        </div>
      </div>
    </div>
  )
}

/* The stage spine. Rendered as a flight strip: departed stages are solid,
   the live one carries the jade mark, the rest are ahead. */
export function StageSpine({ current }: { current: StageKey }) {
  const idx = STAGES.findIndex((s) => s.key === current)
  return (
    <div className="xscroll flex w-full max-w-full items-center gap-0 py-1">
      {STAGES.map((s, i) => {
        const done = i < idx
        const live = i === idx
        return (
          <div key={s.key} className="flex shrink-0 items-center">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-1.5 w-1.5 shrink-0 rounded-full',
                  live ? 'bg-jade animate-pulse-soft' : done ? 'bg-navy' : 'bg-line-strong',
                )}
              />
              <span
                className={cn(
                  'whitespace-nowrap text-[11px] font-medium',
                  live ? 'text-jade-deep' : done ? 'text-ink' : 'text-ink-faint',
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <span
                className={cn('mx-3 h-px w-8 shrink-0', done ? 'bg-navy/35' : 'bg-line-strong')}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function Shell({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="min-h-screen">
      {/* ------------------------------ Top bar ------------------------------ */}
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-5 py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-8">
            <Wordmark />
            <nav className="xscroll hidden min-w-0 items-center gap-0.5 lg:flex">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.hint}
                  className={({ isActive }) =>
                    cn(
                      'relative whitespace-nowrap rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-all duration-200 ease-arc',
                      isActive
                        ? 'bg-navy-wash text-navy'
                        : 'text-ink-soft hover:bg-mist hover:text-ink',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11.5px] text-ink-faint transition-colors hover:border-line-strong hover:text-ink-soft sm:flex"
            >
              <Search className="h-3.5 w-3.5" />
              Search
              <span className="tnum ml-1 rounded border border-line bg-mist px-1.5 py-[1px] text-[10px] font-medium">
                <CommandIcon className="mr-0.5 inline h-2.5 w-2.5" />K
              </span>
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-jade/25 bg-jade-wash px-3 py-1.5 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-jade animate-pulse-soft" />
              <span className="text-[11px] font-medium text-jade-deep">{CLIENT.ai} live</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="hidden text-right sm:block">
                <div className="text-[11.5px] font-semibold leading-tight text-ink">{CLIENT.principal}</div>
                <div className="text-[10px] leading-tight text-ink-faint">{CLIENT.principalTitle}</div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-white">
                {CLIENT.initials}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile nav strip */}
        <div className="xscroll flex w-full max-w-full gap-1 border-t border-line px-3 pb-2 pt-1.5 lg:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors',
                  isActive ? 'bg-navy text-white' : 'text-ink-soft hover:bg-mist',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="chart-ground min-h-[calc(100vh-61px)] px-5 py-6 lg:px-8 lg:py-8">
        <div className="relative mx-auto max-w-[1320px]">{children}</div>
      </main>

      <footer className="border-t border-line px-5 py-4 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-[10.5px] leading-relaxed text-ink-faint">
            Illustrative demonstration prepared for {CLIENT.legal}. Not a live booking system. ARGUS,
            Wyvern, EURAMI and CAMTS are named because a broker genuinely works to them; the ratings,
            operators, aircraft, clients and prices shown here are invented for the demonstration, and no
            real charter operator is named anywhere in this build.
          </p>
        </div>
      </footer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
