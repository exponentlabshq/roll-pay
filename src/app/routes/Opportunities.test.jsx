/**
 * Opportunities feed tests (M3-F03).
 *
 * Pins down the visible behavior validation contract assertions
 * M3-A12 and M3-A13 depend on:
 *   - The feed renders ≥3 mock opportunity cards (we have 6).
 *   - Each card shows a title, company, summary, payout chip, and
 *     an "Apply" button.
 *   - Tapping Apply flips the card's button label to "Applied",
 *     disables the button, and surfaces a confirmation toast
 *     "Applied — we'll be in touch." that auto-dismisses after 3s.
 *
 * No router, no preact-router mock — the component is self-contained
 * and doesn't navigate.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, screen, act } from '@testing-library/preact';
import { mockOpportunities } from '../mocks/mockOpportunities.js';
import Opportunities from './Opportunities.jsx';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Opportunities — initial render', () => {
  it('renders an EARN eyebrow and an Opportunities h1', () => {
    render(<Opportunities />);
    expect(screen.getByText(/earn/i)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Opportunities' })).toBeTruthy();
  });

  it('renders all 6 mock opportunity cards with title, company, payout, and Apply', () => {
    render(<Opportunities />);
    expect(mockOpportunities.length).toBeGreaterThanOrEqual(3); // contract floor
    for (const opp of mockOpportunities) {
      const card = screen.getByTestId(`opportunity-card-${opp.id}`);
      expect(card).toBeTruthy();
      expect(card.textContent).toContain(opp.title);
      expect(card.textContent).toContain(opp.company);
      expect(card.textContent).toContain(opp.payout);
      expect(card.textContent).toContain(opp.summary);
      expect(screen.getByTestId(`opportunity-apply-${opp.id}`)).toBeTruthy();
    }
  });

  it('list container is scrollable (overflow-y-auto on the feed)', () => {
    render(<Opportunities />);
    const list = screen.getByTestId('opportunities-list');
    expect(list.className).toContain('overflow-y-auto');
  });

  it('does not render the toast on initial mount', () => {
    render(<Opportunities />);
    expect(screen.queryByTestId('opportunities-toast')).toBeNull();
  });
});

describe('Opportunities — Apply flow', () => {
  it('tapping Apply shows the confirmation toast', () => {
    render(<Opportunities />);
    const first = mockOpportunities[0];
    fireEvent.click(screen.getByTestId(`opportunity-apply-${first.id}`));
    const toast = screen.getByTestId('opportunities-toast');
    expect(toast).toBeTruthy();
    expect(toast.textContent).toBe("Applied — we'll be in touch.");
  });

  it('flips the tapped card button label from "Apply" to "Applied" and disables it', () => {
    render(<Opportunities />);
    const first = mockOpportunities[0];
    const btn = screen.getByTestId(`opportunity-apply-${first.id}`);
    expect(btn.textContent).toBe('Apply');
    expect(btn.hasAttribute('disabled')).toBe(false);

    fireEvent.click(btn);

    const btnAfter = screen.getByTestId(`opportunity-apply-${first.id}`);
    expect(btnAfter.textContent).toBe('Applied');
    expect(btnAfter.hasAttribute('disabled')).toBe(true);
  });

  it('other cards remain in their default Apply state when one card is applied', () => {
    render(<Opportunities />);
    fireEvent.click(
      screen.getByTestId(`opportunity-apply-${mockOpportunities[0].id}`)
    );
    const second = mockOpportunities[1];
    expect(
      screen.getByTestId(`opportunity-apply-${second.id}`).textContent
    ).toBe('Apply');
  });

  it('toast auto-dismisses after 3000ms', () => {
    render(<Opportunities />);
    fireEvent.click(
      screen.getByTestId(`opportunity-apply-${mockOpportunities[0].id}`)
    );
    expect(screen.getByTestId('opportunities-toast')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.queryByTestId('opportunities-toast')).toBeNull();
  });

  it('re-applying a different card after dismissal re-shows the toast', () => {
    render(<Opportunities />);
    fireEvent.click(
      screen.getByTestId(`opportunity-apply-${mockOpportunities[0].id}`)
    );
    act(() => {
      vi.advanceTimersByTime(3100);
    });
    expect(screen.queryByTestId('opportunities-toast')).toBeNull();

    fireEvent.click(
      screen.getByTestId(`opportunity-apply-${mockOpportunities[1].id}`)
    );
    expect(screen.getByTestId('opportunities-toast')).toBeTruthy();
  });
});
