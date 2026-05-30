/**
 * Onboarding carousel tests (M3-F01).
 *
 * These tests pin down the visible behavior that the validation
 * contract assertions M3-A03..M3-A07 depend on:
 *   - Initial render shows screen-1 copy and the first dot active.
 *   - Clicking "Next" advances copy + dot through 3 screens.
 *   - Pointer drag right→left advances; left→right retreats.
 *   - The Sign up button is disabled until the input is non-empty.
 *   - Submitting calls completeOnboarding() then routes to /home.
 *
 * preact-router's `route()` is mocked because we don't mount a Router
 * here — the SUT just calls it, and we assert it was called.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/preact';
import { useRollStore } from '../store/index.js';

// Mock preact-router's `route()` so we can assert navigation without
// mounting a Router.
//
// `vi.hoisted` is required because `vi.mock` is hoisted to the top of
// the file by Vitest's transformer — any reference inside the factory
// has to also be hoisted, otherwise it resolves to `undefined` when
// the mock runs.
const { routeMock } = vi.hoisted(() => ({ routeMock: vi.fn() }));
vi.mock('preact-router', () => ({
  route: (path) => routeMock(path),
}));

import Onboarding from './Onboarding.jsx';

// Note: the store's reset() in M1 calls `set(state, true)` which
// REPLACES state entirely — that wipes the action methods. We avoid it
// here and just clear `onboarded` directly so we don't break the store
// between tests.
beforeEach(() => {
  routeMock.mockClear();
  localStorage.clear();
  useRollStore.setState({ onboarded: false });
});

describe('Onboarding — initial render', () => {
  it('renders screen 1 copy and marks dot 0 as the active step', () => {
    render(<Onboarding />);
    expect(
      screen.getByTestId('onboarding-copy').textContent
    ).toBe('Hold money, earn entries to win every week.');
    expect(
      screen.getByTestId('onboarding-dot-0').getAttribute('data-active')
    ).toBe('true');
    expect(
      screen.getByTestId('onboarding-dot-1').getAttribute('data-active')
    ).toBe('false');
    expect(
      screen.getByTestId('onboarding-dot-2').getAttribute('data-active')
    ).toBe('false');
  });
});

describe('Onboarding — Next button advances through all 3 screens', () => {
  it('clicks advance copy and step indicator from 0 → 1 → 2', () => {
    render(<Onboarding />);
    // Step 0 → 1
    fireEvent.click(screen.getByText('Next'));
    expect(
      screen.getByTestId('onboarding-copy').textContent
    ).toBe('Spend on your card — some purchases are free.');
    expect(
      screen.getByTestId('onboarding-dot-1').getAttribute('data-active')
    ).toBe('true');

    // Step 1 → 2 (final screen — Next is replaced by the sign-up form).
    fireEvent.click(screen.getByText('Next'));
    expect(
      screen.getByTestId('onboarding-copy').textContent
    ).toBe('Powered by opportunities that pay you.');
    expect(
      screen.getByTestId('onboarding-dot-2').getAttribute('data-active')
    ).toBe('true');
    // On the final screen, the sign-up form replaces Next.
    expect(screen.queryByText('Next')).toBeNull();
    expect(screen.getByPlaceholderText('email or phone')).toBeTruthy();
  });
});

describe('Onboarding — swipe gestures', () => {
  it('right-to-left drag of >50px advances; left-to-right retreats', () => {
    const { container } = render(<Onboarding />);
    const root = container.firstChild;

    // Forward swipe (dx ≈ -120, well past the 50px threshold).
    fireEvent.pointerDown(root, { clientX: 200, pointerId: 1 });
    fireEvent.pointerUp(root, { clientX: 80, pointerId: 1 });
    expect(
      screen.getByTestId('onboarding-copy').textContent
    ).toBe('Spend on your card — some purchases are free.');

    // Backward swipe — dx > 50.
    fireEvent.pointerDown(root, { clientX: 50, pointerId: 1 });
    fireEvent.pointerUp(root, { clientX: 200, pointerId: 1 });
    expect(
      screen.getByTestId('onboarding-copy').textContent
    ).toBe('Hold money, earn entries to win every week.');
  });

  it('drags smaller than the threshold do not change step', () => {
    const { container } = render(<Onboarding />);
    const root = container.firstChild;
    fireEvent.pointerDown(root, { clientX: 100, pointerId: 1 });
    fireEvent.pointerUp(root, { clientX: 80, pointerId: 1 });
    expect(
      screen.getByTestId('onboarding-copy').textContent
    ).toBe('Hold money, earn entries to win every week.');
  });
});

describe('Onboarding — sign-up form on final screen', () => {
  it('Sign up is disabled when input is empty; submitting empty is a no-op', () => {
    render(<Onboarding />);
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));

    const submit = screen.getByText('Sign up');
    expect(submit.hasAttribute('disabled')).toBe(true);
    fireEvent.click(submit);
    // Onboarded flag has not flipped — completeOnboarding was not called.
    expect(useRollStore.getState().onboarded).toBe(false);
    expect(routeMock).not.toHaveBeenCalled();
  });

  it('any non-empty input enables Sign up, then submit calls completeOnboarding and routes /home', () => {
    render(<Onboarding />);
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));

    const input = screen.getByPlaceholderText('email or phone');
    fireEvent.input(input, { target: { value: 'x' } });

    const submit = screen.getByText('Sign up');
    expect(submit.hasAttribute('disabled')).toBe(false);
    fireEvent.click(submit);

    expect(useRollStore.getState().onboarded).toBe(true);
    expect(routeMock).toHaveBeenCalledWith('/home');
  });
});
