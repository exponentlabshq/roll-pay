# Roll — Brand & Design Language

> **"Buy now. Pay maybe."**
> The look, feel, voice, and tokens for a stablecoin tap-to-pay app Gen Z actually wants to open.

**Version 0.1 · May 2026 · Applies to:** product UI, marketing site, social, share cards, app store.

---

## 1. Brand at a glance

**One line:** Roll is the digital-dollar card where every tap is a chance to pay nothing.

**Personality.** Playful but trustworthy. Fast, confident, a little cheeky. The energy of a claw machine and a clean banking app had a baby. We're the friend who's *fun with money*, not the bank that lectures you and not the crypto bro who shills you.

**Brand archetype.** The **Magician × the Jester** — we make bills disappear, and we make it fun. Grounded by a quiet **Caregiver** note (your money is safe and yours).

**Three brand truths (never break these):**
1. **The win is the hero.** The $0.00 moment is the most important pixel we own. Everything else supports it.
2. **Fun, never reckless.** We celebrate wins; we never pressure spending or hide risk. Joy with guardrails.
3. **Clear over clever.** Money makes people anxious. When in doubt, be plain. Delight in the moments, clarity in the mechanics.

**What we sound like vs. what we don't:**
- ✅ "Your coffee was free. No, really."
- ✅ "Tap. Maybe it's on us."
- ❌ "Unlock unprecedented yield on your digital assets." (jargon, hype)
- ❌ "Spend more to win more!" (irresponsible, and legally radioactive)

---

## 2. Logotype & symbol

**Wordmark.** `roll` set in the display typeface, all-lowercase, tight tracking. The double-**o** is the brand's signature: render the two o's as a pair of **coins / dice pips** — slightly offset, one filled lime, one outlined. At small sizes, fall back to clean lettering.

**Symbol / app icon.** A single rounded coin-disc with a subtle motion arc (a coin mid-flip) on an ink background, lime face. The icon should read as "a coin in motion / about to land" — chance + money in one glyph.

**Clear space.** Keep clear space equal to the height of the "o" on all sides. Don't crowd it.

**Wordmark don'ts:** don't add gradients to the letters, don't outline, don't rotate, don't stretch, don't place on busy photography without a scrim, don't recolor the coins outside the palette.

---

## 3. Color

Dark-first. A near-black "ink" canvas makes the **acid lime** win-color pop like a neon sign, with **electric coral** as the energetic counterpoint. We deliberately avoid the default purple-gradient-on-white fintech cliché.

### 3.1 Core palette

| Token | Hex | Use |
|---|---|---|
| **Ink** | `#0B0E0C` | Primary background (dark) |
| **Ink Soft** | `#14181A` | Raised surfaces, cards on dark |
| **Ink Line** | `#262B2A` | Hairlines, borders on dark |
| **Paper** | `#F3F1E9` | Light background / inverted sections |
| **Paper Soft** | `#E8E5D8` | Light surface |
| **Lime (primary)** | `#C8FF3D` | The win. CTAs, the $0 moment, highlights |
| **Lime Deep** | `#A6E000` | Lime hover/pressed, on-paper lime text |
| **Coral (secondary)** | `#FF5A36` | "Maybe," energy, alerts-as-delight, accents |
| **Cream** | `#FFF7E6` | Warm text on ink, soft fills |
| **Cyan Spark** | `#5BE8FF` | Tertiary pop — use sparingly (≤10%) |

### 3.2 Functional colors
| Token | Hex | Use |
|---|---|---|
| **Success** | `#C8FF3D` | Reuse Lime — a win *is* success |
| **Warning** | `#FFC24D` | Gentle caution |
| **Danger** | `#FF5A36` | Reuse Coral — destructive/errors |
| **Text on ink** | `#F3F1E9` | Body text on dark |
| **Text muted** | `#9AA39E` | Secondary text on dark |
| **Text on paper** | `#0B0E0C` | Body text on light |

### 3.3 Signature gradients & effects
- **Holo-chrome (the card):** an iridescent sweep `linear-gradient(120deg,#C8FF3D, #5BE8FF, #FF5A36, #C8FF3D)` at low opacity over ink, animated to shift on tilt/hover. This is the premium, crypto-native shimmer.
- **Win glow:** a radial lime bloom behind the $0.00 reveal.
- **Grain:** a fine noise overlay (2–4% opacity) on dark sections for texture/depth — never let backgrounds read as flat black.

### 3.4 60-30-10 usage
Roughly **60%** ink/paper neutrals, **30%** one accent owning the section (lime *or* coral, not both fighting), **10%** the opposite accent + cyan spark. Lime is reserved for *winning* and *primary action*; don't dilute it by using it everywhere.

