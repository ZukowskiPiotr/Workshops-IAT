# Verification and pre-workshop device check

Verification date: 14 October 2026. This is technical validation of an educational implementation, not validation of a Polish psychometric instrument.

## Automated checks

From the project directory, with Node.js installed:

```sh
node tests/core.cjs
```

No packages are required. The tests exercise 200 deterministic random designs across all four order/side conditions. They confirm 15/15/15/30/30/15/30 trial counts, 150 total, category and within-category exemplar frequencies differing by at most one, response sides differing by at most one, valid stimulus categories, sequence repetition constraints, exactly one correct side, domain-side consistency and gender reversal.

The scoring fixture independently uses means A=600 ms and B=800 ms, with repeated −50/0/+50 ms offsets. For concatenated pair sizes N=30 and N=60 the analytically derived sample variance is `N×(100²+2×50²/3)/(N−1)`. Expected D is the average of `200/sqrt(350000/29)` and `200/sqrt(700000/59)`. Tests verify equality to numerical tolerance, reversed sign, both presentation orders, built-in correction cost without an extra penalty, changed correction latency, incomplete/missing/interrupted data, 10% fast-response boundary, exactly 300 ms, 10,000/10,001 ms, minimum retained trials, 35% error rule (31/90 accepted, 32/90 rejected), zero SD and inconsistent mappings.

Optional browser test, with developer Playwright available and macOS Chrome installed:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright node tests/browser.cjs
```

This environment used the bundled Playwright at `/Users/zukowskipiotr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`. This machine-specific path is a testing convenience, not a runtime import. The test starts a temporary loopback server, launches installed Chrome headlessly and closes both. It loads the app under `/demo/` to check repository-subfolder paths. It shortens the blank gap in its intercepted configuration for test speed, leaves response logic intact, and uses a shortened timeout only for the inactivity check.

Browser coverage: a full 150-trial touchscreen session with one intentionally wrong initial answer, visible X and subsequent correction; all seven instruction screens; result availability only after completion; restart; withdrawal; inactivity abort; valid numerical result rendering from a synthetic dataset; no page JavaScript errors. Geometry checks: 320×568, 375×667, 390×844, 360×640 and 568×320; no horizontal overflow, visible buttons with >44 px height, and stimulus above the buttons. Checks include both single and combined blocks, absence of the upper label section on every trial, correct button categories/counters and equal indigo button styling. Progress is checked against completed trials on every trial and equals 100% only on completion.

Main foreground/background contrast checks: white on indigo 13.40:1, body text on white 14.89:1, muted text on the pale surface 5.84:1, crimson error text on white 4.86:1. A darker cyan variant is used for progress/comparison graphics.

Core, syntax and Chrome emulation checks passed. The synthetic result test validates rendering, not a human score. Fast automated responses are correctly refused numerical feedback. The comparison bars, 90/90 retained-trial label and explanatory text are verified separately with valid synthetic latencies. The D1 formula, sign and all proportional quality thresholds are unchanged. This shortened adaptation has not been psychometrically validated against the 200-trial version.

## Limits

No physical iPhone or Android device was tested. Safari/WebKit was not automated; Chrome emulation does not establish Safari timing or physical touch/display latency. This refinement has not been pushed to GitHub or deployed; the existing public deployment was not retested. Participant-facing timing is browser-based and not calibrated using external hardware. Exact workshop condition balance, stimulus norms and psychometric reliability are not established by these tests. The restrained layout uses system fonts, pointer events, relative paths and viewport fallbacks, but physical-device confirmation is still required.

## Manual checklist: iOS Safari and Android Chrome

- Scan the final QR code; check the final HTTPS URL and Polish entry screen. No account/install prompt should be necessary.
- Complete a whole session on each platform. Confirm seven blocks, category changes before block 5/6, and both mapping orders over several fresh sessions.
- Test a small screen with browser bars visible, and landscape before starting a block; verify both combined labels, long words, no clipping or sideways scrolling.
- Respond once incorrectly; confirm X remains and the trial advances only after correct response. Repeat a wrong correction. Test a fast second tap/multitouch; confirm it does not produce duplicate rows or silently bypass a trial.
- Wait without responding: the inactivity timeout should terminate with an unavailable result. Withdraw midway and confirm no remaining task trials appear.
- Switch apps, change orientation or hide the browser during a trial; the eventual result should explain interruption rather than display D.
- Test after closing heavy apps, with notifications silenced. Check responsiveness across Wi-Fi and mobile data; after assets load, scoring requires no server request.
- Confirm result number, direction explanation, mapping means in ms, bars, limitations and restart. Keep results private; do not require score sharing.
- Review category agreement and familiarity with a small age-appropriate pilot before a workshop. Confirm all institutional/parental/student participation procedures with the responsible organisers.
- Save the tested source version before the event. Do not change deployed files during sessions.
