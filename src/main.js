// Roll — entry point. Imports the split stylesheet and the interactive
// modules. Each module self-initializes on import, mirroring the IIFE
// pattern of the original single-file landing page.

import './styles/index.css';

// Interactive modules — order matches the source script's IIFEs.
import './modules/ticker.js';
import './modules/tilt.js';
import './modules/demo.js';
// `confetti.js` is imported transitively by `demo.js` (used only on a winning roll).
