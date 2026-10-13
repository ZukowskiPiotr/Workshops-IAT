# Polish Gender–Science IAT — LSN workshop

A static, browser-local, touchscreen demonstration for approximately 16–17-year-old students. The existing folder name `gender-career-iat` is preserved, but **this application implements Gender–Science**, with academic domains rather than career/family categories. No account, install, participant identifier, database, analytics, or paid service is needed.

## Start here

Open this folder in VS Code: **File → Open Folder**, then **Terminal → New Terminal**. On macOS:

```sh
cd /Users/zukowskipiotr/Documents/LSN/Noc_Anglistow/gender-career-iat
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000/` in your browser. Stop the server with Control-C. Python 3 is a development convenience; if unavailable, install Python from python.org or use the VS Code Live Server extension. Neither is needed on GitHub Pages. Do not use VS Code's text preview as the experiment. A local HTTP server is recommended for faithful path/browser testing; this application uses classic scripts and also allows opening `index.html` directly, but HTTP better matches hosting.

## Files and the E-Prime mental model

Think of the timeline as an E-Prime Procedure and the trial plugin as a reusable stimulus/response object. Configuration resembles a List; the scoring function is post-experiment analysis.

| File | Role |
|---|---|
| `index.html` | Entry point, Polish language, viewport, ordered relative script imports, failure message. |
| `js/stimuli.js` | The four category labels and all 20 words. Edit materials here. |
| `js/config.js` | Counts, 250 ms blank interval, 60 s inactivity timeout, workshop quality gates, version. |
| `js/design.js` | Session counterbalancing, exact stimulus frequencies, constrained random sequences, mappings. |
| `js/experiment.js` | jsPsych initialisation, introduction, voluntary participation, instructions and seven-block timeline. |
| `js/touch-plugin.js` | Two local jsPsych 8 plugins: instruction screen and timed touch trial; onset, responses, error correction, interruption and withdrawal. |
| `js/scoring.js` | Pure browser-local D1 scoring and validation. |
| `js/results.js` | Polish results, D direction, raw means, comparison bars, caveats and restart. |
| `css/styles.css` | Mobile typography, category labels, bottom response buttons, safe areas, portrait/landscape layouts. |
| `vendor/jspsych-8.3.0.min.js` | Pinned bundled browser distribution of jsPsych 8.3.0. |
| `vendor/LICENSE-jspsych.txt` | Original upstream MIT notice. |
| `tests/core.cjs` | Repeatable design/scoring tests using Node built-ins. |
| `tests/browser.cjs` | Optional Chrome touchscreen emulation, requires developer Playwright. |
| `TESTING.md` | Verification evidence, limits and physical-device checklist. |
| `LICENSE` | MIT licence for application source. |
| `.nojekyll` | Tells Pages to serve this as a plain static site. |

`index.html` loads jsPsych first, then materials/configuration, design, scoring, results, plugins and experiment. jsPsych runs the timeline and keeps trial rows in memory. Each plugin finishes by passing a row to `finishTrial`. The final callback passes experimental rows to the scorer and renders results. Instruction screens never count toward the 200 trials. There is no permanent storage or data download in the participant interface.

No npm install, build, package manifest, external font, CDN, backend or extra application file is needed. **All runtime dependencies are included.** The jsPsych npm stable tag was checked on 13 October 2026 and resolved to 8.3.0. The distribution came from `https://registry.npmjs.org/jspsych/-/jspsych-8.3.0.tgz`; local custom plugins use the compatible class/`static info`/`ParameterType`/`finishTrial` API. No external plugin versions are mixed. The remote source-map comment was removed from the bundled file to prevent developer tools requesting an external map. If the local vendor file is missing, the loading message stays visible and the console identifies the failure. There is no silent CDN fallback that would create an extra external connection.

## Experimental procedure

