/**
 * mockOpportunities — six fictional gig / internship cards rendered
 * by the Opportunities feed (M3-F03).
 *
 * Pure data only. No engine, no randomness — the Opportunities route
 * just maps over this array. Each entry must include:
 *   - id      string, stable for keying
 *   - title   role / position name
 *   - company fictional employer
 *   - payout  short payout chip text (e.g. "$5,500/mo")
 *   - summary one-sentence pitch shown under the company line
 *
 * Asserted by:
 *   - M3-A12 (≥3 scrollable cards visible)
 *   - M3-A13 (Apply confirmation surface — toast)
 */
export const mockOpportunities = [
  {
    id: '1',
    title: 'Junior SWE Intern',
    company: 'Stripe',
    payout: '$5,500/mo',
    summary: 'Backend ops, 12-week summer rotation.',
  },
  {
    id: '2',
    title: 'UX Research Apprentice',
    company: 'Linear',
    payout: '$3,000/mo',
    summary: 'Shadow product research on the next planning surface.',
  },
  {
    id: '3',
    title: 'Campus Ambassador',
    company: 'Notion',
    payout: '$1,200/mo',
    summary: 'Host two workshops a month, get paid in cash and credits.',
  },
  {
    id: '4',
    title: 'Content Strategist',
    company: 'Figma',
    payout: '$4,200/mo',
    summary: 'Write release notes and shape the design-systems blog.',
  },
  {
    id: '5',
    title: 'Data Annotation Lead',
    company: 'Anthropic',
    payout: '$45/hr',
    summary: 'Part-time labeling work for safety evals, remote-friendly.',
  },
  {
    id: '6',
    title: 'Growth Engineer (Contract)',
    company: 'Vercel',
    payout: '$6,800/mo',
    summary: 'Three-month sprint on the marketing funnel and onboarding.',
  },
];

export default mockOpportunities;
