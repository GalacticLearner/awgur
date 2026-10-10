import { chromium,expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync,writeFileSync } from 'node:fs';
const out='qa/web';mkdirSync(out,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173'],{stdio:'ignore'});
let browser;
try {
 for(let attempt=0;attempt<30;attempt++){try{if((await fetch('http://127.0.0.1:4173')).ok)break}catch{}await new Promise(r=>setTimeout(r,500))}
 browser=await chromium.launch({headless:true});const checks=[];
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['phone-small',360,640],['phone-large',412,915]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/');await expect(page.getByRole('heading',{name:'South Mada Street',exact:true})).toBeVisible();
  await page.screenshot({path:`${out}/${name}.png`});expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  const marker=page.getByRole('button',{name:'View street with clash · South Mada Street'}).first();const box=await marker.boundingBox();expect(box.width).toBeGreaterThanOrEqual(48);expect(box.height).toBeGreaterThanOrEqual(48);await marker.focus();await page.keyboard.press('Enter');await expect(page.getByRole('heading',{name:'South Mada Street',exact:true})).toBeVisible();
  await page.getByLabel('Demo account').selectOption('officer');await page.getByRole('link',{name:'Review',exact:true}).click();await page.locator('a[href="#/review/permit-1"]').first().click();
  await expect(page.locator('.finding-label').filter({hasText:'R1'})).toHaveCount(1);await page.getByRole('button',{name:'Apply suggested window',exact:true}).first().click();await expect(page.locator('.finding-label').filter({hasText:'R1'})).toHaveCount(0);
  await page.getByRole('button',{name:'Approve as emergency',exact:true}).click();await expect(page.getByRole('button',{name:'Log reason & approve emergency'})).toBeDisabled();await page.getByLabel('Public emergency reason').fill('Synthetic browser QA emergency reason');await page.getByRole('button',{name:'Log reason & approve emergency'}).click();await expect(page.locator('.emergency-record')).toContainText('Synthetic browser QA emergency reason');await page.reload();await expect(page.locator('.emergency-record')).toContainText('Synthetic browser QA emergency reason');
  expect(errors).toEqual([]);checks.push({name,width,height,errors,heroFlow:'pass',persistence:'pass',overflow:'none',marker:'48px, keyboard-operable'});await context.close();
 }
 const recovery=await browser.newContext({viewport:{width:390,height:844}});const p=await recovery.newPage();const recoveryErrors=[];p.on('pageerror',e=>recoveryErrors.push(String(e)));
 await p.route('**/data/works.json',route=>route.abort());await p.goto('http://127.0.0.1:4173/');await expect(p.getByRole('heading',{name:'Data unavailable',exact:true})).toBeVisible();await p.unroute('**/data/works.json');await p.getByRole('button',{name:'Reload registry',exact:true}).click();await expect(p.getByRole('heading',{name:'South Mada Street',exact:true})).toBeVisible();
 await p.evaluate(()=>localStorage.setItem('works-registry-v1',JSON.stringify({version:1,role:'resident',works:[{}],requests:[],followed:[]})));await p.reload();await expect(p.getByRole('heading',{name:'South Mada Street',exact:true})).toBeVisible();await expect(p.locator('.work-row').first()).toContainText('Water main replacement');
 await p.getByRole('link',{name:'About',exact:true}).click();await p.getByRole('button',{name:'Reset demo',exact:true}).click();await expect(p.getByRole('dialog')).toBeVisible();for(let i=0;i<8;i++){await p.keyboard.press('Tab');expect(await p.evaluate(()=>!!document.activeElement?.closest('.dialog'))).toBe(true)}await p.keyboard.press('Escape');await expect(p.getByRole('dialog')).toHaveCount(0);
 expect(recoveryErrors).toEqual([]);checks.push({recovery:'missing-file reload and malformed storage passed',dialog:'focus stays in modal',errors:recoveryErrors});await recovery.close();
 writeFileSync(`${out}/checks.json`,JSON.stringify(checks,null,2));console.log('Responsive, hero flow, marker, persistence and recovery checks passed.');
}finally{await browser?.close();server.kill()}
