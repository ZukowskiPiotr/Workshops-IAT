/* Workshop quality gates below are additional safeguards, not D1 rules. */
IAT.config = Object.freeze({ counts: [15,15,15,30,30,15,30], gap: 250,
 timeout: 60000, minimumValidFraction: 0.8, maximumErrorFraction: 0.35,
 version: '1.1.0', scoring: 'D1-built-in-correction',
 get totalTrials(){return this.counts.reduce((n,c)=>n+c,0);},
 get combinedTrials(){return [3,4,6,7].reduce((n,b)=>n+this.counts[b-1],0);} });
