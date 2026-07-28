import type { Airport } from '../data/mission'
import { hhmm } from '../data/jetsearcher'

/* ------------------------------------------------------------------ *
 * The great circle. One of the two signatures of this build.
 *
 * A charter broker does not sell an aircraft, it sells the shortest
 * credible path to one. So the route is drawn as the arc a long-range
 * flight actually follows, on the cabin ground, with the things that
 * change the answer marked on it: the positioning leg before the patient
 * is aboard, and any technical stop while they are.
 *
 * It is deliberately not a map. There is no map data behind this demo and
 * a fake coastline would be the kind of detail that gets noticed.
 * ------------------------------------------------------------------ */

interface Props {
  origin: Airport
  destination: Airport
  distanceNm: number
  /* Minutes */
  positioningMin: number
  flightMin: number
  techStopMin?: number
  techStopName?: string
  operatorBase?: string
  label?: string
}

export function RouteArc({
  origin,
  destination,
  distanceNm,
  positioningMin,
  flightMin,
  techStopMin = 0,
  techStopName,
  operatorBase,
  label = 'Great circle',
}: Props) {
  const W = 900
  const H = 250
  const y = 168
  const x1 = 150
  const x2 = 750
  const apex = 62

  /* Quadratic arc, apex above the midpoint */
  const mid = (x1 + x2) / 2
  const path = `M ${x1} ${y} Q ${mid} ${apex} ${x2} ${y}`

  /* Point on the quadratic at t, so markers sit on the line rather than near it */
  const at = (t: number) => ({
    x: (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mid + t ** 2 * x2,
    y: (1 - t) ** 2 * y + 2 * (1 - t) * t * apex + t ** 2 * y,
  })

  const stop = techStopMin > 0 ? at(0.46) : null
  const plane = at(techStopMin > 0 ? 0.7 : 0.5)

  const totalPatient = flightMin + techStopMin

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[600px]" role="img"
      aria-label={`${origin.city} to ${destination.city}, ${distanceNm} nautical miles`}>
      {/* Horizon reference */}
      <line x1={60} x2={W - 60} y1={y} y2={y} stroke="#FFFFFF" strokeOpacity={0.09} strokeWidth={1} />

      {/* The arc */}
      <path
        d={path}
        fill="none"
        stroke="#4FC7A6"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="1200"
        className="animate-draw"
      />

      {/* Positioning leg, before the patient is aboard. Drawn as a lighter
          dashed run into the origin so it reads as a different kind of time. */}
      {operatorBase && (
        <>
          <path
            d={`M 62 ${y + 34} Q 108 ${y + 26} ${x1 - 6} ${y + 4}`}
            fill="none"
            stroke="#7E9AB5"
            strokeOpacity={0.6}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <circle cx={62} cy={y + 34} r={3.5} fill="#7E9AB5" fillOpacity={0.8} />
          <text x={54} y={y + 26} textAnchor="start" fontSize="10" fill="#8B9AA8">
            {operatorBase}
          </text>
          <text x={54} y={y + 39} textAnchor="start" fontSize="9.5" fill="#5A6C7C" className="tnum">
            {`positioning ${hhmm(positioningMin)}`}
          </text>
        </>
      )}

      {/* Endpoints */}
      {[
        { x: x1, ap: origin, align: 'middle' as const },
        { x: x2, ap: destination, align: 'middle' as const },
      ].map(({ x, ap, align }, i) => (
        <g key={ap.icao}>
          <circle cx={x} cy={y} r={6.5} fill={i === 0 ? '#7E9AB5' : '#4FC7A6'} />
          <circle cx={x} cy={y} r={12} fill="none" stroke={i === 0 ? '#7E9AB5' : '#4FC7A6'} strokeOpacity={0.3} strokeWidth={1} />
          <text x={x} y={y + 32} textAnchor={align} fontSize="13" fontWeight={600} fill="#FFFFFF">
            {ap.city}
          </text>
          <text x={x} y={y + 48} textAnchor={align} fontSize="10.5" fill="#8B9AA8" className="tnum">
            {`${ap.icao} · ${ap.iata}`}
          </text>
          <text x={x} y={y + 62} textAnchor={align} fontSize="9.5" fill="#5A6C7C">
            {ap.country}
          </text>
        </g>
      ))}

      {/* Technical stop, if this option has one. The thing that costs the
          patient an extra hour and a half. */}
      {stop && (
        <g>
          <circle cx={stop.x} cy={stop.y} r={5} fill="#E07A97" />
          <line x1={stop.x} x2={stop.x} y1={stop.y + 8} y2={stop.y + 26} stroke="#E07A97" strokeOpacity={0.5} strokeWidth={1} />
          <text x={stop.x} y={stop.y + 40} textAnchor="middle" fontSize="10.5" fontWeight={600} fill="#E07A97">
            {techStopName ?? 'Technical stop'}
          </text>
          <text x={stop.x} y={stop.y + 54} textAnchor="middle" fontSize="9.5" fill="#8B9AA8" className="tnum">
            {`${techStopMin} min on the ground, patient aboard`}
          </text>
        </g>
      )}

      {/* Aircraft mark on the arc */}
      <g transform={`translate(${plane.x}, ${plane.y}) rotate(12)`}>
        <path d="M 0 -7 L 3 2 L 11 6 L 11 8 L 2 6 L 1 11 L 5 13 L 5 15 L 0 14 L -5 15 L -5 13 L -1 11 L -2 6 L -11 8 L -11 6 L -3 2 Z"
          fill="#FFFFFF" fillOpacity={0.9} transform="rotate(90)" />
      </g>

      {/* Distance and time, set at the apex */}
      <text x={mid} y={apex - 22} textAnchor="middle" fontSize="22" fontWeight={600} fill="#FFFFFF" className="tnum"
        style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
        {distanceNm.toLocaleString('en-GB')} nm
      </text>
      <text x={mid} y={apex - 6} textAnchor="middle" fontSize="10" fill="#8B9AA8" letterSpacing="0.1em">
        {label.toUpperCase()}
      </text>
      <text x={mid} y={apex + 16} textAnchor="middle" fontSize="11.5" fontWeight={600} fill="#4FC7A6" className="tnum">
        {`${hhmm(totalPatient)} patient transit`}
      </text>
    </svg>
  )
}
