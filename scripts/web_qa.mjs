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
  await page.getByLabel('Demo account').selectOption('officer');await page.getByRole('link',{name:'Review',exact:true}).click();await page.locator('a[href="#/review/permit-1"]').first().click();
  await expect(page.locator('.finding-label').filter({hasText:'R1'})).toHaveCount(1);await page.getByRole('button',{name:'Apply suggested window',exact:true}).first().click();await expect(page.locator('.finding-label').filter({hasText:'R1'})).toHaveCount(0);
  await page.getByRole('button',{name:'Approve as emergency',exact:true}).click();await expect(page.getByRole('button',{name:'Log reason & approve emergency'})).toBeDisabled();await page.getByLabel('Public emergency reason').fill('Synthetic browser QA emergency reason');await page.getByRole('button',{name:'Log reason & approve emergency'}).click();await expect(page.locator('.emergency-record')).toContainText('Synthetic browser QA emergency reason');await page.reload();await expect(page.locator('.emergency-record')).toContainText('Synthetic browser QA emergency reason');
  expect(errors).toEqual([]);checks.push({name,width,height,errors,heroFlow:'pass',persistence:'pass',overflow:'none'});await context.close();
 }
 writeFileSync(`${out}/checks.json`,JSON.stringify(checks,null,2));console.log('Web responsive, hero flow and persistence checks passed.');
}finally{await browser?.close();server.kill()}
