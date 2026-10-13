# Verification and pre-workshop device check

Verification date: 13 October 2026. This is technical validation of an educational implementation, not validation of a Polish psychometric instrument.

## Automated checks

From the project directory, with Node.js installed:

```sh
node tests/core.cjs
```

No packages are required. The tests exercise 200 deterministic random designs across all four order/side conditions. They confirm 20/20/20/40/40/20/40 trial counts, 200 total, equal exemplar and response-side frequencies, valid stimulus categories, exactly one correct side, domain-side consistency and gender reversal.

The scoring fixture independently uses means A=600 ms and B=800 ms, with alternating ±50 ms offsets. For concatenated pair sizes N=40 and N=80 the analytically derived sample variance is `N×(100²+50²)/(N−1)`. Expected D is the average of `200/sqrt(40×12500/39)` and `200/sqrt(80×12500/79)`. Tests verify equality to numerical tolerance, reversed sign, both presentation orders, built-in correction cost without an extra penalty, changed correction latency, incomplete/missing/interrupted data, 10% fast-response boundary, exactly 300 ms, 10,000/10,001 ms, minimum retained trials, 35% error boundary, zero SD and inconsistent mappings.

Optional browser test, with developer Playwright available and macOS Chrome installed:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright node tests/browser.cjs
```

This environment used the bundled Playwright at `/Users/zukowskipiotr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`. This machine-specific path is a testing convenience, not a runtime import. The test starts a temporary loopback server, launches installed Chrome headlessly and closes both. It loads the app under `/demo/` to check repository-subfolder paths. It shortens the blank gap in its intercepted configuration for test speed, leaves response logic intact, and uses a shortened timeout only for the inactivity check.

Browser coverage: a full 200-trial touchscreen session with one intentionally wrong initial answer, visible X and subsequent correction; all seven instruction screens; result availability only after completion; restart; withdrawal; inactivity abort; valid numerical result rendering from a synthetic dataset; no page JavaScript errors. Geometry checks: 320×568, 375×667, 390×844, 360×640 and 568×320; no horizontal overflow, visible buttons with >44 px height, and stimulus above the buttons.

Core, syntax and Chrome emulation checks passed. The synthetic result test validates rendering, not a human score. Fast automated responses are correctly refused numerical feedback. The comparison bars and explanatory text are verified separately with valid synthetic latencies.

## Limits

No physical iPhone or Android device was tested. Safari/WebKit was not automated; Chrome emulation does not establish Safari timing or physical touch/display latency. No GitHub repository has been pushed and no public Pages deployment has been tested. Participant-facing timing is browser-based and not calibrated using external hardware. Exact workshop condition balance, stimulus norms and psychometric reliability are not established by these tests. The restrained layout uses system fonts, pointer events, relative paths and viewport fallbacks, but physical-device confirmation is still required.

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
