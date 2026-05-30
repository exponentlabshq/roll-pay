# Roll — Product Requirements Document

> **"Buy now. Pay maybe."**
> A stablecoin-first, gamified tap-to-pay app for Gen Z, where random purchases get paid off by us.

| | |
|---|---|
| **Author** | Principal Finance & Blockchain Engineer |
| **Status** | Draft v0.1 — for review |
| **Date** | May 2026 |
| **Working product name** | **Roll** (alternates in §3.4) |
| **Category** | Consumer fintech · Stablecoin neobank · Gamified payments |
| **Primary market** | United States (Gen Z), with a global-ready architecture |

---

## 1. Executive summary

Roll is a self-custodial, stablecoin-native money app that turns everyday spending into a game. Users hold and spend USD-pegged stablecoins (USDC) from a smart wallet they control, tap to pay anywhere Visa is accepted via Apple Pay / Google Pay, and on a random subset of purchases the transaction is **paid off by Roll** — the receipt rings up **$0.00**. We call a free purchase a **Zero**, and every tap is a **roll**.

This is a deliberate inversion of cash-back. Instead of a predictable 1–2% rebate that nobody feels, Roll concentrates the same marketing/interchange budget into rare, high-dopamine "your coffee was free" moments that are inherently screenshot-able and built for TikTok/IG distribution. The model is directly inspired by Tuyo's "Buy Now, Pay Maybe," but re-pointed at a **Gen Z, gamification-first, stablecoin-first** wedge with a richer loyalty layer (points, streaks, seasons, leaderboards) and an explicit "no purchase necessary" engagement path for legal durability.

**Why now:** the GENIUS Act (signed July 2025) created a federal framework for payment stablecoins; Visa and Mastercard now settle on-chain; and Stripe-owned Bridge plus card-issuing platforms like Rain make it possible to stand up a compliant, stablecoin-funded Visa card program without becoming a bank or chartering one. The rails finally exist.

**The wedge:** Gen Z is the most BNPL-exposed, most crypto-curious, and most rewards-motivated cohort, and they churn fast on boring products. A money app that feels like an arcade — but settles in regulated digital dollars — is a defensible position between "crypto wallet" and "neobank."

---

## 2. Market research

### 2.1 Competitive teardown — Tuyo (the reference product)

Tuyo is the clearest existing expression of the concept we're adapting. Summary of findings from public sources (site, app store, press, founder posts):

**Product.** Tuyo positions itself as "the world's first truly borderless, self-custodial finance app" — a "universal money account" combining digital-dollar spending, real-world banking features, global transfers, trading, and yield. The headline consumer hook is the **Tuyo Card** and its **Buy Now, Pay Maybe (BNPM)** program: every time you pay, the purchase *might* be completely free ("some purchases just cost $0"). It launched May 7, 2026 and went viral on X, with users posting free dinners, gifts, and purchases typically in the $5–$100 range.

