/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/index.html', './src/app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-line': 'var(--ink-line)',
        lime: 'var(--lime)',
        'lime-deep': 'var(--lime-deep)',
        coral: 'var(--coral)',
        cream: 'var(--cream)',
        cyan: 'var(--cyan)',
        paper: 'var(--paper)',
        'paper-soft': 'var(--paper-soft)',
        warning: 'var(--warning)',
        // Used by bottom-nav inactive labels and other muted chrome.
        // Class form is `text-text-muted` (utility prefix `text-` +
        // color name `text-muted`); awkward but matches the brand var.
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        body: ['Hanken Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      borderRadius: {
        md: '16px',
        lg: '24px',
        xl: '32px',
        pill: '999px',
      },
      boxShadow: {
        lime: '0 16px 48px rgba(200,255,61,.28)',
        coral: '0 16px 48px rgba(255,90,54,.28)',
      },
    },
  },
  plugins: [],
};