| Block | Task | Trials |
|---|---|---:|
| 1 | Gender practice | 20 |
| 2 | Academic-domain practice | 20 |
| 3 | First combined practice | 20 |
| 4 | First combined test | 40 |
| 5 | Reversed gender practice | 40 |
| 6 | Second combined practice | 20 |
| 7 | Second combined test | 40 |
| **Total** | Instructions excluded | **200** |

Mapping **A** pairs KOBIETA with NAUKI HUMANISTYCZNE and MĘŻCZYZNA with NAUKI ŚCISŁE. Mapping **B** pairs KOBIETA with NAUKI ŚCISŁE and MĘŻCZYZNA with NAUKI HUMANISTYCZNE. Two unbiased bits from `crypto.getRandomValues` select A/B first and female/male initially left: four equiprobable conditions. This is independent participant-session randomisation, not a person identifier. Reloading draws again. It gives approximate balance in expectation, **not guaranteed exact workshop balance**. No local counter can coordinate different phones.

Gender starts in its assigned positions in block 1. Academic-domain sides in block 2 are chosen to produce the assigned first mapping. Domain sides stay fixed; gender sides reverse in block 5 and remain reversed in 6–7. Exactly half the trials require each side. Single blocks have equal category counts; combined blocks have 5 or 10 trials per category. With five words/category every word occurs equally often (2 or 4 times in a single block, 1 or 2 times in a combined block). The constrained sampler disallows consecutive identical words, more than two consecutive instances of a category and more than three consecutive correct sides. It restarts when constraints leave no eligible item, with a bounded failure message. This is constrained randomisation, not uniform sampling over all possible permutations; gender/domain trials are intermixed rather than forced alternation.

Later exact balance could use a backend allocating unused conditions from randomly permuted blocks of four atomically, or a coordinator distributing equal sets of single-use condition links. The latter needs an implemented and validated assignment override plus control of reuse; this release has no URL condition override. Repeated completions by the same student are affected by practice and are not independent sessions for scientific analysis.

## Materials: provisional Polish adaptation

Gender uses paired familiar kinship terms: matka/ojciec, córka/syn, siostra/brat, ciotka/wujek, babcia/dziadek. They are gender exemplars, not the family attribute of a Gender–Career IAT. No occupation words cross gender and domain categories. Academic stimuli are discipline names: fizyka, chemia, matematyka, astronomia, informatyka; historia, filozofia, literatura, filologia, archeologia. Lengths overlap across the domain sets, but lexical frequency and reading difficulty have **not** been empirically matched. Gender sets are shorter than domain sets; equal counts and counterbalancing reduce design imbalance but cannot validate the words.

