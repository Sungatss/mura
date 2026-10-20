# MURA project handoff

**Purpose:** transfer the implementation and decisions from this Codex conversation to another account. This document records the repository as inspected on **2026-10-20 at about 15:25 UTC+05:00**, before the handoff-only commit. The implementation baseline was `3be61294077f3735c9028a41f11eaa350245a5ae`; the next agent must check the actual HEAD again.

## 1. PROJECT OVERVIEW

- **Project name requested now:** MURA. **Important discrepancy:** the original planning brief named the product **TARIQ**, and the current app, metadata, favicon, package name, and README still use TARIQ. The latest MURA instruction is the desired brand; the rename has not been implemented.
- **Purpose:** a source-grounded educational atlas of Kazakhstan with an interactive historical map, timeline, events, figures, an eventual contextual AI guide, localization, and a quiz. The map is the product, not a marketing landing page.
- **Event:** Republic Day Hackathon 2026. **Deadline:** October 21, 2026 at 13:00 Kazakhstan time (UTC+05:00 in this workspace). At the inspection time above, roughly 21 hours 35 minutes remained; recalculate on opening.
- **Audience/value:** learners and the general public exploring changes across selected periods of Kazakh history. Show uncertainty, provenance, and the difference between a territorial reconstruction and a demonstrated fact.
- **Repository:** <https://github.com/Sungatss/mura>. **Local checkout:** `/home/sungat/republic_hack_mura`.
- **Implemented stack:** Next.js 16.4.2 App Router, React 19.3.1, TypeScript 5.9, MapLibre GL JS 6.15, Tailwind CSS 4 import plus custom CSS, JSON/GeoJSON, OpenFreeMap basemap, GitHub. `shadcn/ui` was preferred in the original brief but is not installed. Gemini and Vercel are planned, not implemented/verified.

## 2. COMPLETE DEVELOPMENT HISTORY

| Commit | Verified implementation |
| --- | --- |
| `7889203` | Initial repository commit. |
| `87bb6e9` — Phase 1 | Next.js/TypeScript foundation, MapLibre interactive map, responsive atlas layout, navy/parchment/gold styling, custom `T` favicon, initial README and `GEMINI_API_KEY` example. Product was named TARIQ. |
| `69b72ce` — Phase 2 | Three selectable era slices; Seshat Cliopatria v0.2.1 territory GeoJSON; era-specific fetch/switching of territory and event sources; MapLibre layer updates; separate clearly nonhistorical fixture; loading/error/empty states; catalog/GeoJSON validation and reproducible territory import. |
| `3be6129` — Phase 3 | Twelve sourced historical events across the three eras, six linked figures, era highlights, event/figure detail views, source links, approximate-location warnings, one approximate historical marker, null geometry for unmapped events, stronger relationship/provenance validation, responsive and browser QA. |

**Phase 4:** no implementation commit or agreed detailed Phase 4 specification exists in this repository/conversation. The remaining P0 work is described in sections 4 and 11. Do not recreate Phases 1–3. The original first message requested planning only; later messages explicitly authorized implementation and requested commits/pushes after verification.

## 3. CURRENT REPOSITORY STATE

