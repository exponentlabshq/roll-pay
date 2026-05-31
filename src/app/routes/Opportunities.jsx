import { useEffect, useState } from 'preact/hooks';
import clsx from 'clsx';
import { mockOpportunities } from '../mocks/mockOpportunities.js';

/**
 * Opportunities feed (M3-F03).
 *
 * Layout (mobile-first 390×844):
 *   - Sticky header: eyebrow "EARN" + h1 "Opportunities" (font-display).
 *   - Below: a vertical scrollable list of 6 OpportunityCard rows.
 *     The list itself owns the overflow-y-auto + fixed height so the
 *     header stays visible while the feed scrolls (M3-A12).
 *   - Each card renders title + payout chip, company, summary, and
 *     a secondary "Apply" pill button.
 *
 * Apply interaction (M3-A13):
 *   - Tapping Apply on a card flips its local `applied` flag (the
 *     button label becomes "Applied" and is disabled).
 *   - A lime toast slides in from the bottom of the viewport with
 *     "Applied — we'll be in touch." and auto-dismisses after 3000ms.
 *   - Toast is fixed bottom-24 (above the bottom-nav at h-20) inset-x-4
 *     so it spans the safe horizontal area without touching the edges.
 *
 * State lives in this component (no store touch — applications are
 * purely demo-visual). Toast state is { message, key } where `key` is
 * a monotonically increasing counter so re-tapping Apply restarts the
 * 3 s timer with a fresh effect run.
 */

const TOAST_MS = 3000;

function OpportunityCard({ opp, onApply }) {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    if (applied) return;
    setApplied(true);
    onApply();
  };

  return (
    <article
      data-testid={`opportunity-card-${opp.id}`}
      class="rounded-lg bg-ink-soft p-4 border border-ink-line"
    >
      <div class="flex items-start justify-between gap-3">
        <h2 class="font-display text-lg text-cream leading-tight">
          {opp.title}
        </h2>
        <span class="font-mono text-xs bg-lime/20 text-lime border border-lime/40 rounded-pill px-2 py-0.5 whitespace-nowrap">
          {opp.payout}
        </span>
      </div>
      <p class="mt-1 font-body text-sm text-text-muted">{opp.company}</p>
      <p class="mt-2 font-body text-sm text-cream">{opp.summary}</p>
      <button
        type="button"
        data-testid={`opportunity-apply-${opp.id}`}
        disabled={applied}
        onClick={handleApply}
        class={clsx(
          'mt-3 bg-transparent border border-cream/30 text-cream rounded-pill h-10 px-4 font-body text-sm',
          applied && 'opacity-60'
        )}
      >
        {applied ? 'Applied' : 'Apply'}
      </button>
    </article>
  );
}

export default function Opportunities() {
  // Toast state — `key` bumps every time a new toast is shown so the
  // useEffect timer resets cleanly on rapid successive Applies.
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(id);
  }, [toast]);

  const handleApply = () => {
    setToast({ message: "Applied — we'll be in touch.", key: Date.now() });
  };

  return (
    <section class="px-6 pt-8">
      <p class="font-body uppercase tracking-wider text-text-muted text-xs">
        Earn
      </p>
      <h1 class="font-display text-3xl text-cream mt-1">Opportunities</h1>

      <div
        data-testid="opportunities-list"
        class="mt-6 overflow-y-auto h-[calc(100vh-200px)] flex flex-col gap-3 pr-1"
      >
        {mockOpportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opp={opp}
            onApply={handleApply}
          />
        ))}
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          data-testid="opportunities-toast"
          class="fixed bottom-24 inset-x-4 bg-lime text-ink rounded-md p-3 z-50 font-body text-sm text-center transition-opacity duration-200"
        >
          {toast.message}
        </div>
      )}
    </section>
  );
}
