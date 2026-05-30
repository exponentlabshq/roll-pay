/**
 * Add Money flow tests (M3-F02).
 *
 * Pins down the visible behavior validation contract assertions
 * M3-A09..M3-A11 depend on:
 *   - "$" prefix + currency-formatted display ("0.00" by default,
 *     "25.00" after typing 2500).
 *   - "Add" button is disabled while cents === 0 and enables once
 *     a non-zero amount is entered.
 *   - Tapping Add shows the success overlay, after 1200ms calls
 *     addMoney(cents) and routes to /home.
 *   - Preset chips set cents directly (+$10 / +$25 / +$100).
 *
 * preact-router's route() is mocked because we don't mount a Router
 * here — the SUT just calls it, and we assert it was called.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, screen, act } from '@testing-library/preact';
import { useRollStore } from '../store/index.js';

const { routeMock } = vi.hoisted(() => ({ routeMock: vi.fn() }));
vi.mock('preact-router', () => ({
  route: (path) => routeMock(path),
}));

import AddMoney from './AddMoney.jsx';

beforeEach(() => {
  vi.useFakeTimers();
  routeMock.mockClear();
  localStorage.clear();
  // Known starting balance for assertions; bypass replace-state action
  // semantics by direct setState (matches Onboarding.test pattern).
  useRollStore.setState({ balance: 2000 });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('AddMoney — initial render', () => {
  it('shows $0.00 by default and Add is disabled', () => {
    render(<AddMoney />);
    expect(screen.getByTestId('add-money-display').textContent).toBe('$0.00');
    const submit = screen.getByTestId('add-money-submit');
    expect(submit.hasAttribute('disabled')).toBe(true);
  });
});

describe('AddMoney — typing renders currency-formatted display', () => {
  it('typing "2500" renders as $25.00 and enables Add', () => {
    render(<AddMoney />);
    const input = screen.getByTestId('add-money-input');
    fireEvent.input(input, { target: { value: '2500' } });
    expect(screen.getByTestId('add-money-display').textContent).toBe('$25.00');
    const submit = screen.getByTestId('add-money-submit');
    expect(submit.hasAttribute('disabled')).toBe(false);
  });

  it('strips non-digit characters before parsing', () => {
    render(<AddMoney />);
    const input = screen.getByTestId('add-money-input');
    fireEvent.input(input, { target: { value: '$1,2a3.4' } });
    // raw → "1234" → 1234 cents → $12.34
    expect(screen.getByTestId('add-money-display').textContent).toBe('$12.34');
  });

  it('clearing input falls back to $0.00 and disables Add', () => {
    render(<AddMoney />);
    const input = screen.getByTestId('add-money-input');
    fireEvent.input(input, { target: { value: '500' } });
    expect(screen.getByTestId('add-money-display').textContent).toBe('$5.00');
    fireEvent.input(input, { target: { value: '' } });
    expect(screen.getByTestId('add-money-display').textContent).toBe('$0.00');
    expect(
      screen.getByTestId('add-money-submit').hasAttribute('disabled')
    ).toBe(true);
  });
});

describe('AddMoney — preset chips', () => {
  it('+$25 chip sets cents to 2500 and enables Add', () => {
    render(<AddMoney />);
    fireEvent.click(screen.getByTestId('add-money-preset-2500'));
    expect(screen.getByTestId('add-money-display').textContent).toBe('$25.00');
    expect(
      screen.getByTestId('add-money-submit').hasAttribute('disabled')
    ).toBe(false);
  });
});

describe('AddMoney — submit flow', () => {
  it('Add shows success overlay, then after 1200ms calls addMoney and routes /home', () => {
    render(<AddMoney />);
    const input = screen.getByTestId('add-money-input');
    fireEvent.input(input, { target: { value: '2500' } });

    fireEvent.click(screen.getByTestId('add-money-submit'));

    // Overlay appears immediately.
    expect(screen.getByTestId('add-money-success')).toBeTruthy();
    // Balance hasn't changed yet, navigation hasn't fired yet.
    expect(useRollStore.getState().balance).toBe(2000);
    expect(routeMock).not.toHaveBeenCalled();

    // Advance past the 1200ms timer.
    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(useRollStore.getState().balance).toBe(4500); // 2000 + 2500
    expect(routeMock).toHaveBeenCalledWith('/home');
  });

  it('clicking Add while disabled is a no-op', () => {
    render(<AddMoney />);
    fireEvent.click(screen.getByTestId('add-money-submit'));
    // No overlay, no state change.
    expect(screen.queryByTestId('add-money-success')).toBeNull();
    expect(useRollStore.getState().balance).toBe(2000);
    expect(routeMock).not.toHaveBeenCalled();
  });
});

describe('AddMoney — back affordance', () => {
  it('back button routes to /home', () => {
    render(<AddMoney />);
    fireEvent.click(screen.getByLabelText('Back'));
    expect(routeMock).toHaveBeenCalledWith('/home');
  });
});