- At inspection: `main`, tracking `origin/main`, clean working tree, local/remote implementation HEAD `3be61294077f3735c9028a41f11eaa350245a5ae`. The commit that adds this document will become the new HEAD.
- `src/app/page.tsx` renders `AtlasShell`; `src/app/layout.tsx` sets Russian document language, page metadata, and MapLibre CSS; `src/app/icon.svg` is a custom TARIQ favicon.
- `src/components/atlas/atlas-shell.tsx` owns selected era, asynchronous fetch with abort/retry, overview/highlights, event and figure details, and source links.
- `src/components/atlas/map-canvas.tsx` owns the MapLibre map, territory fill/outline, point layer, click selection, and bounds fit. It filters null-geometry events before passing data to the map.
- `src/app/globals.css` contains the visual system and desktop/mobile breakpoints (`960px`, `380px`). The desktop side panel scrolls independently while the map stays prominent.
- `src/data/atlas.ts` is the era/source catalog; `src/data/figures.ts` contains six figure records; `src/lib/atlas/types.ts` defines the models; `src/lib/atlas/validate.ts` validates the catalog, GeoJSON, provenance, highlights, and figure/event links.
- `public/data/eras/<era-id>/territories.geojson` and `events.geojson` are the per-era datasets. `technical-fixture` is explicitly nonhistorical.
- `scripts/validate-data.mjs` runs data assertions; `scripts/import-cliopatria.py` reproduces extraction of the three Seshat polygons from a SHA-256-pinned archive.
- `README.md`, `AGENTS.md`, `.env.example`, `package.json`, and `package-lock.json` describe setup and dependency versions.
- **Environment variable name:** `GEMINI_API_KEY` appears in `.env.example`; no value is committed. No server-side Gemini API route or other application environment variable is present.
- **Commands:** Node.js 20.9+; `npm ci`, `npm run dev`, `npm run validate:data`, `npm run lint`, `npm run typecheck`, `npm run build` (runs validation first), `npm run start`. `npm test` is not defined.
- **Deployment:** GitHub push was verified. No Vercel configuration, deployment URL, CI workflow, or successful live deployment is recorded in the repository or this conversation. Treat Vercel status as **unverified** and do not claim the site is deployed.

## 4. FEATURES AND PRIORITIES

**Status meaning:** DONE = implemented and checked within the stated scope; IN PROGRESS = partial; NOT STARTED = absent from this checkout; BLOCKED = cannot proceed without an external dependency. No feature below is marked BLOCKED merely because a key or deployment access will eventually be required.

| Priority | Feature | Status and precise scope |
| --- | --- | --- |
| P0 | Interactive historical map | **DONE** — MapLibre/OpenFreeMap, pan/zoom, approximate Seshat polygons, attribution. External tiles require network. |
| P0 | Dynamic historical timeline | **DONE** — three selectable slices and a separate fixture. |
| P0 | Era-specific GeoJSON territory changes | **DONE** — selected era fetches/validates data and updates MapLibre sources. Polygons are approximate research reconstructions, not authoritative borders. |
| P0 | Historical events and figures | **DONE** — 12 events, 6 linked figures, details, dates, sources, uncertainty. Coverage is limited to three slices. |
| P0 | Event markers | **IN PROGRESS** — one defensible approximate marker for Ordabasy; 11 events intentionally have no marker because reliable coordinates were not established. Never create markers just to raise the count. |
| P0 | Context-aware AI historical guide | **NOT STARTED** — no API route, model call, or UI. |
| P0 | Kazakh/Russian localization | **IN PROGRESS** — UI and long-form content are Russian; `{ ru, kk?, en? }` fields and some figure names are translation-ready. No complete Kazakh UI/content. |
| P0 | Historical quiz | **NOT STARTED**. |
| P0 | Responsive design | **DONE for current atlas** — browser-checked at 1280px and 320px; future views need separate QA. |
| P0 | Source attribution | **DONE for current content** — event source links and Seshat CC BY 4.0 attribution retained. |
| P0 | Vercel deployment | **NOT STARTED in verified work** — an external deployment could exist, but none was verified here. |
| P1 | History Timelapse | **NOT STARTED**. |
| P1 | Compare Eras | **NOT STARTED**. |
| P1 | Globe Mode | **NOT STARTED**. |
| P1 | Flashcards | **NOT STARTED**. |
| P1 | Historical Highlights | **DONE** — ranked highlights for the selected era. |
| P1 | XP and Leaderboard | **NOT STARTED**. |
| P1 | English localization | **IN PROGRESS at schema level only** — a few figure names have `en`; there is no English interface or complete translation. |
| P2 | Interactive Shezhire, genealogy, accounts, voice AI, 3D reconstructions, AR, advanced learning, school/UNT modules | **NOT STARTED** — explicitly outside the hackathon MVP. |

