# HUE — A Chapter of Us

Personal romantic gift website (interactive cinematic love story, real Hue trip). Full brief: `.idea/promt.txt`.

## Stack
Static site only: HTML5, CSS3, vanilla JS ES6+, GSAP/ScrollTrigger via CDN. No React/Next/build step/backend. Deploys to GitHub Pages as-is.

## Content model
All copy, images, videos, captions live in `data/memories.json` — never hardcode content into JS/HTML. `data/config.js` holds site-wide settings (music path, chapter list).

## Hard rules
- Never invent dates, locations, or relationship details. Unconfirmed fields stay empty or clearly marked as placeholders (see existing `memories.json` for the convention).
- No autoplaying audio before user interaction.
- Don't commit or push to git without explicit approval.
- Don't delete or overwrite real media the user adds under `assets/`.
- Keep animations respecting `prefers-reduced-motion`.
