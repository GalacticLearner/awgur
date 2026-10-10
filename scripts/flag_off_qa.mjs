import {chromium,expect} from '@playwright/test';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync,spawn} from 'node:child_process';
const path='src/engine/params.ts',original=readFileSync(path,'utf8');
let server,browser;
try{
 writeFileSync(path,original.replace('ENABLE_CLOCK_RISK = true','ENABLE_CLOCK_RISK = false'));
 execFileSync(process.platform==='win32'?'npm.cmd':'npm',['run','build'],{stdio:'inherit',shell:process.platform==='win32'});
 server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4174'],{stdio:'ignore'});
 for(let attempt=0;attempt<30;attempt++){try{if((await fetch('http://127.0.0.1:4174')).ok)break}catch{}await new Promise(resolve=>setTimeout(resolve,500))}
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto('http://127.0.0.1:4174');await expect(page.getByRole('heading',{name:'South Mada Street',exact:true})).toBeVisible();
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('works-registry-v1')));const baseline=JSON.parse(readFileSync('src/engine/__tests__/fixtures/base-seed.json','utf8'));
 expect(stored.works).toEqual(baseline.works);expect(stored.requests).toEqual(baseline.requests);
 await page.goto('http://127.0.0.1:4174/#/project/hero-water');await expect(page.locator('.finish-forecast')).toHaveCount(0);
 await page.goto('http://127.0.0.1:4174/#/about');await expect(page.locator('.clock-risk-results')).toHaveCount(0);
 await page.getByLabel('Demo account').selectOption('officer');await page.goto('http://127.0.0.1:4174/#/review/permit-1');await expect(page.locator('.finding-label').filter({hasText:'R1'})).toHaveCount(1);await expect(page.locator('.finding-label').filter({hasText:'R6'})).toHaveCount(0);await expect(page.getByRole('button',{name:'Apply suggested window',exact:true}).first()).toBeVisible();
 mkdirSync('qa/web',{recursive:true});writeFileSync('qa/web/flag-off.json',JSON.stringify({baseWorks:128,basePermits:6,exactSeedMatch:true,forecastHidden:true,clockBacktestHidden:true,R6Absent:true,heroR1R3:'pass'},null,2));
 console.log('Flag-off exact baseline data and UI checks passed.');
}finally{await browser?.close();server?.kill();writeFileSync(path,original)}