### 3.5 Accessibility
- Body text must hit **WCAG AA** (4.5:1). Lime on ink and paper on ink both pass for large/medium text; **never set long body copy in lime** (use cream/paper).
- Coral on ink passes for large text; pair with an icon/label, never color alone, for status.
- Provide a reduced-motion path (see §7).

---

## 4. Typography

A characterful grotesque for display, a clean humanist grotesque for body, and a mono for money. All available on Google Fonts.

```
Display:  "Bricolage Grotesque", sans-serif   /* expressive, modern, a little quirky */
Body:     "Hanken Grotesk", sans-serif         /* friendly, legible, neutral */
Numeric:  "Space Mono", monospace              /* receipts, amounts, the $0.00 reveal */
```

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### 4.1 Type roles
- **Display / hero:** Bricolage Grotesque 800, very tight tracking (`-0.03em`), big and unafraid. Used for "Buy now. Pay maybe." and headline numbers.
- **Headings:** Bricolage 700.
- **Body:** Hanken Grotesk 400–500, generous line-height (1.5–1.6).
- **Labels / micro:** Hanken 600, uppercase, wide tracking (`0.08em`).
- **Money / receipts / the reveal:** Space Mono — `$0.00` should *feel* like a receipt printout. This is where mono earns its keep.

### 4.2 Type scale (fluid)
| Token | clamp() | Role |
|---|---|---|
| `--fs-display` | `clamp(3rem, 9vw, 7rem)` | Hero |
| `--fs-h1` | `clamp(2.25rem, 5vw, 3.75rem)` | Section titles |
| `--fs-h2` | `clamp(1.6rem, 3vw, 2.5rem)` | Sub-sections |
| `--fs-h3` | `clamp(1.25rem, 2vw, 1.6rem)` | Card titles |
| `--fs-body` | `clamp(1rem, 1.2vw, 1.125rem)` | Body |
| `--fs-small` | `0.875rem` | Captions, legal |
| `--fs-mono-xl` | `clamp(2.5rem, 7vw, 5rem)` | The `$0.00` reveal |

**Don'ts:** no Inter/Roboto/Arial/system defaults; don't set body in the display face; don't justify; don't letter-space body text.

---

## 5. Spacing, radius, elevation

```css
:root{
  /* spacing (8pt base) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --space-9: 96px; --space-10: 128px;

  /* radius — friendly, rounded, toy-like but not childish */
  --radius-sm: 10px; --radius-md: 16px; --radius-lg: 24px;
  --radius-xl: 32px; --radius-pill: 999px;

  /* elevation — soft, colored shadows (not muddy grey) */
  --shadow-sm: 0 2px 8px rgba(0,0,0,.25);
  --shadow-md: 0 12px 32px rgba(0,0,0,.35);
  --shadow-lime: 0 16px 48px rgba(200,255,61,.28);
  --shadow-coral: 0 16px 48px rgba(255,90,54,.28);
}
```