The original brief also mentioned multiple themes and AI explanations of differences between eras as bonuses; both are **NOT STARTED**. MURA branding and accurate Privacy Policy/Terms pages are mandatory design/release tasks, currently **NOT STARTED**.

## 5. STRICT DESIGN RULES

| Rule | Current assessment |
| --- | --- |
| Premium, clean, minimalistic, map-first interface; navy, parchment, subtle gold | **Implemented for current atlas.** Visual judgment remains subjective; CSS and browser inspection showed the map as the main desktop area. |
| No purple gradients, glassmorphism, pill buttons, emoji icons, fake metrics/reviews/counters, generic marketing hero, AI filler imagery, cursor effects, excessive animation, unnecessary landing page, or “Made with AI” badge | **Satisfied in inspected app code/UI.** Counts shown are actual data counts. Map bounds use a brief motion that respects reduced-motion settings. |
| Custom favicon | **Present**, but it carries the old TARIQ `T` and must be updated for MURA. |
| Brand name MURA | **Not satisfied:** UI, metadata, favicon, package name, and README still say TARIQ. This is a conversation-vs-repository discrepancy; the latest user instruction requests MURA. |
| No em dashes in UI copy | **Not fully satisfied:** `atlas-shell.tsx` displays `—` for unloaded counts; at least one event note also uses an em dash. Audit copy during the brand pass. Date ranges use en dashes and should not be confused with em dashes. |
| Privacy Policy and Terms & Conditions accurately reflecting functionality/data handling | **Missing:** no such routes/pages. Do not publish generic policies before the AI data flow is known. |
| Responsive desktop/mobile, typography, accessibility | **Current layout browser-checked** at 1280px and 320px with no 320px horizontal overflow. Continue keyboard/screen-reader testing for new features. |
| Historical accuracy and attribution | **Current data includes source IDs/links and uncertainty.** An expert review of every claim/translation is still advisable before submission. |

## 6. HISTORICAL DATA

