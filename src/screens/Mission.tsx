import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, PhoneCall } from 'lucide-react'
import { AiTag, Button, Panel, PanelHead, Stat, Tag, cn } from '../components/ui'
import { StageSpine } from '../components/Shell'
import { useToast } from '../components/Toast'
import {
  BLOCKER,
  SCOPE_NOTE,
  STATE_LABEL,
  STATE_TONE,
  TIMELINE,
  blockedTasks,
  doneCount,
  oursCount,
  type CoordTask,
} from '../data/coordination'
import { CLIENT, hhmm } from '../data/jetsearcher'
import { DESTINATION, MISSION, ORIGIN, bestOption, patientTransit } from '../data/mission'

export function Mission() {
  const [chased, setChased] = useState(false)
  const { push } = useToast()
  const navigate = useNavigate()
  const option = bestOption()
  const blocked = blockedTasks()

  return (
    <div className="space-y-5">
      {/* ------------------------------- header ------------------------------- */}
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">{MISSION.id}</span>
              <Tag level="med">{MISSION.kind}</Tag>
              <Tag level="platinum">Confirmed</Tag>
            </div>
            <h2 className="mt-2 font-display text-lede font-semibold text-ink">
              {ORIGIN.city} to {DESTINATION.city} · {option.aircraft} · {option.registration}
            </h2>
            <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-soft">
              {option.operator} flies it. JetSearcher is accountable for everything around it, and that is
              what this screen tracks.
            </p>
          </div>
          <div className="flex min-w-0 max-w-full shrink flex-col items-start gap-3 sm:items-end">
            <AiTag />
            <StageSpine current="fly" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-5 border-t border-line pt-5 sm:grid-cols-4">
          <Stat label="Steps complete" value={`${doneCount()}`} unit={`of ${TIMELINE.length}`} />
          <Stat label="Ours to chase" value={`${oursCount()}`} tone="navy" note="The rest sits with the operator or the client" />
          <Stat label="Blocked" value={`${blocked.length}`} tone="stop" note="And it is ours" />
          <Stat label="Patient transit" value={hhmm(patientTransit(option))} tone="med" note="Direct, no technical stop" />
        </div>
      </Panel>

      {/* ------------------------------ the blocker ------------------------------ */}
      <Panel className={cn(chased ? 'border-navy/25 bg-navy-wash' : 'border-stop/25 bg-stop-tint/40')}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <AlertTriangle className={cn('mt-[2px] h-5 w-5 shrink-0', chased ? 'text-navy' : 'text-stop')} />
            <div className="min-w-0">
              <h3 className="font-display text-[16px] font-semibold text-ink">
                {chased ? 'Chased. Bed manager is sending it now.' : BLOCKER.headline}
              </h3>
              <p className="mt-1.5 max-w-3xl text-[12.5px] leading-relaxed text-ink-soft">
                {BLOCKER.detail}
              </p>
              <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">If it slips: </span>
                {BLOCKER.consequence}
              </p>
            </div>
          </div>
          <Button
            variant={chased ? 'ghost' : 'primary'}
            icon={<PhoneCall className="h-3.5 w-3.5" />}
            onClick={() => {
              setChased(true)
              push({
                kind: 'ok',
                title: 'Bed manager reached',
                body: 'Written confirmation promised within the hour. The London ambulance slot is held until 12:50.',
              })
            }}
          >
            {chased ? 'Call again' : BLOCKER.action}
          </Button>
        </div>
      </Panel>

      {/* ------------------------------- timeline ------------------------------- */}
      <Panel flush>
        <div className="p-5">
          <PanelHead
            eyebrow="Coordination"
            title="Before, during and after the flight"
            sub={SCOPE_NOTE}
            right={<Tag level="navy">{`${oursCount()} of ${TIMELINE.length} are ours`}</Tag>}
          />
        </div>

        <div className="border-t border-line">
          {TIMELINE.map((t, i) => (
            <TimelineRow key={t.id} task={t} last={i === TIMELINE.length - 1} chased={chased} />
          ))}
        </div>

        <div className="border-t border-line p-5">
          <Button variant="quiet" size="sm" onClick={() => navigate('/vector')}>
            Ask Vector for the mission brief
          </Button>
        </div>
      </Panel>

      {/* --------------------------- what we do not do --------------------------- */}
      <Panel>
        <PanelHead
          eyebrow="Scope"
          title={`What ${CLIENT.ai} deliberately does not touch`}
          sub="A broker platform that started issuing crew instructions would be a liability, not a feature. The line is drawn where the operating certificate sits."
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              k: 'Dispatch and flight release',
              v: 'The operator holds the certificate and makes the call. JetSearcher is told, not consulted.',
            },
            {
              k: 'Crew duty and rest',
              v: 'Managed under the operator’s own scheme. Vector reads the resulting times, it does not set them.',
            },
            {
              k: 'Clinical decisions',
              v: 'Fitness to fly, cabin altitude limits and escort level are the physician’s. Vector records them as constraints.',
            },
          ].map((c) => (
            <div key={c.k} className="rounded-card border border-line bg-canvas p-3.5">
              <div className="text-[12px] font-semibold text-ink">{c.k}</div>
              <p className="mt-1 text-[11px] leading-snug text-ink-soft">{c.v}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function TimelineRow({ task: t, last, chased }: { task: CoordTask; last: boolean; chased: boolean }) {
  const state = chased && t.state === 'blocked' ? 'live' : t.state
  return (
    <div className="flex gap-4 px-5 py-3.5">
      {/* Spine */}
      <div className="flex shrink-0 flex-col items-center">
        <span
          className={cn(
            'mt-1 h-2.5 w-2.5 rounded-full',
            state === 'done' && 'bg-platinum',
            state === 'live' && 'bg-navy animate-pulse-soft',
            state === 'waiting' && 'bg-line-strong',
            state === 'blocked' && 'bg-stop animate-tick',
          )}
        />
        {!last && <span className="mt-1 w-px flex-1 bg-line" />}
      </div>

      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tnum text-[11.5px] font-semibold text-ink-faint">{t.time}</span>
            <span className="text-[12.5px] font-semibold text-ink">{t.label}</span>
            {t.ours && <Tag level="navy">JetSearcher</Tag>}
          </div>
          <Tag level={STATE_TONE[state]}>{STATE_LABEL[state]}</Tag>
        </div>
        <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{t.detail}</p>
        {!t.ours && (
          <p className="mt-0.5 text-[10.5px] text-ink-faint">Sits with: {t.owner}</p>
        )}
      </div>
    </div>
  )
}
