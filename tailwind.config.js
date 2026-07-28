/** @type {import('tailwindcss').Config} */
// "Great Circle" — a broker's desk identity for JetSearcher.
//
// Named for the shortest path between two points on a sphere, which is the
// line every long-range flight actually follows and the thing a broker is
// really selling: the best route to an aircraft, not the aircraft itself.
//
// THE RULE THAT MAKES THIS PALETTE WORK: STATUS NEVER USES GREEN.
// In charter broking "good" means a vetted operator, and vetting is already
// graded platinum, gold, amber, red by ARGUS and Wyvern. So the status ladder
// borrows that vocabulary and green is freed entirely for Vector, the AI.
// A jade element on this screen is always something Vector did, never a pass
// mark. Rose is reserved for the aeromedical line, where a patient is involved.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cool porcelain. A quiet, expensive room.
        canvas: '#F4F6F7',
        surface: '#FFFFFF',
        // Deep cabin surfaces, for the route chart and the option board
        cabin: {
          DEFAULT: '#101A24',
          soft: '#1A2733',
          line: '#2A3A49',
          faint: '#8B9AA8',
          mute: '#5A6C7C',
        },
        ink: {
          DEFAULT: '#101418',
          soft: '#4F5C68',
          faint: '#86929E',
        },
        line: '#DFE4E8',
        'line-strong': '#C9D1D7',
        mist: '#EAEEF1',

        // Ink-navy, the house colour
        navy: {
          DEFAULT: '#16283C',
          deep: '#0C1826',
          soft: '#4A6076',
          lit: '#7E9AB5',
          tint: '#D3DCE4',
          wash: '#EDF1F4',
        },
        // Jade — Vector, the AI. Never a status.
        jade: {
          DEFAULT: '#1B7A63',
          deep: '#125948',
          soft: '#5AA593',
          lit: '#4FC7A6',
          tint: '#CFE6DF',
          wash: '#EBF5F2',
        },

        // Operator vetting ladder, borrowed from the ratings themselves.
        // Deliberately no green anywhere on it.
        platinum: { DEFAULT: '#5C7186', tint: '#DDE3E9', deep: '#3D5064' },
        gold: { DEFAULT: '#9A7B2E', tint: '#EFE5CC', deep: '#755C1D' },
        caution: { DEFAULT: '#B8791F', tint: '#F5E6CE', deep: '#8C5A12' },
        stop: { DEFAULT: '#A63D33', tint: '#F2D9D6', deep: '#7D2B23' },

        // Aeromedical. Used only where a patient is involved.
        med: { DEFAULT: '#B03B5C', tint: '#F5D9E1', deep: '#83283F', lit: '#E07A97' },

        // Categorical series for the quote build-up
        c1: '#16283C',
        c2: '#4A6076',
        c3: '#7E9AB5',
        c4: '#B03B5C',
        c5: '#9A7B2E',
        c6: '#5C7186',
      },
      fontFamily: {
        // Outfit is geometric and stays quiet at large sizes, which suits a
        // business that sells discretion. Never a monospace (standing rule).
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        figure: ['50px', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'figure-sm': ['32px', { lineHeight: '1', letterSpacing: '-0.024em' }],
        lede: ['25px', { lineHeight: '1.25', letterSpacing: '-0.018em' }],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16,20,24,0.04), 0 4px 10px -4px rgba(16,20,24,0.05), 0 14px 34px -16px rgba(16,20,24,0.10)',
        lift: '0 1px 2px 0 rgba(16,20,24,0.05), 0 10px 22px -8px rgba(16,20,24,0.10), 0 28px 60px -24px rgba(16,20,24,0.18)',
        rail: '0 1px 2px 0 rgba(16,20,24,0.05)',
        pop: '0 24px 64px -20px rgba(16,20,24,0.34), 0 2px 6px 0 rgba(16,20,24,0.06)',
        cabin: '0 1px 2px 0 rgba(16,20,24,0.30), 0 18px 44px -18px rgba(16,20,24,0.45)',
        glow: '0 0 0 1px rgba(27,122,99,0.22), 0 14px 36px -18px rgba(27,122,99,0.42)',
        crown: 'inset 0 1px 0 0 rgba(255,255,255,0.10)',
      },
      borderRadius: {
        card: '12px',
        board: '16px',
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      transitionTimingFunction: {
        arc: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'pulse-soft': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.32' } },
        rise: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        // The great circle drawing itself between two airports
        draw: { from: { strokeDashoffset: '1200' }, to: { strokeDashoffset: '0' } },
        // The SLA clock on a request nobody has quoted yet
        tick: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.6s ease-in-out infinite',
        rise: 'rise 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.45s ease-out both',
        draw: 'draw 1.6s cubic-bezier(0.22,1,0.36,1) both',
        tick: 'tick 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
