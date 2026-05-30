// Single source of truth for `prefers-reduced-motion`.
// Evaluated once at import time, mirroring the original inline-script behavior.
export const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