Core feature set:
- **Card / payments:** virtual Visa card, Apple Pay & Google Pay, spend at 175M+ merchant locations, settles in local currency, powered by USDC on Base. No issuance fee, no monthly fee, 0% on USD transactions, up to ~1% FX spread. $10,000/day limit that grows with usage. Virtual-only today; physical card and ATM/PIN "coming soon."
- **Accounts / transfers:** real account numbers and IBANs in the user's name (USD, EUR, MXN), free instant transfers between Tuyo users, multi-currency.
- **Earn:** deposit USDC, EURC, ETH, or BTC for up to ~11% APY via curated DeFi strategies; Tuyo takes a 10% performance fee (APYs shown net of fee).
- **Trade:** 15,000+ tokens across 5 networks, 0.25% (25 bps) volume fee; stablecoin↔stablecoin swaps and bridging exempt from the volume fee.
- **Rewards:** **TUYOs** points ("users are not just customers, but owners"), earned on card spend, trades, Earn deposits, and referrals (extra 20% of referees' rewards). Structured in **Seasons** (Season 0 "Pioneers" → Season 3 "Stacking Season") with multiplier boosts decaying to a baseline, culminating in a **Token Generation Event (TGE) in 2026**.

**Founders.**
- **Jorge Izquierdo** — Co-founder & CEO. Based in Spain. Co-founder of **Aragon** (DAO/governance) with Luis Cuende; author of **EIP-1271** (smart-contract signature verification), which directly informs Tuyo's smart-wallet approach. Studied CS at the Recurse Center. ~14 years in decentralized/governance software; deep Solidity + full-stack. X: @izqui9.
- **Alejandro Perezpayá** — Co-founder. Joined mutual-funds distribution platform **Allfunds** via acquihire (2018), became head of digital product.

**Investors / funding.** Public data is thin and partly unverified: **PitchBook** lists **Transpose Platform Management** as an investor; **Tracxn** indicates roughly **$4M** raised in a seed round (the listed date appears to be placeholder data). Treat exact figures as unconfirmed. Tuyo's planned **token (TGE 2026)** is effectively a parallel, community-facing capital and distribution mechanism.

**User personas (inferred).** Crypto-curious global consumers who want a "digital-dollar bank account," cross-border earners and freelancers needing USD/EUR/MXN rails, LatAm/EEA users (notably *excludes the UK*), and degens drawn by the trading + airdrop/points farming.

**Value proposition.** "Spending is more fun when it's free." Self-custody (you hold the keys), no hidden fees, DeFi-grade yield, borderless dollar accounts — wrapped in a delightful, fast, consumer-grade UI that hides crypto complexity.

**Social / marketing / brand.** X-led (@itstuyo, founder @izqui9). Growth driven by the **viral BNPM mechanic** (users posting $0 receipts) and a **points/airdrop "Seasons" loop** that gamifies acquisition and retention. Brand is bright, playful, emoji-forward, with purple/orange/white gradients; built on Framer; aspirational mission framing ("By 2030, 3 billion people will live on stablecoins — they'll use Tuyo").

**Market positioning.** A self-custodial "stablecoin super-app / universal money account" sitting between a crypto wallet and a neobank, differentiated by the BNPM gimmick and an ownership/token narrative.

**Tech stack.** Mobile via **React Native / Expo**, **TypeScript** backend (open roles confirm this). Self-custody at the core (keys never leave device).

**Blockchain stack.** **USDC on Base** as the spending asset and card-settlement chain; deposits/withdrawals across **Ethereum, Base, Arbitrum, Optimism, Polygon**; self-custodial **smart wallets** (account-abstraction lineage, consistent with the founder's EIP-1271 work); DeFi yield strategies for Earn; non-custodial DEX trading.

**Banking & financial-services partners.**
- **Bridge Ventures, Inc. ("Bridge")** — fiat↔stablecoin conversion and virtual bank-account-number management. Bridge is a licensed/regulated US money transmitter, EEA-compliant, and is **owned by Stripe** (acquired ~$1.1B, 2024). Bridge is *not* a bank.
- **Signify Holdings, Inc. ("Rain")** — card-issuance technology partner. Cards are issued by **licensed partner institutions**.
- **Visa** network for acceptance and (increasingly) on-chain settlement.

**What we copy, what we change.** We adopt the BNPM mechanic, self-custody, USDC-on-Base spending, and the points/seasons loop. We **diverge** by (a) targeting Gen Z explicitly rather than global crypto generalists, (b) leading with *gamification* (scratch/spin, streaks, leaderboards, social) rather than trading/DeFi depth, (c) making the rewards path **legally hardened** with a no-purchase-necessary alternative, and (d) keeping the surface area smaller and more opinionated (spend + play first; trade/earn later).

### 2.2 Competitive landscape

**Stablecoin cards & self-custodial spend.**

| Player | Angle | Notable detail |
|---|---|---|
| **Tuyo** | Self-custodial stablecoin super-app + "Buy Now, Pay Maybe" | USDC on Base; Bridge + Rain; viral $0 receipts |
| **Kast** | Stablecoin Visa debit, zero-conversion on stablecoins | Founded by ex-Circle exec; instant virtual card, Apple/Google Pay |
| **Coinbase Card** | Exchange-linked card | 1–4% rotating crypto rewards; 0% conversion on USDC (ETH/Base) |
| **Nexo Card** | Dual-mode credit/debit against crypto | Up to ~2% in NEXO or 0.5% BTC; EEA/UK fit |
| **Crypto.com Visa** | Tiered rewards via CRO staking | Mature, broad, ecosystem-locked |
| **Gnosis Pay** | On-chain, self-custodial card account | Crypto-native, EU-leaning |
| **Baanx ("OpenFi")** | Self-custody card pioneer, spend from your own wallet | Acquired by a US wallet co (~$175M); IBAN + tokenized assets |
| **Reap** | Corporate/B2B stablecoin cards | Visa principal issuer; >$6B annualized volume |

**Gamified / Gen Z consumer finance.**

| Player | Mechanic |
|---|---|
| **Long Game** (Truist) | Mini-games + **weekly lottery** to win cash; free crypto for saving/playing — closest analog to prize-linked play |
| **Yotta** | Prize-linked savings; numbers + weekly draws |
| **Cleo** | "No-b.s." AI budgeting with sass/GIFs; strong Gen Z voice |
| **Greenlight / Step / Current** | Teen & young-adult debit + reward/game mechanics |
| **Acorns / Qapital / Stash** | Round-ups, rules-based saving, behavioral nudges |
| **Robinhood** | Investing with confetti, streaks, social proof |

**Infrastructure (our likely suppliers, also potential coopetition).** Bridge (Stripe) for on/off-ramp, virtual accounts, and "Open Issuance"; Rain and Bridge×Visa for card issuance/program management; Circle for USDC and CPN; Privy (Stripe) for embedded wallets; Lead Bank as a Visa stablecoin-settlement sponsor bank.

**Whitespace.** No one is combining (1) **stablecoin-native self-custody**, (2) a **prize-style "maybe free" payoff** (vs. flat cash-back), and (3) a **Gen Z arcade aesthetic with a real loyalty/points economy** in one US-focused product. Tuyo is the closest, but it's a global crypto super-app, not a Gen-Z-native gamified card.

### 2.3 Market & Gen Z behavioral context

Signals that motivate the product (from 2025–2026 market commentary):
- Gen Z (born ~1997–2012; ages ~14–29 in 2026) reports **low financial confidence** (~24%) and high **money anxiety** (~73% say it affects daily life).
- **Heavy BNPL adoption** (well over half use Afterpay/Klarna/Zip in some markets) and **high crypto exposure** (~47% have traded; a meaningful share report addictive patterns — a guardrail design requirement, not just a marketing fact).
- **Social commerce** drives a large share of impulse purchases (IG/TikTok).
- ~**40% of US Gen Z would switch banks for better rewards**, and ~**81% abandon a brand after 2–3 poor digital interactions** — so onboarding latency and reward salience are existential.
- **Prize-linked/gamified mechanics measurably work**: industry reports cite ~**22% lift in saving habits** and ~**20% higher average balances** from streaks/lotteries/badges.
- The **fintech gamification** market is large and growing double digits; **unpredictability + visible progress** (Octalysis Core Drives 7 and 2) are the levers that fit a money product.

**Design implication:** lead with unpredictability (the roll), make value *visible and shareable* (the $0 receipt), reward consistency (streaks/seasons), and build in **responsible-spend guardrails** so the "game" never encourages financial self-harm.

### 2.4 Regulatory landscape (the part most teams underestimate)

This is the single biggest determinant of whether the product is durable. Engineering and legal must co-design here.

**a) Stablecoins — GENIUS Act (US, signed July 2025).**
- Establishes federal rules for **payment stablecoins**; permitted issuers (PPSIs) are treated as financial institutions under the **Bank Secrecy Act** with AML and **sanctions-compliance** obligations.
- **Issuers may not pay interest/yield** on the stablecoin itself. **Third-party rewards** offered by exchanges/fintechs are a contested-but-currently-permitted gray zone (Coinbase/PayPal explicitly run "rewards," not "interest"). **Implication:** our "Zero"/Clover rewards must be structured as **discretionary, third-party marketing incentives** — *never* framed as yield on a stablecoin balance — and must avoid prohibited **affiliate/anti-tying** arrangements with any issuer.
- **Implication for "Earn":** if/when we add yield, it must be clearly delivered through third-party DeFi protocols or properly structured products, not as Roll paying interest on dollars held.

**b) The "Pay Maybe" mechanic — sweepstakes / promotions law (this is the crux).**
A program where some purchases are randomly made free has three classic gambling elements to manage: **prize, chance, and consideration**. A lawful promotional sweepstakes must remove **consideration** — i.e., **"No Purchase Necessary."** Design requirements:
- Provide a genuine, frictionless **Alternative Method of Entry (AMOE)** so users can earn entries/odds **without spending** (our **Daily Roll** does exactly this; a mail-in AMOE may also be required).
- Publish **Official Rules**, eligibility, and **odds disclosure or "odds vary"** language; keep the program **discretionary** (Tuyo's terms make BNPM "sole and absolute discretion," "don't rely on it," and exclude prohibited US states/territories — we mirror and improve on this).
- **State-by-state exclusions:** several US states heavily regulate or prohibit such promotions; geo-fence accordingly. **Registration/bonding** may be required where prize pools exceed state thresholds.
- **Avoid the "it's a lottery" failure mode:** never let odds *scale with spend in a way that looks like buying lottery tickets* without an equivalent free path.

**c) Money movement & cards.**
- We are **not a bank** and will not take custody of fiat; fiat on/off-ramp and account numbers run through a licensed partner (Bridge). Card issuance runs through a licensed issuer/program manager (Rain or Bridge×Visa). **Reg E** (electronic fund transfers / error resolution), card-network rules, and **UDAAP** apply to the consumer experience.
- **KYC/AML/CIP** at onboarding (vendor-provided), **OFAC sanctions screening**, transaction monitoring, SAR processes (via partners where applicable).