Principles: **rounded corners everywhere** (we're soft, approachable), **colored glows** instead of grey drop-shadows for hero elements, and **generous breathing room** in marketing, **denser-but-clear** in product.

---

## 6. Components

**Buttons.**
- *Primary:* lime fill, ink text, pill radius, bold; on hover lifts with `--shadow-lime` and nudges up 2px.
- *Secondary:* transparent with cream/lime hairline border, cream text.
- *On-paper primary:* ink fill, lime text.
- Min touch target 44×44.

**The Card (signature object).** A tilted, holo-chrome Visa-style card on ink, lime logo, mono card-meta. It should subtly shift its iridescence on hover/scroll (3D tilt). This is the product's "face" — give it room.

**The $0.00 Reveal (most important component).** A receipt-style card: merchant, items, then the total animates from the real price to **`$0.00`** in Space Mono with a lime win-glow and a confetti burst. Includes a one-tap **Share** that produces a branded image. Losing states are gentle: "Not this time — streak safe, +Clovers."

**Live ticker / marquee.** A horizontal auto-scroll of recent Zeros ("Maya's ramen — $0.00", "Dev's Uber — $0.00") for social proof. Pauses on hover; respects reduced-motion.

**Chips & badges.** Pill chips for Clovers, streaks ("🔥 14-day"), and season tags. Use coral for "maybe/odds," lime for "won," cyan spark rarely.

**Stat blocks.** Big Bricolage numbers + small uppercase labels.

**Forms / inputs.** Ink-soft fills, cream text, lime focus ring (2px). Clear, large, minimal.

**Disclosure / legal.** Muted text, small but legible, never hidden. Trust is a feature.

---

## 7. Motion

Motion is core to the brand — the product is *about* anticipation and payoff.

- **Principle:** *snappy in, soft to rest.* Quick entrances (150–250ms), springy settle. Easing: `cubic-bezier(.2,.8,.2,1)`.
- **Hero load:** staggered reveal (headline → card → CTA → ticker) via `animation-delay`. One well-orchestrated entrance beats scattered fidgets.
- **The win:** confetti + scale-pop on the `$0.00`; the single most lavish animation in the product. Earn it; don't over-trigger.
- **The card:** continuous, subtle holo-shift; 3D tilt on pointer.
- **Micro:** buttons lift on hover; chips bounce on increment; ticker scrolls.
- **Reduced motion:** honor `prefers-reduced-motion` — disable confetti/marquee/tilt, keep instant state changes. Accessibility is non-negotiable.

---

## 8. Imagery, icon & illustration

- **Illustration:** flat, bold, rounded shapes in palette colors; coins, dice, sparkles, receipts, lightning. Slightly toy-like, never clip-arty.
- **Icons:** rounded, 2px stroke, consistent corner radius; lucide-style.
- **Photography (if used):** real, candid Gen Z moments (coffee, food, transit) with an ink scrim + lime accent overlay — the contexts where a Zero happens. Avoid stocky "happy people with laptops."
- **The share card** is our most-distributed asset: ink background, big mono `$0.00`, merchant + Roll mark, a confetti flourish. Design it to look *great* as a Story/Reel.
- **Emoji:** used sparingly and on-brand (🪙 🎲 ✨ 🔥). Never a wall of emoji.

---

## 9. Voice & tone

**Voice (constant):** warm, witty, plainspoken, never condescending. Short sentences. Active verbs.

**Tone (varies by context):**
- *Winning:* gleeful, generous. "Boom. That one's on us."
- *Mechanics/money:* calm, exact. "USDC is a digital dollar. $1 = $1. You hold it; we never do."
- *Errors:* honest + helpful, never blamey. "That didn't go through. Your money's safe — let's try again."
- *Legal/risk:* plain and upfront. We *over*-disclose the "maybe."

**Lexicon.** A tap = **a roll**. A free purchase = **a Zero** (or "on the house"). Points = **Clovers**. Free daily play = **the Daily Roll**. Don't say: "rewards points" (generic), "yield/APY" on balances (regulated), "guaranteed," "win every time."

**Always disclose the maybe.** "Maybe" is the whole promise — never imply purchases are *usually* free.

---

## 10. Do / Don't (quick reference)

**Do**
- Make the $0.00 the loudest thing on the screen.
- Keep lime for winning + primary action.
- Texture every dark section (grain/glow) — no flat black.
- Be plain about money and risk.
- Honor reduced-motion and AA contrast.

**Don't**
- Use purple-gradient-on-white or generic system fonts.
- Encourage "spend more to win more."
- Bury fees, odds, or the "maybe."
- Over-trigger confetti (devalues the win).
- Set body copy in lime or in the display face.

---

## 11. Design tokens (drop-in `:root`)

```css
:root{
  /* color */
  --ink:#0B0E0C;        --ink-soft:#14181A;   --ink-line:#262B2A;
  --paper:#F3F1E9;      --paper-soft:#E8E5D8;
  --lime:#C8FF3D;       --lime-deep:#A6E000;
  --coral:#FF5A36;      --cream:#FFF7E6;       --cyan:#5BE8FF;
  --warning:#FFC24D;
  --text-on-ink:#F3F1E9; --text-muted:#9AA39E; --text-on-paper:#0B0E0C;

  /* type */
  --font-display:"Bricolage Grotesque",sans-serif;
  --font-body:"Hanken Grotesk",sans-serif;
  --font-mono:"Space Mono",monospace;
  --fs-display:clamp(3rem,9vw,7rem);
  --fs-h1:clamp(2.25rem,5vw,3.75rem);
  --fs-h2:clamp(1.6rem,3vw,2.5rem);
  --fs-h3:clamp(1.25rem,2vw,1.6rem);
  --fs-body:clamp(1rem,1.2vw,1.125rem);
  --fs-small:0.875rem;
  --fs-mono-xl:clamp(2.5rem,7vw,5rem);

  /* spacing */
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px;
  --space-9:96px; --space-10:128px;

  /* radius + elevation */
  --radius-sm:10px; --radius-md:16px; --radius-lg:24px;
  --radius-xl:32px; --radius-pill:999px;
  --shadow-sm:0 2px 8px rgba(0,0,0,.25);
  --shadow-md:0 12px 32px rgba(0,0,0,.35);
  --shadow-lime:0 16px 48px rgba(200,255,61,.28);
  --shadow-coral:0 16px 48px rgba(255,90,54,.28);

  /* motion */
  --ease-spring:cubic-bezier(.2,.8,.2,1);
  --dur-fast:160ms; --dur-med:240ms; --dur-slow:420ms;

  /* signature gradient */
  --holo:linear-gradient(120deg,#C8FF3D,#5BE8FF,#FF5A36,#C8FF3D);
}
```

---

*This is a living document. The north star for every decision: does it make the win feel better, or the money feel safer? If neither — cut it.*
