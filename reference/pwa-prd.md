Prototype PRD — v0
Goal: A demo-able mobile-web PWA that walks through the full product loop with all
integrations mocked. It should look and feel real; no live wallet, chain, yield, or card.
Purpose: investor demo and internal alignment — not real funds.
Platform: Mobile web PWA. Vite.js + Tailwind, using vite-plugin-pwa, mobile-first (design for ~390px width).
Installable to home screen. No app store, no native. Supabase optional for v0 — local/mock
state is fine to move fastest.
Guiding principle: Every “crypto” detail is invisible. The user sees dollars, a balance, a
draw, a card, and “free purchase” moments. No seed phrases, no gas, no chain names
anywhere in the UI.
The Concept (for build context)
A consumer financial app that feels like a game:
Hold a balance → automatic entries into a recurring cash draw. The more you hold, the
more entries.
Spend on the card → some purchases are simply free (a “your purchase might be free”
mechanic).
The two emotional payoffs — winning the draw and a purchase being free — are the
product. Everything else is scaffolding around those two moments.
Mocking Rules (how to fake each integration)
Wallet: mock. On signup, generate a fake balance object in state. No real keys.
On-ramp (“Add money”): mock. Instantly increments balance with a success
animation.
Yield: mock. Balance ticks up on a timer (e.g. visibly accrues a few cents) to show “your
money is working.” Purely cosmetic.
Draw engine: mock. Entries = a function of balance. A draw trigger (button or fake
countdown) produces a pre-scripted win/lose result.
Card spend / free-purchase mechanic: mock. A “Tap to pay” simulation; roughly 1 in 4
purchases triggers the “this one’s free” moment via scripted logic.
Screen Flow (the full loop)
1. Splash / Welcome Logo placeholder, tagline, one CTA: Get Started.
2. Onboarding (3 quick swipeable screens)
“Hold money, earn entries to win every week.”
“Spend on your card — some purchases are free.”
“Powered by opportunities that pay you.” → Sign up (email/phone, mock — any input
proceeds).
3. Home / Dashboard (the hub)
Balance, shown in dollars, gently ticking up (mock yield).
Entry count for next draw (“You have 12 entries”).
Countdown to next draw.
Two primary buttons: Add Money / Card.
Bottom nav: Home · Opportunities · Draw · Card.
4. Add Money Amount entry → “Add” → success animation → balance jumps, entries
recalculate. (Mock instant.)
5. Draw Screen
Prize amount, your entries, countdown.
“More balance = more entries” explainer (framed as automatic, not “save more”).
Demo trigger: a button to run the draw → scripted reveal animation → win (“You won
$100!”) or “Next draw in…”. For the demo, make a win easy to trigger.
6. Card Screen
A polished virtual card visual.
“Tap to Pay” simulation button → checkout animation → outcome: either a normal
purchase or the hero moment: “This purchase is on us. $14.20 — Free.” with
celebratory UI.
Recent transactions list (mock), free ones flagged.
7. Opportunities Feed
Simple scrollable list of mock internship/gig cards. Reinforces the acquisition engine and
the “income flows into your balance” story. Tapping one shows “Apply” (mock).
8. Win / Free-purchase celebration states Reusable full-screen moments — confetti, big
number, share-style framing. These are the screenshots that sell the demo. Make them feel
good.
Build Priority (if time runs short, in order)
1. Home dashboard + balance
2. Card screen + the “free purchase” moment ← the hero screen, do not cut this
3. Draw screen + win state
4. Add Money flow
5. Onboarding
6. Opportunities feed (can be simplest)
Explicitly Out of Scope for v0
Real auth, real funds, wallet/chain/yield/on-ramp integration, KYC, cross-device persistence,
fee logic, security. All deferred. This is a clickable, animated, real-feeling walkthrough —
nothing more.
The One Thing to Nail
The two dopamine moments — winning the draw and a purchase going free — are the
entire pitch. Everything else is scaffolding. Those two screens should feel genuinely exciting
on a phone. Get those two right plus a clean home dashboard, and the demo lands.