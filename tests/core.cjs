// No npm packages required: node tests/core.cjs
const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
for(const f of ['stimuli','config','design','scoring'])vm.runInThisContext(fs.readFileSync(path.join(root,'js',f+'.js'),'utf8'));
let state=938472;const rng=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/2**32;};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function fixture(first='A',genderLeft='female'){
 return IAT.buildDesign({first,genderLeft},shuffle).flatMap(b=>b.trials.map((t,i)=>({...t,completed:true,initial_response:t.correct_response,initial_correct:true,error:false,initial_rt:(t.mapping==='B'?800:600)+((i%3-1)*50),total_rt:(t.mapping==='B'?800:600)+((i%3-1)*50),interrupted:false,correction_response:null,correction_rt:null})));
}
for(const first of ['A','B'])for(const genderLeft of ['female','male'])for(let run=0;run<50;run++){
 const blocks=IAT.buildDesign({first,genderLeft},shuffle);assert.deepEqual(blocks.map(b=>b.trials.length),[15,15,15,30,30,15,30]);assert.equal(blocks.flatMap(b=>b.trials).length,150);
 assert.equal(blocks[2].mapping,first);assert.notEqual(blocks[5].mapping,first);assert.deepEqual(blocks[1].left,blocks[5].left.slice(1));assert.equal(blocks[4].left[0],blocks[5].left[0]);assert.notEqual(blocks[0].left[0],blocks[4].left[0]);
 for(const b of blocks){const frequency=Object.fromEntries([...b.left,...b.right].flatMap(c=>IAT.categories[c].words.map(w=>[w,0]))),categoryCounts={};for(const t of b.trials){assert(IAT.categories[t.category].words.includes(t.stimulus));assert.equal(Number(b.left.includes(t.category))+Number(b.right.includes(t.category)),1);assert.equal(t.correct_response,b.left.includes(t.category)?'left':'right');frequency[t.stimulus]++;categoryCounts[t.category]=(categoryCounts[t.category]||0)+1;}assert(Math.max(...Object.values(categoryCounts))-Math.min(...Object.values(categoryCounts))<=1);
  for(const c of [...b.left,...b.right]){const f=IAT.categories[c].words.map(w=>frequency[w]);assert(Math.max(...f)-Math.min(...f)<=1);}
  assert(Math.abs(b.trials.filter(t=>t.correct_response==='left').length-b.count/2)<=0.5);
  b.trials.forEach((t,i)=>{if(i>0)assert.notEqual(t.stimulus,b.trials[i-1].stimulus);if(i>1)assert(![b.trials[i-1],b.trials[i-2]].every(x=>x.category===t.category));if(i>2)assert(![b.trials[i-1],b.trials[i-2],b.trials[i-3]].every(x=>x.correct_response===t.correct_response));});}
}
// Independent analytic example: means A=600 B=800; within-block offsets −50, 0, +50.
// Inclusive concatenated sample SD = sqrt(N*(100^2+2*50^2/3)/(N-1)).
const expected=(200/Math.sqrt(350000/29)+200/Math.sqrt(700000/59))/2;
for(const first of ['A','B']){const r=IAT.score(fixture(first));assert(r.valid);assert(Math.abs(r.d-expected)<1e-12);assert.equal(r.times.A,600);assert.equal(r.times.B,800);}
let rows=fixture();rows.forEach(t=>{if(t.mapping){t.total_rt=1400-t.total_rt;t.initial_rt=t.total_rt;}});assert(Math.abs(IAT.score(rows).d+expected)<1e-12);
rows=fixture();let err=rows.find(t=>t.block===3);err.initial_response=err.correct_response==='left'?'right':'left';err.initial_correct=false;err.error=true;err.initial_rt=250;err.correction_response=err.correct_response;err.correction_rt=err.total_rt-250;
assert(Math.abs(IAT.score(rows).d-expected)<1e-12); // No added penalty; stored total is already corrected.
err.total_rt+=400;err.correction_rt+=400;assert(IAT.score(rows).d<expected);
rows=fixture();assert(!IAT.score(rows.slice(0,-1)).valid);rows[0].completed=false;assert(!IAT.score(rows).valid);
rows=fixture();rows[0].interrupted=true;assert(!IAT.score(rows).valid);
rows=fixture();rows[0].initial_rt=null;assert(!IAT.score(rows).valid);
rows=fixture();rows.filter(t=>t.mapping).slice(0,10).forEach(t=>{t.total_rt=300;t.initial_rt=300;});assert(IAT.score(rows).valid);
for(const n of [9,10]){rows=fixture();rows.filter(t=>t.mapping).slice(0,n).forEach(t=>{t.total_rt=299;t.initial_rt=299;});assert.equal(IAT.score(rows).valid,n===9);}
rows=fixture();rows.find(t=>t.block===3).total_rt=10000;assert.equal(IAT.score(rows).retained,90);rows.find(t=>t.block===3).total_rt=10001;assert.equal(IAT.score(rows).retained,89);
rows=fixture();rows.filter(t=>t.block===3).slice(0,4).forEach(t=>t.total_rt=10001);assert(!IAT.score(rows).valid);
rows=fixture();rows.filter(t=>t.mapping).slice(0,31).forEach(t=>{t.error=true;t.initial_correct=false;t.initial_response=t.correct_response==='left'?'right':'left';t.correction_response=t.correct_response;t.correction_rt=0;});assert(IAT.score(rows).valid);
rows=fixture();rows.filter(t=>t.mapping).slice(0,32).forEach(t=>{t.error=true;t.initial_correct=false;t.initial_response=t.correct_response==='left'?'right':'left';t.correction_response=t.correct_response;t.correction_rt=0;});assert(!IAT.score(rows).valid);
rows=fixture();rows.forEach(t=>{t.initial_rt=600;t.total_rt=600;});assert(!IAT.score(rows).valid);
rows=fixture();rows.find(t=>t.block===6).mapping='A';assert(!IAT.score(rows).valid);
console.log('PASS: 200 randomized designs, 4 conditions, 150 trials with category/exemplar/side balance and sequence constraints; analytic D1 sign, built-in error cost, boundary/exclusion/incomplete/quality checks.');