- Era IDs and Seshat polygon slices: `kazakh-1468-1474`, `kazakh-1529-1555`, `kazakh-1721-1737`. Each has one territory polygon. `technical-fixture` has a synthetic polygon and point and must never be presented as historical evidence.
- Event counts: 3 / 4 / 5. The first era covers Abu'l-Khayr's death, Kerei/Janibek's struggle with the Shaybanids, and Kerei's last source mention. The second covers Tahir's later rule, Buidash in Zhetysu, Danila Gubin's 1535 report, and Haqnazar's strengthening. The third covers the Great Disaster, Ordabasy, Bulanty, Anyrakay, and the 1731 oath. Six figures: Kerei, Janibek, Tahir, Buidash, Haqnazar, and Abulkhair of the Junior Zhuz. Do not confuse the two historical Abu'l-Khayrs.
- Seshat source: [Cliopatria v0.2.1](https://github.com/Seshat-Global-History-Databank/cliopatria), **CC BY 4.0**, original archive SHA-256 `e10a4e429fca708788ff9e7572a95fce801fae55852d217cffabc1c59cd4eed4`. Extracted polygon coordinates were not changed. The displayed boundaries are one approximate scholarly reconstruction, never modern national borders relabeled as medieval territories.
- Event/figure references: mainly linked Qazaqstan Tarihy/e-history.kz articles, an archived textbook, and an [Open Kazakhstan account of the modern Birlik monument](https://openkazakhstan.kz/journals/%D0%9E%D1%80%D0%B4%D0%B0%D0%B1%D0%B0%D1%81%D1%8B%D0%B4%D0%B0%D2%93%D1%8B-%D1%81%D0%B5%D1%80%D1%83%D0%B5%D0%BD/). Exact URLs, access dates, source IDs, rights notes, and Seshat license URL are in `src/data/atlas.ts`. Non-Seshat materials are marked rights reserved; prose is paraphrased, with no copied images.
- Only `ordabasy-kurultai` has historical-event point geometry: `[69.246370, 42.310992]` (longitude, latitude). It locates the **modern memorial**, not a proven exact 1726 assembly location. It is labeled approximate, with a separate coordinate source. Other historical events have `geometry: null` and appear in lists/highlights only.
- Date uncertainty is visible: Tahir's endpoint differs across sources; Kerei's last mention is not his proven death date; Bulanty is shown about 1726–1728 and Anyrakay 1729–1730 because references disagree. Gubin's 1535 date is explicitly the **report date**, not necessarily the battle date. The 1731 oath is not described as an immediate accession of all Kazakh zhuzes.
- `LocalizedText` allows `ru`, optional `kk` and `en`; most descriptive content and the UI remain Russian. Translations require review. `validateCatalog`, `validateEraData`, and `validateHistoricalContent` check source references, years, coordinates, null vs mapped geometry, highlight ranks, and figure/event relationships. `npm run validate:data` also exercises invalid-boundary, fabricated-marker, and broken-link rejection.
- **Critical import pitfall:** `scripts/import-cliopatria.py` writes **empty** `events.geojson` for all three historical eras as part of its Phase 2 extraction. Running it against the current working tree without preserving/restoring Phase 3 event files will erase the 12 events. It is a polygon reproduction tool, not a safe full-data refresh script.

## 7. AI ARCHITECTURE

- **Current state:** no Gemini integration, server route, prompt, chat panel, retrieval index, or NotebookLM integration exists. `.env.example` only reserves `GEMINI_API_KEY=`; never expose a value to client code, Git, logs, or the handoff.
- **Required design:** a server-side Next.js endpoint should receive the selected era and optionally selected event/figure plus the user's question; the server should construct context only from the reviewed atlas data and source catalog. Return concise answers with clickable source citations, clearly state uncertain claims and unsupported questions, and avoid invented events, dates, coordinates, or references. Validate request size/IDs and handle missing key, provider failures, loading, and empty grounding.
- **Localization:** identify response language (`kk`/`ru`, optionally `en`) separately from historical source language. Use reviewed translations or an explicit fallback; never present unreviewed generated translations as verified historical content.
- **Security/privacy:** call Gemini only on the server, keep the API key server-side, decide what user questions are transmitted/retained, and write truthful Privacy Policy/Terms before release. Do not claim provider privacy behavior without checking actual configuration/terms.
- **NotebookLM:** no integration decision or supported runtime API has been verified. It may help a human research sources, but do not assume it can be used as the production backend or that its outputs replace direct citations.

## 8. DEVELOPMENT WORKFLOW

1. Open `/home/sungat/republic_hack_mura`; inspect `git status -sb`, HEAD, `AGENTS.md`, this document, and the actual code before editing. Follow the repo's `AGENTS.md`: read relevant installed Next.js docs under `node_modules/next/dist/docs/` before new Next.js code.
2. Work in small, reviewable milestones. Keep data separate from UI and the atlas runnable; avoid adding libraries without need. Use the checked-out `main` only when no teammate/account is editing it; otherwise use separate branches/worktrees and coordinate file ownership. Never overwrite another account's working tree.
3. Install from the lockfile with `npm ci` if needed. Run `npm run validate:data`, `npm run lint`, `npm run typecheck`, `npm run build`, then exercise the actual browser at desktop and 320px. `prebuild` already runs data validation.
4. In this Codex Desktop sandbox, a restricted `next build` previously failed while parsing TypeScript `--showConfig`, and binding a local test server returned `EPERM`; the same production build/server passed with permitted execution. Treat these as environment permission symptoms, not product failures. Next may rewrite tracked `next-env.d.ts` on build; restore that generated-only diff if no intentional change is needed.
5. Stage only intended files, commit after checks pass, push to `origin/main` when authorized, then verify a clean tree and matching local/remote SHA. The user explicitly asked for commit/push after verified work and previously preferred this for repo changes. This handoff task itself must commit/push **only** `PROJECT_HANDOFF.md`.
6. Reserve time for a deployed-browser smoke test, source/translation review, and the hackathon presentation. Local production preview is not deployment proof.

## 9. QUALITY AND TESTING

- On the Phase 3 implementation commit `3be6129`, `npm run validate:data`, `npm run lint`, `npm run typecheck`, and production `npm run build` passed. `git diff --check` passed; the commit was pushed and the remote SHA matched. The current inspection found a clean tree before this handoff.
- Actual browser checks on the production build covered all three era switches and map source updates; overview/highlights and event counts; event-to-figure navigation; source link hrefs; approximate Ordabasy marker and click-to-detail; the technical fixture; empty and malformed GeoJSON states plus retry/recovery. Temporary fixture modifications used for error/empty QA were restored. At 320px, `scrollWidth` did not exceed viewport width; desktop panel scrolling was checked at 1280px.
- `npm audit --omit=dev` found **0 production vulnerabilities** at that check. Full `npm audit` reported **five high findings** in one development-only ESLint chain: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces@3.0.3`. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) listed no patched `braces` version at the time; npm suggested a major/incompatible ESLint-config downgrade. No package was blindly changed. Reassess against current advisories before release.
- Known gaps/risks: old TARIQ branding, missing policy pages, incomplete Kazakh/English localization, AI and quiz absent, deployment unverified, only one mappable historical event, source-date disagreements, and no automated UI/E2E test suite or independent historical expert sign-off. Browser basemap needs network access. Do not call these features tested or deployed when they are not.

## 10. TEAM RESPONSIBILITIES

These are **assignments from the original brief**, not proof that other members have already contributed:

1. **Main developer / Tech Lead (user + Codex):** architecture, integration, implementation, server-side AI/key security, Git, build, deployment, final acceptance.
2. **Historical research / Data:** verify claims and coordinates, find appropriately licensed GeoJSON/sources, review uncertainty and references, provide human-reviewed Kazakh/Russian translations. Work in data files or a separate branch; do not regenerate/overwrite Phase 3 events.
3. **UI/UX / Testing / Presentation:** design review against the strict rules, mobile/accessibility checks, educational copy/quiz review, demo flow, presentation and submission assets. Coordinate component edits with the developer.

An additional AI account was available for independent research/reviews. Parallelize bounded tasks by file/branch ownership; one integrator reviews and merges changes. No actual completed teammate contributions are documented here.

## 11. IMMEDIATE NEXT STEPS

**Next phase: Phase 4, completing the remaining P0 hackathon MVP.** This label is a proposed continuation, not an existing Phase 4 commit. At the inspection time, the deadline was under 22 hours away. Read `src/components/atlas/atlas-shell.tsx`, `map-canvas.tsx`, `src/data/atlas.ts`, `src/data/figures.ts`, `src/lib/atlas/{types,validate}.ts`, the GeoJSON files, `src/app/layout.tsx`, `globals.css`, `.env.example`, `README.md`, and `AGENTS.md` before changes.

1. **Resolve the brand mismatch in code:** change user-facing TARIQ to the latest requested MURA across UI, metadata, favicon, README, and applicable package identifiers; check remaining em dashes. Preserve the atlas layout and attribution. Acceptance: no TARIQ in product surfaces, valid MURA favicon, build/browser pass.
2. **Implement the smallest grounded Gemini guide:** server-only key, context from selected era/event/figure and vetted sources, citations, uncertainty/abstention, RU/KK response path, clean missing-key/error states, no fabricated claims. Missing `GEMINI_API_KEY` blocks live provider verification but does not block safe local architecture; request/configure it only in a secure environment.
3. **Complete Kazakh/Russian localization and a focused quiz:** separate UI copy from historical content, obtain review from the data teammate, preserve source IDs and fallbacks; use only verifiable quiz questions with explanations/sources. Acceptance: switch locale across atlas/details/quiz/AI, no untranslated core UI, quiz answers checked against sources.
4. **Write truthful Privacy Policy and Terms pages after the real AI data flow is known.** Include external map/provider attribution and actual question-processing behavior; no boilerplate claims about nonexistent accounts or storage.
5. **Deploy and verify Vercel early enough to fix environment issues:** configure server-only key in Vercel if available, deploy a preview, test historical data URLs, MapLibre worker/tiles, desktop and 320px, legal pages, quiz, AI citation behavior, and favicon. Record the actual URL and deployment SHA. Do not claim deployment from `next build` alone.
6. Run data validation, lint, typecheck, production build, browser interactions, and dependency review; commit/push verified milestones. Reserve time for a short live demo and submission.

**Do not change:** Seshat polygon coordinates/CC BY 4.0 credit, sourced historical claims without review, the null-geometry policy for unmappable events, or the explicit technical-fixture label. **Postpone if time runs short:** P1 timelapse/compare/globe/flashcards/XP/themes, all P2 features, full English translation, and decorative effects. Reduce AI/quiz scope before compromising provenance or pretending an incomplete P0 feature works.

## 12. IMPORTANT CONVERSATION DECISIONS

- Accuracy overrides marker quantity: no fabricated event points, dates, boundaries, or citations; no modern nation polygons passed off as medieval territories. Source disputes must be visible. Verified/approximate reconstruction and modern monument position are distinct concepts.
- Use one per-era event GeoJSON for event content; `geometry: null` keeps unlocated events in the educational timeline/sidebar while MapLibre receives only Point features. One modern memorial coordinate is a clearly approximate locator, not a precise historical event position.
- Historical content is paraphrased; preserve source URLs and licenses. Seshat credit is non-negotiable. The figure Abulkhair of the Junior Zhuz is distinguished from the earlier Shaybanid Abu'l-Khayr.
- Preserve the working map, era switching, favicon behavior, mobile usability, and restrained visual design. Avoid needless dependencies/refactors and hypothetical features in the UI. The current favicon exists but must be rebranded, not discarded.
- The original brief named TARIQ; this handoff request explicitly says **MURA, not TARIQ**. Record both facts, then follow the latest brand request in future implementation. No rename was made during this context-transfer task.
- Full translations, Gemini, quiz, legal pages, and Vercel deployment have not been completed. No NotebookLM integration was agreed or built. No feature may be claimed from a mock/local preview alone.
- The user wants direct, precise communication, useful pushback, clarification only when information is genuinely missing, and explicit reporting of implemented/tested/blocked work. Validate, commit, push, and verify the remote after completed code milestones.

## 13. NEXT AGENT STARTUP INSTRUCTIONS

Copy this exact prompt into the new Codex account:

> Continue MURA from `/home/sungat/republic_hack_mura` and <https://github.com/Sungatss/mura>. First read `PROJECT_HANDOFF.md` and `AGENTS.md`; inspect the actual repository, Git branch/status/HEAD, and source files. Treat verified repository state as authoritative and note that current code still says TARIQ despite the latest MURA brand requirement. Find the next incomplete P0 task and implement Phase 4 without recreating Phases 1–3 or overwriting sourced GeoJSON. Preserve Seshat attribution and historical uncertainty. Coordinate concurrent work, run data validation, lint, typecheck, production build, and browser QA at desktop and 320px; commit and push only verified changes, then report the commit, remote status, remaining limitations, and any blockers. Do not invent historical facts, coordinates, citations, translations, or deployment status.