**d) Tax.** Free purchases and prizes are likely **taxable income** to users; **1099-MISC** reporting applies above the annual threshold (currently $600). Build issuance + user disclosures from day one.

**e) Token caution.** A points-to-token path (à la Tuyo's TGE) raises **securities** questions. Default stance: points are a **non-transferable loyalty currency** with no promise of a token or future value, unless/until a securities-cleared path exists.

---

## 3. Product vision & strategy

### 3.1 Vision
Make money feel like a game you actually win — by giving Gen Z a digital-dollar account where spending is fast, free to hold, and occasionally, thrillingly, **free to make**.

### 3.2 Mission
Put regulated digital dollars in every young person's pocket and make the most boring financial primitive — paying — the most fun thing in their phone.

### 3.3 Positioning statement
For Gen Z spenders who find banking boring and crypto intimidating, **Roll** is a stablecoin tap-to-pay app that turns everyday purchases into a chance to pay nothing. Unlike cash-back cards (predictable, forgettable) and crypto wallets (complex, scary), Roll combines self-custodial digital dollars, instant tap-to-pay, and a "your purchase might be free" game — with a points economy you actually own the upside of.

### 3.4 Name candidates
Recommended primary: **Roll** — *bankroll* (money) + *dice roll* (chance) + *on a roll* (winning streak). Short, ownable-feeling, verb-able ("just Roll it"), great visual potential (the "oo" as coins/dice).

Alternates (full trademark/clearance search required before adoption):

| Name | Why it works | Watch-out |
|---|---|---|
| **Comp** | Casino "comped" = the house pays; precise mechanic fit | Reads as "comparison/compensation" |
| **Dub** | Gen Z for a win ("take the dub"); hype energy | Doesn't signal money |
| **Lucky / Luckie** | Instantly communicates the upside | Generic; hard to trademark |
| **Freeroll** | Poker term: a bet you can't lose — perfect metaphor | Longer; poker-niche |
| **Zilch** | "$0" energy, playful | Slightly negative tone |
| **Zap** | Speed of tap-to-pay | Crowded namespace |
| *"Maybe"* | Tagline-perfect | **Avoid** — collides with Tuyo's trademarked BNPM program |

**Tagline (as requested):** *"Buy now. Pay maybe."* — used as a campaign line on a distinctly branded app to reduce IP collision with Tuyo's program name (see §16).

---

## 4. Target users & personas

**P1 — "The Tapper" (core, ages 18–24).** College/early-career, lives in Apple Pay, follows finance/deal TikTok, has tried Robinhood and maybe one crypto app, motivated by FOMO and shareable wins. *Job:* "Make my everyday spending feel rewarding and fun without me having to think." *Hook:* the $0 receipt to post.

**P2 — "The Saver-Curious" (ages 20–27).** Anxious about money, wants to build habits, distrusts banks, intrigued by yield but scared of crypto loss. *Job:* "Help me grow a little money and feel in control." *Hook:* streaks, visible progress, low-stakes "earn" later.

**P3 — "The Degen-lite" (ages 19–28).** Crypto-native, farms points/airdrops, already self-custodies. *Job:* "Give me a stablecoin card with upside and a points economy I can game." *Hook:* Clovers, seasons, leaderboards, self-custody.

**P4 — "The Global Earner" (ages 21–30, expansion).** Freelancer/creator paid across borders, wants USD exposure. *Job:* "Get paid in dollars and spend anywhere." *Hook:* virtual USD account + free transfers (V2).

Anti-persona: users seeking credit/BNPL debt. Roll is **debit/spend-your-own-funds**; "pay maybe" is a *reward*, never a loan. Messaging must prevent the "buy now, owe later" misread.

---

## 5. Value proposition

- **Hold dollars, not volatility.** Balances are USD-pegged stablecoins (USDC) you self-custody.
- **Tap to pay anywhere.** Visa acceptance via Apple Pay / Google Pay; settles in local currency.
- **Every purchase is a roll.** Some rng up **$0.00** — paid off by Roll. No catch, no points to redeem for it.
- **Own the upside.** Earn **Clovers** on activity; climb **seasons** and **leaderboards**; (future) participate in the network's growth.
- **No monthly fee, no card fee, 0% on USD spend.** We make money on interchange + FX spread, not nickel-and-diming.
- **Yours, even on a bad day.** Self-custodial: you can always withdraw to your own wallet, even if an account check fails.

---

## 6. The "Pay Maybe" rewards engine (core differentiator)

### 6.1 Player-facing mechanics
- **The roll:** every eligible card authorization enters a draw. If it wins, the purchase is a **Zero** — Roll covers the amount and the in-app receipt animates to **$0.00** with confetti + a shareable card.
- **Caps & curve:** per-transaction max payoff (e.g., starts at $100, "leveling up" with tenure/streak), daily/weekly/seasonal payout caps per user, and a global program budget cap.
- **Clovers (points):** earned on spend, (future) Earn deposits, **Daily Roll**, and referrals (+X% of referees' Clovers). Clovers raise your **odds tier** and unlock cosmetic/seasonal perks. **Non-transferable; no promised cash value.**
- **Daily Roll (AMOE):** a free, no-spend daily play that grants Clovers/entries. This is both a retention loop **and** the legal "no purchase necessary" path.
- **Streaks & Seasons:** consecutive-day and consecutive-week multipliers; time-boxed Seasons with themes and leaderboards (mirrors Tuyo's Seasons but tuned for play, not airdrop farming).
- **Leaderboards & social:** opt-in, anonymized; "biggest Zero this week," streak ladders, friend leagues.

### 6.2 How the payoff is funded (unit economics)
- **Primary:** **interchange.** On Visa debit rails, the merchant's acquiring side pays interchange; the issuer/program shares a portion with Roll. Aggregate interchange across all spend funds a **prize pool**; expected payoff per dollar spent is engineered to sit **inside** the interchange + FX margin so the program is self-funding at the cohort level (this is the same budget a cash-back card would rebate — concentrated into rare wins).
- **Secondary:** FX spread on non-USD spend, Earn performance fee (V2), and float economics where permissible.
- **Reserve:** a ring-fenced, conservatively funded **Prize Reserve** smooths variance so payouts never depend on a given day's volume. Treasury policy and accounting defined with finance + legal.

### 6.3 Fairness, integrity, and anti-abuse
- **Provable fairness:** publish the odds model class and use a commit-reveal / verifiable randomness approach (e.g., VRF) so winners can be audited and we can't be accused of rigging. Document this; it's a brand asset.
- **Abuse controls:** velocity limits, merchant-category restrictions (e.g., exclude cash-equivalents, gambling, money-transfer MCCs), device/identity fraud checks, collusion/structuring detection, and self-transfer/return gaming prevention.
- **Responsible spend (non-negotiable):** the game must never reward *spending more to win more* without the free AMOE path; surface spend insights, allow self-exclusion/cool-downs, and never use dark patterns. Treat the "23% report addictive crypto patterns" stat as a design mandate.

---

## 7. Functional requirements & scope

### 7.1 MVP (target: first public release)
- **Onboarding & KYC:** phone/email + passkey; vendor KYC/CIP; OFAC screening; instant **virtual smart wallet** creation (no seed phrases shown — passkey/MPC).
- **Fund:** card/Apple Pay/ACH on-ramp via Bridge → USDC on Base; receive a **virtual USD account number** (Bridge).
- **Spend:** issue **virtual Visa card** (Rain or Bridge×Visa); provision to **Apple Pay / Google Pay**; USDC-on-Base settlement; 0% USD, ≤1% FX.
- **The roll + Zero reveal:** real-time draw on authorization; animated receipt; share sheet.
- **Clovers + Daily Roll:** points ledger; free daily play (AMOE); streak counter.
- **Wallet basics:** balance, transaction history with "rolled/Zero" status, self-custody **export/withdraw** to external wallet.
- **Compliance UX:** Official Rules, odds disclosure, geo-gating, tax disclosures, responsible-spend center.
- **Notifications:** "You got a Zero!", streak reminders, season events.

### 7.2 V1
- **Seasons & leaderboards**, friend leagues, referral program (+% of referees' Clovers).
- **Physical card**; ATM (subject to issuer support).
- **Multi-chain deposits** (Ethereum, Arbitrum, Optimism, Polygon, Solana) auto-converted to Base USDC.
- **In-app stablecoin swap** (stablecoin↔stablecoin first; low/zero fee).
- Richer **spend insights** and budgeting nudges.

### 7.3 V2+
- **Earn** (third-party DeFi yield, clearly structured; performance fee).
- **Virtual EUR/MXN accounts + free P2P transfers** (global earner persona).
- **Creator/affiliate** tooling; brand-sponsored "boosted odds" at partner merchants (new revenue line; must stay sweepstakes-compliant).
- **Loyalty token exploration** (only on a securities-cleared path).

### 7.4 Representative user stories
- *As a Tapper,* I tap my phone at a café and instantly see whether my coffee was a Zero, so I can screenshot and post it.
- *As a Saver-Curious user,* I keep a 14-day streak and watch my Clovers and odds tier grow, so I feel progress.
- *As a Degen-lite user,* I deposit USDC from Arbitrum and it auto-bridges to Base, so I can spend immediately and farm Clovers.
- *As any user,* I open the app, hit my **Daily Roll** without spending a cent, and still earn entries — so the game is fair and I'm not pressured to spend.
- *As any user,* I can export my funds to my own wallet at any time, so I trust the product with my money.

---

## 8. UX & key flows

1. **First run → first tap (target < 3 minutes):** passkey sign-up → KYC → wallet created → fund $20 → add card to Apple Pay → tap → reveal. The "aha" is the *first reveal*, so optimize ruthlessly for time-to-first-tap.
2. **The reveal:** authorization webhook → draw → push + in-app animation. Win = confetti, $0.00 receipt, one-tap share. Loss = subtle "not this time, +Clovers, streak intact," never punishing.
3. **Daily Roll:** home-screen primary action when no recent spend; free, fast, satisfying.
4. **Fund / withdraw:** on-ramp via Bridge; always-available self-custody export.
5. **Refer:** personalized link; both sides get Clovers/odds boost on referee's first tap.

Design language and components are specified in the companion **`brand.md`**.

---

## 9. Technical architecture

### 9.1 Mobile
- **React Native + Expo, TypeScript** (matches the talent market and the Tuyo reference stack; OTA updates via EAS).
- **Passkeys / WebAuthn** for auth and signing UX; no seed phrases surfaced.
- Native Apple Pay / Google Pay provisioning (push provisioning via issuer SDK).

### 9.2 Backend
- TypeScript services (Node) behind an API gateway; event-driven core for **authorization → draw → ledger → notify**.
- **Ledger:** double-entry, append-only, idempotent; every roll outcome and Clover movement is auditable.
- **Randomness service:** VRF/commit-reveal for provable fairness; deterministic replay for audits.
- Postgres (system of record) + a fast cache/stream (e.g., Redis/Kafka) for real-time reveals.
- Infra-as-code; SOC 2 path from day one; secrets management; least-privilege.

### 9.3 Blockchain stack
- **Settlement chain:** **Base** (L2). **Spending asset:** **USDC** (Circle).
- **Self-custodial smart accounts:** account abstraction (ERC-4337-style) with **passkey signers** and **MPC** recovery; this lineage tracks the founder-of-Tuyo's **EIP-1271** smart-wallet approach but is independently implemented.
- **Gas abstraction:** a **paymaster** sponsors gas so users never hold ETH; fees absorbed into spread.
- **Multi-chain deposits:** accept on Ethereum, Base, Arbitrum, Optimism, Polygon, (Solana in V1) and **auto-bridge/convert to Base USDC** for free in-app.
- **Card↔chain bridge:** at point of sale, USDC is debited from the smart account and the transaction settles via the card program; explore **on-chain settlement** through Visa's stablecoin-settlement pilot.

### 9.4 Partners (build-vs-buy: buy the regulated rails, own the experience)
| Layer | Partner(s) | Role |
|---|---|---|
| Stablecoin issuer | **Circle (USDC)** | Reserve-backed digital dollar; CPN for transfers |
| Fiat on/off-ramp + virtual accounts | **Bridge (Stripe)** | USD/EUR/MXN account numbers, fiat↔USDC, "Open Issuance" optionality |
| Card issuance / program mgmt | **Rain** and/or **Bridge × Visa** | Stablecoin-funded Visa card, push provisioning |
| Network | **Visa** | Acceptance + on-chain settlement pilot |
| Sponsor / settlement bank | **Lead Bank** (or equivalent in Visa's pilot) | Bank in the loop for settlement; "bank that supports stablecoin rails" |
| Embedded wallet (optional) | **Privy (Stripe)** | Wallet infra alternative |
| KYC/AML | e.g., **Persona / Sumsub** | CIP, doc verification, sanctions/PEP screening |
| Risk/fraud | network + in-house + vendor | Device, velocity, collusion detection |

> **"Banks that support stablecoin rails for Gen Z spending"** (your requirement) resolves concretely to: a **Visa stablecoin-settlement sponsor bank** (e.g., **Lead Bank**) settling on-chain, with **Bridge (Stripe)** and **Rain** as the regulated program enablers and **Circle** as the USDC issuer. We do **not** charter or become a bank.

### 9.5 Security & compliance engineering
- Self-custody by design; keys/shares never centrally reconstructable; clear key-recovery UX.
- Encryption in transit/at rest; HSM/KMS for any sensitive material; comprehensive audit logging.
- Smart-contract audits + bug bounty before mainnet payouts; reserve and payout flows formally reviewed.
- Privacy: minimize on-chain linkage of consumer identity; shield transaction detail in the UI.

---

## 10. Rewards compliance & risk (engineering ↔ legal)

This deserves its own workstream and a named DRI. Minimum bar before launch:
- **Official Rules** + **No-Purchase-Necessary AMOE** (Daily Roll + mail-in), odds language, eligibility, **state exclusions**, and any **registration/bonding** where required.
- **Discretionary framing** in ToS (program may change/pause; "don't rely on it; don't change spending habits") — improving on Tuyo's posture, paired with genuine user protections.
- **Prize Reserve** treasury policy, **GAAP** accounting for payouts/liabilities, and **1099** issuance + user tax disclosures.
- **GENIUS Act alignment:** rewards = discretionary third-party incentives, never stablecoin yield; no prohibited affiliate/anti-tying ties to an issuer.
- **Reg E / UDAAP / network rules** review of the full consumer flow; **BSA/AML** program via partners; **OFAC** screening.

---

## 11. Monetization & unit economics

- **Interchange** (primary): funds both the business and the Prize Reserve.
- **FX spread** (≤1%) on non-USD spend.
- **Earn performance fee** (V2): a cut of third-party yield.
- **Float / treasury** where permissible and disclosed.
- **Merchant-funded boosted odds** (V2): brands subsidize higher win rates at their stores — high-margin, but must remain sweepstakes-compliant and clearly disclosed.
- **Loyalty token** (long-horizon, conditional): only on a securities-cleared path; not assumed in the base plan.

Target: the blended **expected payoff + rewards cost per $ spent < interchange + FX margin per $ spent**, with the Prize Reserve absorbing variance. Model cohort-level, not transaction-level.

---

## 12. Loyalty / points (Clovers)

- **Clovers** are a closed-loop, **non-transferable** loyalty currency: earned on spend, Daily Roll, streaks, and referrals; spent on odds tiers, cosmetics, and seasonal perks.
- **Seasons** create urgency and narrative (Tuyo-style) without implying a tradable asset.
- **No promise** of conversion to a token or cash. Any future token requires legal clearance and a separate PRD.

---

## 13. Go-to-market & growth

- **Built-in virality:** the **$0 receipt** is the ad. Every Zero ships with a polished, branded share card; seed via micro-creators in finance/deal/college niches.
- **Referral loop:** both sides earn Clovers/odds on the referee's first tap (mirrors Tuyo's +20% referral, tuned for play).
- **Channels:** TikTok + IG Reels first; campus ambassadors; "Roll a free [coffee/lunch]" stunt activations; X for the crypto-native crowd.
- **Narrative:** "Buy now. Pay maybe." + "the bank account that pays your bills sometimes." Lean into the *feeling* of the win, not APYs.
- **Seasons as launches:** each Season is a marketing beat with a theme, leaderboard, and prize amplification.

---

## 14. Metrics & KPIs

- **North Star:** **weekly active tappers** (users who tapped or Daily-Rolled in the last 7 days).
- **Activation:** % of installs reaching **first tap < 3 min**; first-Zero time.
- **Retention:** D1/D7/D30; streak length distribution; Daily Roll DAU.
- **Virality:** K-factor; share-card → install conversion.
- **Economics:** interchange per active; payoff ratio vs. budget; Prize Reserve coverage ratio; CAC vs. LTV.
- **Trust/safety:** withdrawal success rate; fraud loss rate; responsible-spend tool adoption; complaint rate.

---

## 15. Roadmap (indicative)

| Phase | Focus | Exit criteria |
|---|---|---|
| **0 — Foundations** | Partner contracts (Bridge, Rain/Visa, Circle, KYC), legal/sweepstakes architecture, wallet + ledger + VRF | Compliant program design signed off; testnet card auth → draw → reveal works |
| **1 — Private beta** | MVP (fund, card, roll, Clovers, Daily Roll), invite-only, single US-state-cleared cohort | First-tap < 3 min; positive cohort economics; zero custody incidents |
| **2 — Public US launch** | Seasons, leaderboards, referrals, physical card, share-card growth | K-factor > 1 in target segments; reserve coverage healthy |
| **3 — Depth & expansion** | Swap, multi-chain, Earn, EUR/MXN accounts + transfers, merchant-boosted odds | New revenue lines live; international pilot |

---

## 16. Risks & mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| **Sweepstakes/gambling reclassification** | High | Robust No-Purchase-Necessary AMOE, Official Rules, state exclusions, discretionary framing, registration/bonding where required |
| **IP / trademark — "Buy Now, Pay Maybe" & Tuyo similarity** | High | Use a distinct app name (Roll); use "Buy now. Pay maybe." only as a campaign line; full clearance search; differentiate brand/UX; counsel review before any public use |
| **GENIUS Act / "rewards vs. yield"** | Med-High | Frame rewards as discretionary third-party incentives; no issuer affiliate/anti-tying ties; monitor Treasury rulemaking |
| **Unit economics underwater** | High | Cohort-level modeling; dynamic caps/curve; ring-fenced Prize Reserve; kill-switch on payoff rate |
| **Custody/security incident** | High | Audits, bug bounty, MPC recovery, least-privilege, no central key reconstruction |
| **Encouraging unhealthy spending** | High (ethical + reg) | Free AMOE path, spend insights, self-exclusion/cool-downs, no dark patterns |
| **Partner/concentration risk (Bridge/Rain/Visa)** | Med | Multi-vendor optionality (Privy, alt issuers), contractual SLAs |
| **Regulatory variance by state/country** | Med | Geo-gating; phased rollout; local counsel |
| **Reveal latency / poor UX kills the magic** | Med | Real-time event pipeline; pre-auth draw where feasible; graceful fallbacks |

---

## 17. Open questions
1. Pre-authorization vs. post-settlement timing for the draw (affects UX immediacy and reversal handling).
2. Rain vs. Bridge×Visa for issuance in the launch geography — which clears compliance fastest?
3. Which launch state(s) minimize sweepstakes friction while maximizing Gen Z density?
4. Prize Reserve sizing and accounting treatment (prepaid marketing vs. contingent liability).
5. Do we ever do a token? If so, what's the securities-cleared path — and do we want that complexity?

---

## 18. Appendix

**Glossary.** *Roll* — a single draw on a tap; *Zero* — a purchase made free; *Clovers* — closed-loop loyalty points; *Daily Roll* — free no-spend play (AMOE); *AMOE* — Alternative Method of Entry; *PPSI* — Permitted Payment Stablecoin Issuer; *VRF* — verifiable random function.

**Selected sources.** tuyo.com (home/card/rewards/careers); Tuyo iOS App Store listing; The Block and IQ.wiki (Jorge Izquierdo / Aragon / EIP-1271); PitchBook & Tracxn (Tuyo funding); insights4vc, fintechwrapup, Crunchbase News (stablecoin cards & infra; Bridge/Stripe, Rain); paymentexpert, The Defiant, Stripe Sessions 2026 (Visa × Bridge, Lead Bank, on-chain settlement); US Senate Banking & Treasury/FinCEN materials and crypto-press coverage (GENIUS Act, BSA/AML, rewards-vs-yield); StriveCloud, Adjust, Yu-kai Chou, IntelMarketResearch, Whistl (Gen Z gamification & behavioral data). Figures from third-party trackers (e.g., Tuyo's ~$4M) are unverified and should be confirmed before reliance.

---

*This PRD is a product/engineering planning document, not legal, tax, or investment advice. The "Pay Maybe" mechanic and any stablecoin rewards program must be reviewed and signed off by qualified counsel (sweepstakes/promotions, payments, securities, and tax) before launch.*