This is an adaptation informed by the [Project Implicit Gender–Science supplementary materials](https://www.projectimplicit.net/nosek/papers/SGN2010/SGN2010supplement.pdf), not a reproduction or validated Polish norm set. The narrower Polish label NAUKI ŚCISŁE motivates mathematics/physical/computational disciplines and avoiding ambiguous biology/engineering exemplars. Humanities here excludes fine arts/music; that changes coverage relative to some English versions. Do not compare individuals with published norms as if the instruments were identical.

Before research, pilot category agreement, word familiarity, reading difficulty and length/frequency in the intended age group. Review discipline coverage (including archaeology), kinship familiarity and binary gender framing. The two gender categories are an operational simplification, not a statement about all identities. To change words, edit `js/stimuli.js`, use unique plain text and keep equal set sizes dividing 5, 10 and 20 (normally five words/category); rerun tests. Changing category IDs or block counts requires a design and scoring review.

## Response timing and data dictionary

Each trial shows fixed labels above and on both buttons. The word appears after two animation frames settle the layout. `performance.now()` records onset immediately after making it visible. That is a browser paint-proximate estimate, **not verified physical display onset**. The initial `pointerdown` records first contact rather than finger release; no transition animation runs. Accessible keyboard button activation also works. Preventing the native pointer click plus accepting only synthetic/keyboard `click` with `detail===0` prevents double counting. Additional non-primary touches are ignored.

Wrong responses show a red X and leave the word/buttons present until the correct response. The first response is preserved. Each subsequent response is separately retained, including repeated wrong corrections. Correct completion clears the display; a 250 ms blank gap is excluded from scored RT. Simultaneous touches, browser interrupts and finger placement can still affect real-world measurement; a touchscreen is a procedural adaptation requiring validation. The browser/device cannot promise laboratory timing accuracy ([jsPsych timing guidance](https://www.jspsych.org/latest/overview/timing-accuracy/)).

| Trial fields | Meaning |
|---|---|
| `experimental_trial`, `block`, `trial_number` | Experimental marker, block 1–7 and within-block index (1-based). |
| `stimulus`, `category` | Word and its stable category ID. |
| `mapping` | A/B for combined blocks; null for single blocks. |
| `left_assignment`, `right_assignment`, `correct_response` | Category ID arrays and correct `left`/`right` side. |
| `condition` | First mapping and initial gender-left assignment. |
| `initial_response`, `initial_correct`, `initial_rt`, `error` | First side, Boolean accuracy, latency from onset in ms, Boolean error. |
| `feedback_onset_rt` | Red-X DOM update time relative to word onset; null without an error. |
| `corrections` | Every subsequent response as `{side, rt}`; rt remains relative to stimulus onset. |
| `correction_response`, `correction_rt` | Final correct correction side and elapsed time since first response; null if initially correct. |
| `correction_onset_rt` | Final correction latency relative to stimulus onset. |
| `total_rt` | Onset to final correct response, including correction; no blank gap. |
| `onset_clock_ms`, `trial_end_clock_ms` | Monotonic browser timestamps, not calendar time or participant identity. |
| `completed`, `reason`, `interrupted` | Completion, withdrawal/timeout reason and interruption flag. |

Changing tabs/hiding the page, window blur or orientation change during a trial flags a disruption; all such sessions are refused a D-score. Notification overlays that do not trigger events cannot be detected. Sixty seconds without final correction ends participation as incomplete; it does not automatically accept a response or advance through the remaining trials. Withdrawal similarly skips remaining trials through jsPsych conditional execution and shows an explanation. Reloading discards all data. No automatic resume is offered because unnoticed delays could contaminate RTs. Results appear after all seven blocks or explicitly as unavailable following withdrawal/timeout.

## D-score specification

Primary reference: [Greenwald, Nosek & Banaji (2003), JPSP 85, 197–216](https://www.projectimplicit.net/nosek/iat/GNB2003.pdf), DOI [10.1037/0022-3514.85.2.197](https://doi.org/10.1037/0022-3514.85.2.197), especially Study 6 and Table 4.

Implemented variant: **D1, built-in error correction, no lower-tail deletion**.

- Score blocks 3, 4, 6, 7; exclude single-category blocks 1, 2, 5.
- Use onset-to-final-correct latency, including correction. No added 600 ms or block-mean replacement.
- Refuse a session if more than 10% of its 120 combined latencies are below 300 ms, assessed before slow-trial removal. Retain fast trials in otherwise eligible sessions; no 400 ms deletion or winsorisation.
- Remove latencies strictly above 10,000 ms; retain exactly 10,000 ms and all first trials.
- Calculate inclusive sample SD over concatenated retained trials of 3+6, and separately 4+7 (`n−1` denominator). This is not an average of within-block SDs.
- Compute `(mean_B − mean_A)/SD` for each pair. D is the equal-weight average of the two quotients. Practice and test pairs both contribute.

Positive D means faster A; negative means faster B. The results' mapping means combine retained practice/test trials, weighted by trial counts, and are **descriptive milliseconds**, not D. There are no prejudice-strength bins or diagnostic thresholds.

### Additional demonstration safeguards

Distinct from the published D1 rules: require all 200 completed, uniquely indexed trials, valid finite initial/final responses and coherent A/B block mappings; reject interruption; reject initial error proportion >35% in combined blocks; require at least 80% retained in **each** scored block (16/20 or 32/40); reject zero/invalid pair SD. These conservative local choices are not established psychometric standards and must be reviewed/pre-registered for research. Their role is to avoid educational numerical feedback from unusable sessions. Initial error accuracy is assessed before slow deletion. No numeric D is displayed on failure; a reason and restart are provided.

## Privacy and participation

The application neither asks for nor records names, email, IP, location, account IDs, precise wall-clock timestamps or device fingerprints. No responses leave the browser; no cookies, localStorage, fetch/upload endpoints or telemetry are used. GitHub Pages necessarily receives connection information when serving files and may keep infrastructure logs. Therefore “anonymous task” must not be interpreted as “the hosting provider never sees an IP address.” Organisers must review the host's privacy practices and their participant information wording.

Before inviting minors, organisers must independently decide the applicable institutional/ethical approval, parental or guardian permission requirements, student assent, school permission and privacy information. **The introductory button is a voluntary start action, not proof of legally/institutionally sufficient consent.** No parent-facing forms are generated: appropriate documents and procedures belong to the organisers. Ensure an alternative activity, free withdrawal and private results. Do not ask students to publicly rank themselves or share D-scores. This is a demonstration, not a validated individual diagnostic instrument; do not infer discriminatory intentions, conscious beliefs or behaviour.

## Smartphone test before publication

Mac and phone must share a trusted Wi-Fi network. In the project terminal:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Find the Mac's Wi-Fi address in **System Settings → Wi-Fi → Details → TCP/IP**. On the phone open `http://MAC_WIFI_ADDRESS:8000/`, substituting that address. `localhost` on the phone refers to the phone, not the Mac. Allow macOS firewall access if prompted; guest/university Wi-Fi may prohibit device-to-device connections. Use a private Pages preview if LAN access is blocked. Stop the server after testing. This address is only for local testing, not the workshop QR code.

Test actual iOS Safari and Android Chrome with navigation bars visible; use the physical-device checklist in `TESTING.md`. Modern pointer events, system fonts and dynamic/small viewport units are used with a `100vh` fallback. No fullscreen, screen lock or orientation-lock API is required. In-app QR scanner browsers may have different controls; open the page in Safari/Chrome. Keep orientation fixed during blocks. A local HTTP phone test does not substitute for checking the final HTTPS Pages URL.

## Publish to an existing GitHub repository

The following are instructions, not actions already performed. Use your existing repository URL/branch. Do not force-push or replace unrelated repository files. If this folder is already the repository checkout, inspect `git status` and skip cloning/copying. Otherwise, clone the existing repository into a separate folder; a repository root hosting approach is shown:

```sh
git clone YOUR_EXISTING_GITHUB_REPOSITORY_URL ~/Documents/iat-pages
cd ~/Documents/iat-pages
git status
```

Inspect that checkout first. If its root already contains another site, use an agreed subfolder (e.g. `gender-science/`) and keep that site's entry point, or a separate repository. Copy **all application files** into the intended hosting folder using Finder, including `js`, `css`, `vendor` and `.nojekyll`. The source files stay in the requested local directory. For an otherwise empty repository root:

```sh
cp -R /Users/zukowskipiotr/Documents/LSN/Noc_Anglistow/gender-career-iat/. ~/Documents/iat-pages/
cd ~/Documents/iat-pages
git status
git add index.html css js vendor README.md TESTING.md LICENSE tests .nojekyll
git commit -m "Add Polish Gender-Science workshop IAT"
git push
```

Run the copy command only after confirming there are no unrelated name collisions. Authentication uses your existing GitHub setup; no credentials belong in experiment files. This project does not need GitHub CLI or GitHub Actions configuration.

In the repository **Settings → Pages**, select **Deploy from a branch**, choose the branch containing the files (often `main`) and **/(root)**, then Save. Pages supports root or `/docs`; if using `/docs`, copy the complete project there and select it. Check repository plan/visibility supports Pages; public repositories can use free hosting. See [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Wait for the Pages deployment to finish in **Actions**. Copy the public link displayed in **Settings → Pages**. A usual project URL is `https://YOUR_ACCOUNT.github.io/YOUR_REPOSITORY/`, with `/gender-science/` appended if the files are in that subfolder. Use the actual displayed URL, including case and path. All application references are relative, so repository subdirectories work. `.nojekyll` avoids unwanted processing. The final public URL and QR code cannot be fixed until the repository and published URL are known.

For the workshop QR, open the final public HTTPS experiment URL in desktop Chrome. Choose **More → Cast, save and share → Create QR code**, then download the image, following [Google's QR sharing instructions](https://support.google.com/chrome/answer/10051760?hl=en-GB). Put it on the workshop slide alongside the written URL. Scan the printed/projected version from the back of the room on both phone types; verify it opens the experiment entry screen, not a repository code page. No paid QR redirect service is needed.

To update: edit source files in VS Code, run tests, copy changed files into the publishing checkout if separate, inspect `git diff`, then commit and push. Pages redeploys the same URL; the QR stays valid. Verify the published version in a fresh tab after deployment and keep a tagged/saved workshop version. Avoid updates during participant sessions, because reload would create a new session and changed files could yield mixed versions.

## Troubleshooting

| Symptom | Diagnosis and fix |
|---|---|
| Loading message stays | Browser developer console and Network panel: missing vendor/script file, JavaScript disabled or script error. Confirm every file from the checklist. |
| 404 JavaScript/CSS | Check spelling/case, folder structure and relative paths. Do not add leading `/` to paths; that would point outside a project repository. |
| CDN unavailable | No CDN is used by participants. Restore the bundled `vendor/jspsych-8.3.0.min.js`; do not substitute a floating release. |
| Blank/unformatted hosted page | Confirm upload includes `css/`, `js/`, `vendor/`; review Pages deployment logs and selected branch/folder. |
| Pages 404 | Wait for successful deployment; check exact public URL/path, entry file `index.html`, repository Pages settings and supported visibility. |
| Local works, hosted fails | Paths are case-sensitive on hosting; desktop filesystems may hide case mistakes. Check nested project URL and stale browser cache. |
| Phone cannot reach Mac | Same Wi-Fi, correct Mac address, server bound to `0.0.0.0`, firewall and client isolation. Do not use phone `localhost`. |
| Score unavailable | Read the specific quality reason. Retry only for educational exploration; do not tune scoring thresholds merely to produce a number. |
| Delayed input/clipped layout | Close other heavy apps, open normal Safari/Chrome, check zoom and browser bars. Do a physical-device pilot before workshop use. |

## Final component and organiser checklist

- [x] Entry HTML, relative imports and viewport.
- [x] Separate materials, configuration, randomisation and seven-block timeline.
- [x] Local jsPsych 8.3.0 and licence; no participant software installation.
- [x] Touch response recording, error correction, progress and withdrawal.
- [x] D1, quality gates and numerical/descriptive results with cautious Polish explanations.
- [x] Responsive stylesheet and restart.
- [x] Core and optional browser tests; testing report.
- [x] README, deployment instructions, MIT licence and `.nojekyll`.
- [ ] Organiser: review/validate Polish stimuli and instrument adaptation.
- [ ] Organiser: assess device timing and complete physical Safari/Android checks.
- [ ] Organiser: review scoring thresholds, D sign and individual-score limitations.
- [ ] Organiser: establish institutional, parent/guardian and student participation procedures; create required consent/information documents.
- [ ] Organiser: publish to the chosen repository, verify final HTTPS link and generate/scan QR.

Technical reference pages consulted: [initialisation and finishTrial](https://www.jspsych.org/latest/reference/jspsych/), [timelines and conditional execution](https://www.jspsych.org/latest/overview/timeline/), [custom plugins](https://www.jspsych.org/latest/developers/plugin-development/), [trial data](https://www.jspsych.org/latest/reference/jspsych-data/), [randomisation](https://www.jspsych.org/latest/reference/jspsych-randomization/). These are the principal API references; no deprecated jsPsych 6 `jsPsych.init` or string plugin names are used.
