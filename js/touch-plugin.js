/* Local jsPsych 8 plugin. pointerdown timestamps the initial contact;
 * click supports keyboard/accessibility activation but is not counted twice.
 * No timeout advances a participant to another experimental trial. */
(() => {
 const PT=jsPsychModule.ParameterType;
 const labels = ids => ids.map(id=>IAT.categories[id].label).join('<span class="plus"> + </span>');
 IAT.labels=labels;
 class Screen {
  static info={name:'iat-screen',version:'1.0.0',parameters:{html:{type:PT.HTML_STRING},button:{type:PT.STRING,default:'Dalej'}},data:{}};
  constructor(jsPsych){this.jsPsych=jsPsych;}
  trial(el,t){el.innerHTML=`<section class="sheet">${t.html}<button class="primary" id="next">${t.button}</button></section>`;
   el.querySelector('#next').addEventListener('click',()=>{el.innerHTML='';this.jsPsych.finishTrial({experimental_trial:false});},{once:true});}
 }
 class Touch {
  static info={name:'iat-touch',version:'1.0.0',parameters:{spec:{type:PT.OBJECT}},data:{}};
  constructor(jsPsych){this.jsPsych=jsPsych;}
  trial(el,t){
   const s=t.spec; let onset=null, ended=false, timer, feedback=null, initial=null, interrupted=false;
   const corrections=[];
   const completedBefore=IAT.config.counts.slice(0,s.block-1).reduce((n,c)=>n+c,0)+s.trial_number-1;
   el.innerHTML=`<div class="trial"><header><span>Blok ${s.block} / 7</span><span>Próba ${s.trial_number} / ${IAT.config.counts[s.block-1]}</span></header><progress aria-label="Postęp zadania" value="${completedBefore}" max="${IAT.config.totalTrials}"></progress><div class="stage"><div class="stimulus" style="visibility:hidden">${s.stimulus}</div><div class="error" aria-live="polite"></div></div><div class="responses"><button class="response left" data-side="left" disabled>${labels(s.left_assignment)}</button><button class="response right" data-side="right" disabled>${labels(s.right_assignment)}</button></div><footer>Dotknij odpowiedniej strony · <button id="stop">Zakończ udział</button></footer></div>`;
   const buttons=[...el.querySelectorAll('.response')], error=el.querySelector('.error');
   const disturb=()=>{if(onset!==null) interrupted=true;};
   const visibility=()=>{if(document.hidden) disturb();};
   const cleanup=()=>{clearTimeout(timer);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',disturb);window.removeEventListener('orientationchange',disturb);};
   const finish=(completed, reason=null)=>{
    if(ended)return;ended=true;cleanup();
    if(!completed)IAT.session.active=false;
    const end=performance.now(), final=corrections[corrections.length-1];
    if(completed) {
     IAT.session.completedTrials=completedBefore+1;
     el.querySelector('progress').value=IAT.session.completedTrials;
    }
    el.innerHTML='';this.jsPsych.finishTrial({...s,completed,reason,initial_response:initial?.side??null,
     initial_correct:initial?initial.side===s.correct_response:null,initial_rt:initial?.rt??null,error:initial?initial.side!==s.correct_response:null,
     correction_response:final?.side??null,correction_rt:final?final.rt-initial.rt:null,
     correction_onset_rt:final?.rt??null,corrections,feedback_onset_rt:feedback,
     total_rt:completed?(final?.rt??initial.rt):onset===null?null:end-onset,
     interrupted,onset_clock_ms:onset,trial_end_clock_ms:end});
   };
   const respond=(side)=>{
    if(ended || onset===null || document.hidden)return;
    const rt=performance.now()-onset;
    if(!initial)initial={side,rt};else corrections.push({side,rt});
    if(side===s.correct_response){finish(true);return;}
    error.textContent='✕  Popraw odpowiedź';
    if(feedback===null)feedback=performance.now()-onset;
   };
   buttons.forEach(b=>{
    b.addEventListener('pointerdown',e=>{if(!e.isPrimary || e.button!==0)return;e.preventDefault();respond(b.dataset.side);});
    b.addEventListener('click',e=>{if(e.detail===0)respond(b.dataset.side);});
   });
   el.querySelector('#stop').onclick=()=>finish(false,'withdrawn');
   document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',disturb);window.addEventListener('orientationchange',disturb);
   // Two frames settle layout; onset is a paint-proximate estimate, not photometry.
   requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(ended)return;el.querySelector('.stimulus').style.visibility='visible';onset=performance.now();
    buttons.forEach(b=>b.disabled=false);
    timer=setTimeout(()=>finish(false,'timeout'),IAT.config.timeout);
   }));
  }
 }
 IAT.Screen=Screen;IAT.Touch=Touch;
})();
