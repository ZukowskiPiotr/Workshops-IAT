/* Workshop quality gates below are additional safeguards, not D1 rules. */
IAT.config = Object.freeze({ counts: [20,20,20,40,40,20,40], gap: 250,
 timeout: 60000, minimumValidFraction: 0.8, maximumErrorFraction: 0.35,
 version: '1.0.0', scoring: 'D1-built-in-correction' });
