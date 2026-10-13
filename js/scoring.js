(() => {
 const mean = a => a.reduce((s,x)=>s+x,0)/a.length;
 const sd = a => {const m=mean(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1));};
 IAT.score = rows => {
  const trials = rows.filter(t=>t.experimental_trial), scored=trials.filter(t=>[3,4,6,7].includes(t.block));
  const fail = reason => ({valid:false,reason});
  if (trials.length!==200 || IAT.config.counts.some((n,i)=>trials.filter(t=>t.block===i+1).length!==n) ||
      new Set(trials.map(t=>`${t.block}:${t.trial_number}`)).size!==200) return fail('Zadanie nie zostało ukończone.');
  if (trials.some(t=>!t.completed || !Number.isFinite(t.total_rt) || t.total_rt<=0 ||
      !Number.isFinite(t.initial_rt) || t.initial_rt<0 || t.total_rt<t.initial_rt ||
      !['left','right'].includes(t.initial_response) || !['left','right'].includes(t.correct_response) ||
      t.initial_correct !== (t.initial_response===t.correct_response) ||
      (t.error && (t.correction_response!==t.correct_response || !Number.isFinite(t.correction_rt))) ||
      t.error !== !t.initial_correct)) return fail('Brakuje prawidłowo zapisanych odpowiedzi.');
  if (trials.some(t=>t.interrupted)) return fail('Zadanie zostało zakłócone zmianą karty, aplikacji lub orientacji ekranu. Spróbuj ponownie w spokojnych warunkach.');
  // D1: latency to final correct response; implicit error cost, no +600 ms.
  // Fast-response denominator = all 120 combined trials, before slow exclusion.
  if (scored.filter(t=>t.total_rt<300).length/scored.length>0.1) return fail('Ponad 10% odpowiedzi w blokach łączonych trwało krócej niż 300 ms.');
  if (scored.filter(t=>t.error).length/scored.length>IAT.config.maximumErrorFraction) return fail('Zbyt dużo błędów, aby pokazać miarodajny wynik tej demonstracji.');
  const blocks = {};
  for (const b of [3,4,6,7]) {
   const raw=scored.filter(t=>t.block===b), kept=raw.filter(t=>t.total_rt<=10000);
   if (kept.length<Math.ceil(raw.length*IAT.config.minimumValidFraction)) return fail('Za mało prób z czasem do 10 sekund w jednym z bloków.');
   if (!raw.every(t=>t.mapping===raw[0].mapping) || !['A','B'].includes(raw[0].mapping)) return fail('Niespójne mapowanie kategorii.');
   blocks[b]={mapping:raw[0].mapping, values:kept.map(t=>t.total_rt),mean:mean(kept.map(t=>t.total_rt))};
  }
  const components=[];
  for (const [x,y] of [[3,6],[4,7]]) {
   if (blocks[x].mapping===blocks[y].mapping) return fail('Brakuje obu mapowań.');
   const denominator=sd([...blocks[x].values,...blocks[y].values]);
   if (!Number.isFinite(denominator) || denominator<=0) return fail('Czasy nie mają wystarczającej zmienności do obliczenia D.');
   const a=blocks[x].mapping==='A'?blocks[x]:blocks[y], b=blocks[x].mapping==='B'?blocks[x]:blocks[y];
   components.push((b.mean-a.mean)/denominator);
  }
  if (blocks[3].mapping!==blocks[4].mapping || blocks[6].mapping!==blocks[7].mapping) return fail('Niespójna kolejność bloków.');
  const times={};
  for (const m of ['A','B']) times[m]=mean(Object.values(blocks).filter(b=>b.mapping===m).flatMap(b=>b.values));
  return {valid:true,d:mean(components),components,times,retained:Object.values(blocks).reduce((n,b)=>n+b.values.length,0),
   errorRate:scored.filter(t=>t.error).length/scored.length,variant:IAT.config.scoring};
 };
})();
