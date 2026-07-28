import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, Search } from 'lucide-react'
import { NAV } from './Shell'
import { REQUESTS } from '../data/requests'
import { OPERATORS } from '../data/operators'
import { CLIENTS } from '../data/clients'
import { HERO_ID } from '../data/mission'
import { cn } from './ui'

interface Entry {
  id: string
  label: string
  detail: string
  group: 'Screens' | 'Requests' | 'Operators' | 'Clients'
  to: string
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const entries = useMemo<Entry[]>(() => {
    const screens: Entry[] = NAV.map((n) => ({
      id: `screen-${n.to}`,
      label: n.label,
      detail: n.hint,
      group: 'Screens',
      to: n.to,
    }))
    const requests: Entry[] = REQUESTS.map((r) => ({
      id: `req-${r.id}`,
      label: `${r.id} · ${r.route}`,
      detail: `${r.kind} · ${r.client} · ${r.state}`,
      group: 'Requests',
      to: r.id === HERO_ID ? '/sourcing' : '/',
    }))
    const operators: Entry[] = OPERATORS.map((o) => ({
      id: `op-${o.id}`,
      label: o.name,
      detail: `${o.base} · ${o.aircraft} aircraft · ${o.status}`,
      group: 'Operators',
      to: '/operators',
    }))
    const clients: Entry[] = CLIENTS.map((c) => ({
      id: `cl-${c.id}`,
      label: c.name,
      detail: `${c.segment} · ${c.missions} missions · ${c.winRate}% win rate`,
      group: 'Clients',
      to: '/clients',
    }))
    return [...screens, ...requests, ...operators, ...clients]
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries.slice(0, 9)
    return entries
      .filter((e) => `${e.label} ${e.detail} ${e.group}`.toLowerCase().includes(q))
      .slice(0, 10)
  }, [entries, query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      const t = window.setTimeout(() => inputRef.current?.focus(), 20)
      return () => window.clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    setCursor(0)
  }, [query])

  if (!open) return null

  const go = (entry: Entry | undefined) => {
    if (!entry) return
    navigate(entry.to)
    onClose()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[cursor])
    }
  }

  let lastGroup = ''

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl animate-rise overflow-hidden rounded-card border border-line bg-surface shadow-pop">
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search requests, operators, clients"
            className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
          />
          <span className="tnum shrink-0 rounded border border-line bg-mist px-1.5 py-[1px] text-[10px] font-medium text-ink-faint">
            ESC
          </span>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="px-3 py-8 text-center text-[12px] text-ink-faint">Nothing matches that.</div>
          )}
          {results.map((entry, i) => {
            const showGroup = entry.group !== lastGroup
            lastGroup = entry.group
            return (
              <div key={entry.id}>
                {showGroup && <div className="eyebrow px-2.5 pb-1 pt-2.5">{entry.group}</div>}
                <button
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => go(entry)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition-colors',
                    i === cursor ? 'bg-navy-wash' : 'hover:bg-mist',
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] font-medium text-ink">{entry.label}</span>
                    <span className="block truncate text-[11px] text-ink-faint">{entry.detail}</span>
                  </span>
                  {i === cursor && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-ink-faint" />}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
