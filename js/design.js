(() => {
 const C = IAT.categories;
 IAT.validateStimuli = () => {
  const seen = new Set(), sizes = Object.values(C).map(c => c.words.length);
  if (!sizes[0] || !sizes.every(n => n === sizes[0])) throw Error('Zestawy muszą mieć równą, niezerową liczebność.');
  Object.values(C).forEach(c => c.words.forEach(w => {
   if (typeof w !== 'string' || !w.trim() || /[<>]/.test(w) || seen.has(w)) throw Error('Nieprawidłowy lub powtórzony bodziec.');
   seen.add(w);
  }));
 };
 IAT.assignCondition = () => {
  const bits = new Uint32Array(1); crypto.getRandomValues(bits);
  return { first: bits[0] & 1 ? 'B' : 'A', genderLeft: bits[0] & 2 ? 'male' : 'female' };
 };
 // A = female/humanities, male/science. B = female/science, male/humanities.
 IAT.buildDesign = (condition, shuffle) => {
  IAT.validateStimuli();
  if (!['A','B'].includes(condition.first) || !['female','male'].includes(condition.genderLeft)) throw Error('Nieznany warunek.');
  const other = g => g === 'female' ? 'male' : 'female';
  const domain = g => (condition.first === 'A') === (g === 'female') ? 'humanities' : 'science';
  const leftDomain = domain(condition.genderLeft), rightDomain = leftDomain === 'science' ? 'humanities' : 'science';
  return IAT.config.counts.map((count, index) => {
   const block = index + 1, reversed = block >= 5;
   const genderLeft = reversed ? other(condition.genderLeft) : condition.genderLeft;
   const combined = [3,4,6,7].includes(block);
   const left = block === 2 ? [leftDomain] : combined ? [genderLeft,leftDomain] : [genderLeft];
   const right = block === 2 ? [rightDomain] : combined ? [other(genderLeft),rightDomain] : [other(genderLeft)];
   const mapping = combined ? (reversed ? (condition.first === 'A' ? 'B' : 'A') : condition.first) : null;
   const cats = [...left,...right];
   // Category counts differ by at most one. Randomise which categories receive
   // extra trials; for 30 combined trials give one extra to each response side.
   const perCategory = Math.floor(count/cats.length), remainder = count%cats.length;
   const extras = combined && remainder===2 ? [shuffle(left)[0],shuffle(right)[0]] : shuffle(cats).slice(0,remainder);
   const pool = cats.flatMap(category => {
    const n=perCategory+Number(extras.includes(category)), words=C[category].words;
    // Full shuffled cycles plus a random partial cycle keep exemplar counts
    // within one per category, without dropping words from the configuration.
    const sampled=[];
    while(sampled.length<n) sampled.push(...shuffle(words).slice(0,n-sampled.length));
    return sampled.map(stimulus=>({stimulus,category,correct_response:left.includes(category)?'left':'right'}));
   });
   // Preserve the existing sequence constraints: no identical adjacent words,
   // >2 consecutive instances of a category or >3 consecutive correct sides.
   let sequence;
   for (let attempt=0; attempt<1000; attempt++) {
    const remaining=shuffle(pool), candidate=[];
    while(remaining.length){
     const i=candidate.length;
     const eligible=remaining.map((t,j)=>({t,j})).filter(({t})=>
      !(i>0 && t.stimulus===candidate[i-1].stimulus) &&
      !(i>1 && [candidate[i-1],candidate[i-2]].every(x=>x.category===t.category)) &&
      !(i>2 && [candidate[i-1],candidate[i-2],candidate[i-3]].every(x=>x.correct_response===t.correct_response)));
     if(!eligible.length)break;
     const choice=shuffle(eligible)[0];candidate.push(choice.t);remaining.splice(choice.j,1);
    }
    if(candidate.length===count){sequence=candidate;break;}
   }
   if (!sequence) throw Error('Nie udało się wylosować sekwencji. Odśwież stronę.');
   const conditionName = `${condition.first}-first_${condition.genderLeft}-left`;
   return {block,count,left,right,mapping, trials:sequence.map((t,i)=>({...t,block,trial_number:i+1,
    experimental_trial:true,mapping,left_assignment:left,right_assignment:right,condition:conditionName}))};
  });
 };
})();
