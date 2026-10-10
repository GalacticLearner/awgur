import {_android as android} from 'playwright';
import {expect as baseExpect} from '@playwright/test';
import {execFileSync,spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const expect=baseExpect.configure({timeout:20000}),out='qa/demo';mkdirSync(`${out}/raw`,{recursive:true});
const adb=(...args)=>execFileSync('adb',args,{encoding:'utf8'});
const works=JSON.parse(readFileSync('public/data/works.json','utf8')),street=works.find(work=>work.id==='clock-risk-relay-demo').segmentIds[0];
adb('install','-r','android/app/build/outputs/apk/debug/app-debug.apk');adb('shell','am','force-stop','app.worksregistry.demo');adb('shell','wm','density','480');adb('shell','wm','size','1080x1920');
await new Promise(resolve=>setTimeout(resolve,2500));adb('shell','am','start','-W','-n','app.worksregistry.demo/.MainActivity');
const [device]=await android.devices({omitDriverInstall:true});if(!device)throw Error('No recording emulator');
const page=await(await device.webView({pkg:'app.worksregistry.demo'})).page();page.setDefaultTimeout(25000);
const origin=new URL(await page.url()).origin,errors=[];page.on('pageerror',error=>errors.push(String(error)));
const go=async path=>page.goto(`${origin}/#${path}`);
let recorder,start;
const at=async seconds=>{const remaining=seconds*1000-(performance.now()-start);if(remaining>0)await page.waitForTimeout(remaining)};
try{
 await expect(page.getByRole('heading',{name:'South Mada Street',exact:true})).toBeVisible();
 await page.getByLabel('Demo account').selectOption('officer');
 for(const path of ['/review/permit-2','/project/clock-risk-thin-demo','/review/permit-1']){await go(path);await expect(page.locator('main[aria-busy="true"]:visible')).toHaveCount(0)}
 await go(`/?street=${street}`);await expect(page.getByRole('heading',{name:'Thiruvalluvar Road',exact:true})).toBeVisible();await page.waitForTimeout(1000);
 const metadata={source:'actual installed Android debug APK',package:'app.worksregistry.demo',viewport:[1080,1920],events:[]};
 const event=name=>metadata.events.push({name,seconds:(performance.now()-start)/1000});
 recorder=spawn('adb',['shell','screenrecord','--size','1080x1920','--bit-rate','4000000','--time-limit','77','/sdcard/awgur-demo-native.mp4'],{stdio:'inherit'});const finished=new Promise((resolve,reject)=>recorder.on('exit',code=>code===0?resolve():reject(Error(`Recorder exited ${code}`))));
 start=performance.now();
 await at(1);await page.getByRole('link',{name:'Review',exact:true}).click();await page.locator('a[href="#/review/permit-2"]').click();
 await at(5);await page.locator('.findings-section').scrollIntoViewIfNeeded();await expect(page.locator('.finding-label').filter({hasText:'R6'})).toHaveCount(1);event('R6 warning');
 await at(20);await page.locator('.clock-safe-start').scrollIntoViewIfNeeded();event('suggested safe window');
 await at(24);await page.getByRole('button',{name:'Apply suggested start',exact:true}).click();await expect(page.locator('.finding-label').filter({hasText:'R6'})).toHaveCount(0);await page.locator('.form-grid').scrollIntoViewIfNeeded();event('applied and rechecked');
 await at(29);await go('/project/clock-risk-thin-demo');await page.locator('.finish-forecast').scrollIntoViewIfNeeded();await expect(page.locator('.finish-forecast')).toContainText('No finish forecast');event('insufficient history');
 await at(39);await go('/review/permit-1');await page.locator('.bundling-section').scrollIntoViewIfNeeded();event('validated R3 coordination');
 await at(47);await page.getByRole('button',{name:'Apply suggested window',exact:true}).first().click();await expect(page.locator('.permit-detail .finding-label').filter({hasText:'R1'})).toHaveCount(0);event('R3 applied');
 await at(51);await page.getByRole('button',{name:'Approve as emergency',exact:true}).click();await page.getByLabel('Public emergency reason').fill('Synthetic emergency: urgent supply restoration; public exception recorded.');
 const ime=adb('shell','dumpsys','input_method');if(/mInputShown=true|mIsInputViewShown=true/.test(ime))adb('shell','input','keyevent','4');await expect.poll(()=>page.evaluate(()=>innerHeight)).toBeGreaterThan(500);
 await page.getByRole('button',{name:'Log reason & approve emergency',exact:true}).click();await page.locator('.emergency-record').scrollIntoViewIfNeeded();await expect(page.locator('.emergency-record')).toContainText('urgent supply restoration');event('public emergency reason');
 await at(65);await go(`/?street=${street}`);await expect(page.getByRole('heading',{name:'Thiruvalluvar Road',exact:true})).toBeVisible();event('closing street');
 await at(75.5);await finished;adb('pull','/sdcard/awgur-demo-native.mp4',`${out}/raw/native.mp4`);
 if(errors.length)throw Error(errors.join('\n'));writeFileSync(`${out}/native-recording.json`,JSON.stringify({...metadata,errors},null,2));
 console.log('Installed Android footage recorded against the fixed script.');
}finally{await device.close()}
