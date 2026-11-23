# INK Manga Studio

A manga editor with panel layouts, pencil sketch layers, adjustable sketch opacity, pens, erasers, speech bubbles, tones, cover design and a saved-edition library.

The reference palette includes heads, hands, legs, torsos, four poses with three body proportions, and four backgrounds. Drag or tap a reference, position it with Move, then copy and paste between pages. Each reference has a construction tutorial. Sketch opacity and removal apply to the current page or cover and support Undo.

Drafts are saved in browser local storage. Export a project JSON file to transfer editable work. PNG exports include visible layers; set sketch opacity to zero or remove the sketch before exporting finished ink.

`dist/server/index.js` is a dependency-free Cloudflare Worker with an embedded client. Its `BUCKET` R2 binding stores published editions. Site access is private to the owner by default. GitHub stores application code, not user drafts or published manga files.

Run `node verify.cjs` to check the sketch and reference workflows. This is a script-level verification harness, not a browser test.
