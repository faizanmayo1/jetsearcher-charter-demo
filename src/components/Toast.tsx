import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Check, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from './ui'

type ToastKind = 'ok' | 'ai' | 'warn'

interface ToastItem {
  id: number
  title: string
  body?: string
  kind: ToastKind
}

const ToastCtx = createContext<{ push: (t: Omit<ToastItem, 'id'>) => void }>({
  push: () => {},
})

export function useToast() {
  return useContext(ToastCtx)
}

const KIND_STYLE: Record<ToastKind, { border: string; icon: ReactNode }> = {
  ok: { border: 'border-l-navy', icon: <Check className="h-3.5 w-3.5 text-navy" /> },
  ai: { border: 'border-l-jade', icon: <Info className="h-3.5 w-3.5 text-jade-deep" /> },
  warn: { border: 'border-l-stop', icon: <TriangleAlert className="h-3.5 w-3.5 text-stop-deep" /> },
}

let seq = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = ++seq
    setItems((prev) => [...prev, { ...t, id }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }, 4800)
  }, [])

  const dismiss = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto animate-rise rounded-lg border border-l-[3px] border-line bg-surface p-3 shadow-pop',
              KIND_STYLE[t.kind].border,
            )}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-[1px] shrink-0">{KIND_STYLE[t.kind].icon}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold leading-snug text-ink">{t.title}</div>
                {t.body && <div className="mt-0.5 text-[11.5px] leading-relaxed text-ink-soft">{t.body}</div>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded p-0.5 text-ink-faint transition-colors hover:bg-mist hover:text-ink"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
