# Collective evidence assurance

Eric Gladstone · Research talk · Collective inference & AI reliability · Proposed to DARPA's Defense Sciences Office · November 2026.

An animated research talk on when networks of language-model agents become confidently wrong, and on a proposed research program to measure and forecast that failure. The first half reports controlled experiments: what changes when agents share conclusions instead of evidence, how outcomes spread across trials, how agents respond to verdicts, and what a planted verdict does to a group's final belief. The second half sets out the proposed science, the measure it would develop, and the tests by which its central claim could fail. The talk runs about 30 minutes at 1× across 17 pages.

Each page carries a label stating what kind of evidence it shows: a measured agent result, an illustrative rule, a schematic, or an untested hypothesis.

- **Live:** https://collectiveevidenceassurance.eric-c-gladstone.workers.dev
- **Also at:** https://graystoneindustries.co/talks/#collective-evidence-assurance (embedded)

## Use

Press play, or step through one passage at a time with ‹ › (or the arrow keys). The reading panel shows the whole page with the current passage marked. Scrolling holds the text while the stage continues, and the page menu jumps to any page. Each page has a direct link (`#page-id`). `?embed=1` hides the page header and the text drawers.

Run locally with any static server, for example `python3 -m http.server 8990 --directory public`.

## Files

`public/` is the whole site: the player (`index.html`, `player.js`, `player.css`), the timed text (`timeline.js`), the references (`sources.js`), the stage in `deck/` with its scenes in `deck/scenes/`, and self-hosted Geist fonts. It makes no third-party requests. The player and stage engine are shared with *Networks of communicating machine agents*.
