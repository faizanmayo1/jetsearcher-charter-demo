# JetSearcher · Vector Charter Operations Intelligence

Pre-sales demonstration for **Johann Pillai**, Managing Director of
[JetSearcher Ltd](https://jetsearcher.com), on **Wednesday at 2:00 PM EDT** (7:00 PM London).
Lead and rep: **Salman**.

```
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview  # what actually ships
```

---

## The one distinction the whole demo rests on

**JetSearcher is a broker, not an operator.** They own no fleet. They source whole-of-market, vet
operators, and compete on how fast and how well they quote.

There is an adjacent demo in this folder, `avistair-aviation-intelligence`, built for a *different*
prospect who *is* an operator: control tower, dispatch, delay risk, maintenance. Building this one
the same way would be the single worst mistake available. So the spine here is **the quote**, not
the flight, and the Mission screen is explicit that JetSearcher does not dispatch aircraft, hold a
certificate, or control crew duty.

## Why Johann should care

1. **The clock is the business.** A medical request that sits 45 minutes has usually gone
   elsewhere. The desk median on this board is 1h 25m; Vector returns options in 4.
2. **Vetting is where the liability sits.** An operator whose insurance lapsed is out of sourcing
   the same morning, before an aircraft reaches an option board rather than after a client asks.
3. **The client knowledge lives in one person's head.** Every preference on the Clients screen
   carries where it was learned, so it survives that person leaving.

---

## The hero moment

`REQ-4471` — an ICU repatriation, Antalya to London Biggin Hill, bed to bed. Ventilated cardiac
patient, stretcher, 4,200 litres of oxygen, physician and flight nurse, EURAMI operator required.
Request lands 06:12. Options back 06:16.

| | Aircraft | Operator | Base | Transit | All-in |
|---|---|---|---|---|---|
| **Best fit** | Learjet 45XR | Meridian Air Ambulance | Munich | 3h 39m direct | **£47,734** |
| Viable | Learjet 35A | Aurora MedFlight | Antalya | 4h 56m, 1 fuel stop | £42,857 |
| **Held off the board** | Challenger 604 | Northgate Executive | Farnborough | 3h 34m direct | £82,055 |

**The decision in one line:** the cheaper aircraft saves **£4,877** and costs the patient
**1h 17m** more in the air, including a fuel stop at Brindisi with the patient aboard. Vector ranks
and presents both. It refuses to decide that one.

All three totals sit inside the **published £40,000 to £100,000 band** for Türkiye to UK air
ambulance repatriation, and the Quote screen plots the recommendation on that band rather than
asserting it is competitive.

**The move that buys credibility:** the third aircraft is *held off the board*. JetSearcher's own
site promises "up to three strong options" — and *up to* is the operative phrase. A third option
that cannot legally or clinically do the job is padding, and a medical assistance company will
spot it. The exclusion is recorded on the file with its reason so the shortlist stays auditable.

## Suggested demo path

1. **Request Desk** — open on the 45-minute clock and the trip that went elsewhere at £68K.
2. **Sourcing** — press *Run whole-of-market search*. 412 operators to 2 options in 4 minutes.
3. The option board on the cabin surface. Click the **Challenger** to see why it was excluded.
4. The great circle, then the requirement-by-requirement fit list.
5. **Operators** — Adriatic Wings, pulled this morning on an expired insurance certificate.
6. **Quote** — the itemised build-up, fee shown as its own line at 8%.
7. **Mission** — the written bed confirmation is the only thing at risk, and it is JetSearcher's.
8. **Vector** — ask the margin question and watch it refuse, then *Build the brief*.

---

## Screens

| Route | Screen | What it proves |
|---|---|---|
| `/` | Request Desk | The queue with a clock on it, and what a slow quote costs |
| `/sourcing` | **Sourcing (hero)** | Whole-of-market funnel, the three-option board, the great circle, the fit list |
| `/operators` | Operators | Accreditation, insurance and audit dates, checked before sourcing |
| `/quote` | Quote | All-in build-up, nothing folded into the hourly rate |
| `/mission` | Mission | Broker-side coordination only, with the scope line drawn explicitly |
| `/clients` | Clients | Preferences with provenance; speed and win rate travelling together |
| `/vector` | Vector | Grounded answers, one refusal, the generated mission brief |

## Design language: "Great Circle"

Named for the shortest path between two points on a sphere, which is what a broker actually sells.

- **The AI is named Vector.** What a controller gives you when they can see more than you can.
- **Status never uses green.** ARGUS and Wyvern already grade in platinum and gold, so the ladder
  borrows that vocabulary — platinum, gold, caution, stop — and green is freed entirely for Vector.
  A jade element is always something Vector did, never a pass mark. Rose is reserved for the
  aeromedical line, where a patient is involved.
- Porcelain canvas `#F4F6F7`, ink-navy `#16283C`, jade `#1B7A63`, cabin `#101A24`.
- **Top navigation with a process spine** (Request → Source → Compare → Confirm → Fly) rather than
  the left rail every other demo in this folder uses. The spine encodes JetSearcher's real process,
  so it is information rather than decoration.
- Outfit (display) with Inter (body). No monospace anywhere: `.tnum` carries tabular figures.
- No em dashes in any content string.
- **Signatures:** `src/components/OptionBoard.tsx` and `src/components/RouteArc.tsx`. The route is
  deliberately not a map — there is no map data behind this demo and a fake coastline is exactly
  the detail that gets noticed.

## Domain accuracy notes

- **Every operator, aircraft, client and price is invented.** ARGUS, Wyvern, EURAMI and CAMTS are
  named because a broker genuinely works to them, but attaching an invented safety finding to a
  real charter operator would be indefensible, so no real operator appears anywhere.
- **The performance figures are the real ones.** Learjet 45XR range 2,039 nm against a 1,566 nm
  leg, so Option A flies direct. Learjet 35A cruises slower and stops for fuel at Brindisi, 641 nm
  out of Antalya. A King Air 350 was considered and rejected as the second option: its practical
  charter range is 1,440 to 1,535 nm with reserves, so it could not have flown this leg at all.
- **The rates are market anchored.** Learjet 45XR charters at $4,250 to $4,450 an hour, King Air
  350 at EUR 1,800 to 2,800 in Europe. The quote adds a stated premium for installed medical
  configuration rather than inventing a number.
- **Türkiye charges no CAA fee for an overflight permit**, so that line is the agent filing it, not
  a government charge. **Ambulance flights are exempt from Eurocontrol route charges in some zones**,
  which is shown as a claimable line rather than netted off before it is confirmed.
- **All arithmetic is computed, not typed.** `src/data/mission.ts` builds each quote from its line
  items and applies the 8% fee, so the totals reconcile. Patient transit is *derived* from
  `flightMin + techStopMin` rather than stored, so it cannot drift from the legs it is made of.
- **The great circle distance is calculated** from the two airports' coordinates, not asserted:
  Antalya to Biggin Hill 1,566 nm, Munich to Antalya 1,080 nm, Antalya to Brindisi 641 nm.
- The desk median and the client win-rate comparison are computed from their own rows, so a
  headline cannot drift away from the table underneath it.

## Verification

Driven over CDP against the **production build**, 49 checks, all passing: every route renders,
the search returns the board, all three prices and both transit times reconcile, the excluded
aircraft shows its reason, navigation preserves the board, the quote sends, the brief generates,
the palette opens, zero console errors, and zero horizontal overflow at 390px on all seven routes.
