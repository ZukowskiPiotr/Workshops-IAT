/* Optional developer QA: PLAYWRIGHT_MODULE=/path/to/playwright node tests/browser.cjs
 * Uses installed Chrome, no dependencies needed for participant deployment. */
const fs=require('node:fs'), path=require('node:path'), http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.join(__dirname,'..');
(async()=>{
 const server=http.createServer((req,res)=>{
  const name=req.url.split('?')[0].replace(/^\/demo\//,'');const p=path.join(root,name===''?'index.html':name);
  if(!p.startsWith(root+path.sep)){res.writeHead(404).end();return;}
  fs.readFile(p,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':'text/html');res.end(data);});
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  const page=await browser.newPage({viewport:{width:320,height:568},hasTouch:true,isMobile:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=`http://127.0.0.1:${server.address().port}/demo/`;
  // Test-only shorten blank intervals; leave production trial logic intact.
  await page.route('**/js/config.js',async route=>{const s=fs.readFileSync(path.join(root,'js/config.js'),'utf8').replace('gap: 250','gap: 0');await route.fulfill({contentType:'text/javascript',body:s});});
  await page.goto(url);await page.locator('#next').click();await page.locator('#next').click();await page.evaluate(()=>{const orig=IAT.score;IAT.score=rows=>{window.qaRows=rows;return orig(rows);};});
  await page.locator('#next').click();await page.locator('.response:not([disabled])').first().waitFor();
  const checks=[];
  for(const size of [[320,568],[375,667],[390,844],[360,640],[568,320]]){
   await page.setViewportSize({width:size[0],height:size[1]});
   const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,buttons:[...document.querySelectorAll('.response')].map(e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom};}),stim:document.querySelector('.stimulus').getBoundingClientRect().toJSON()}));
   assert(!geometry.overflow);assert(geometry.buttons.every(r=>r.x>=0&&r.bottom<=size[1]&&r.h>=44));assert(geometry.stim.bottom<geometry.buttons[0].y);checks.push(size);
  }
  // Start fresh to avoid orientation/resize affecting this session's interpretation.
  await page.setViewportSize({width:320,height:568});await page.reload();await page.locator('#next').click();await page.locator('#next').click();
  await page.evaluate(()=>{const orig=IAT.score;IAT.score=rows=>{window.qaRows=rows;return orig(rows);};});
  let count=0, intentionalError=false;
  for(let b=1;b<=7;b++){
   await page.locator('#next').click();
   for(let t=0;t<[20,20,20,40,40,20,40][b-1];t++){
    await page.locator('.response:not([disabled])').first().waitFor();
    const correct=await page.evaluate(()=>{const word=document.querySelector('.stimulus').textContent;const cat=Object.keys(IAT.categories).find(c=>IAT.categories[c].words.includes(word));return document.querySelector('.response.left').textContent.includes(IAT.categories[cat].label)?'left':'right';});
    if(!intentionalError){
     await page.locator('.response.'+(correct==='left'?'right':'left')).tap();await page.waitForTimeout(100);assert(await page.locator('.error').textContent());assert.equal(await page.locator('.stimulus').count(),1);intentionalError=true;
    }
    await page.locator('.response.'+correct).tap();count++;
   }
  }
  await page.locator('#restart').waitFor();const data=await page.evaluate(()=>qaRows.filter(t=>t.experimental_trial));
  assert.equal(data.length,200);assert(data.every(t=>t.completed));assert.equal(data.filter(t=>t.error).length,1);assert(data[0].correction_rt>=0);assert(data[0].total_rt>=data[0].initial_rt);assert.equal(await page.locator('.trial').count(),0);
  await page.locator('#restart').click();await page.locator('#next').waitFor();await page.locator('#next').click();await page.locator('#next').click();await page.locator('#next').click();await page.locator('#stop').click();await page.locator('#restart').waitFor();assert.equal(await page.locator('.trial').count(),0);assert((await page.locator('h1').textContent()).includes('niedostępny'));
  // Timeout must abort, never silently skip a trial.
  await page.route('**/js/config.js',async route=>{const s=fs.readFileSync(path.join(root,'js/config.js'),'utf8').replace('timeout: 60000','timeout: 150');await route.fulfill({contentType:'text/javascript',body:s});});
  await page.reload();await page.locator('#next').click();await page.locator('#next').click();await page.locator('#next').click();await page.locator('#restart').waitFor();assert((await page.locator('h1').textContent()).includes('niedostępny'));
  // Valid synthetic dataset checks numerical result DOM, not device validity.
  await page.evaluate(()=>{
   const rows=IAT.buildDesign({first:'B',genderLeft:'male'},a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}).flatMap(b=>b.trials.map((t,i)=>({...t,completed:true,initial_response:t.correct_response,initial_correct:true,error:false,initial_rt:(t.mapping==='B'?800:600)+(i%2?50:-50),total_rt:(t.mapping==='B'?800:600)+(i%2?50:-50),interrupted:false})));
   IAT.renderResults(document.querySelector('#experiment'),IAT.score(rows));
  });
  assert.equal(await page.locator('.score').count(),1);assert.equal(await page.locator('.comparison').count(),2);assert(await page.locator('.score').textContent());
  await page.screenshot({path:'/tmp/iat-results-mobile.png',fullPage:true});
  assert.deepEqual(errors,[]);console.log('PASS Chrome touchscreen emulation: 200 completed trials; correction; 7 block instructions; result gating; restart; withdrawal; inactivity abort; numerical results DOM; no JS errors; nested /demo/ paths; viewports '+JSON.stringify(checks));
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
