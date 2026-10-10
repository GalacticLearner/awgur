import {describe,it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {conformalUpper,forecastEnd,checkClockRisk,earliestSafeStart,addDays} from '../index';
import type {Work,PermitRequest,Segment} from '../types';
import {spawnSync} from 'node:child_process';
import {coverageSimulation} from '../../../scripts/clock_simulation';
import {clockSeed} from '../clockSeed';

const segment:Segment={id:'s',name:'Clock Street',wayId:1,coords:[[13,80],[13.001,80.001]],lengthM:100,neighbors:[]};
const completed=(id:string,slip:number,patch:Partial<Work>={}):Work=>({id,title:id,type:'relay',agency:'GCC',purpose:'test',segmentIds:['s'],start:'2025-01-01',end:'2025-01-10',actualEnd:addDays('2025-01-10',slip),status:'completed',delays:[],...patch});
const planned=(patch:Partial<Work>={}):Work=>({id:'planned',title:'Planned relay',type:'relay',agency:'GCC',purpose:'test',segmentIds:['s'],start:'2026-01-01',end:'2026-01-10',status:'planned',delays:[],...patch});
const request=(patch:Partial<PermitRequest>={}):PermitRequest=>({id:'request',agency:'CMWSSB',type:'cut',purpose:'test',segmentIds:['s'],start:'2027-01-12',end:'2027-01-15',channel:'municipal',...patch});

describe('Clock Risk conformal finish bound',()=>{
 it('uses the finite-sample order statistic without floating point overshoot',()=>{for(const [n,k] of [[9,9],[19,18],[29,27],[99,90]])expect(conformalUpper(Array.from({length:n},(_,i)=>i),.1)).toBe(k-1)});
 it('handles insufficient, unsorted, tied and negative scores',()=>{expect(conformalUpper([4,1,1,-2,8,3,2,0],.1)).toBeNull();expect(conformalUpper([9,1,3,3,4,5,6,7,8],.1)).toBe(9)});
 it('falls back through reference classes and excludes itself',()=>{const ledger=Array.from({length:9},(_,i)=>completed(`w${i}`,i,{agency:'CMWSSB',type:'cut'}));const forecast=forecastEnd(planned({agency:'GCC',type:'relay'}),ledger,'2026-10-10');expect(forecast.status).toBe('ok');expect(forecast.classKey).toBe('all');expect(forecast.n).toBe(9)});
 it('conditions overdue works on slips beyond elapsed lateness',()=>{const ledger=Array.from({length:19},(_,i)=>completed(`w${i}`,i));const forecast=forecastEnd(planned({status:'ongoing',end:'2026-10-01'}),ledger,'2026-10-10');expect(forecast.overdueDays).toBe(9);expect(forecast.n).toBe(9);expect(forecast.status).toBe('ok')});
 it('is not applicable to completed or cancelled works',()=>expect(forecastEnd(completed('done',3),[],'2026-10-10').status).toBe('not_applicable'));
 it('retains the first sufficient pre-filter class even if overdue conditioning removes most scores',()=>{const ledger=Array.from({length:9},(_,i)=>completed(`same-${i}`,1));ledger.push(...Array.from({length:20},(_,i)=>completed(`other-${i}`,40,{agency:'Other'})));const result=forecastEnd(planned({status:'ongoing',end:'2026-10-01'}),ledger,'2026-10-10');expect(result.classKey).toBe('GCC|relay');expect(result.nClass).toBe(9);expect(result.n).toBe(0);expect(result.status).toBe('insufficient')});
 it('ignores cancelled, missing dates and the work itself',()=>{const history=Array.from({length:8},(_,i)=>completed(`w${i}`,3));history.push(completed('planned',7),completed('cancelled',20,{status:'cancelled'}),completed('missing',20,{actualEnd:undefined}));expect(forecastEnd(planned(),history,'2026-10-10').status).toBe('insufficient')});
 it('clamps negative slip bounds to the baseline date',()=>{const result=forecastEnd(planned(),Array.from({length:9},(_,i)=>completed(`w${i}`,-3)),'2026-10-10');expect(result.boundDays).toBe(-3);expect(result.upperEnd).toBe('2026-01-10')});
});

describe('R6 decision and safe start',()=>{
 const ledger=Array.from({length:19},(_,i)=>completed(`w${i}`,i+1));
 it('warns when planned dates themselves clash',()=>expect(checkClockRisk(request({start:'2027-01-05'}),[planned()],ledger).at(0)?.detail.basis).toBe('planned_dates'));
 it('warns on a slip bound after planned dates clear',()=>expect(checkClockRisk(request(),[planned()],ledger).at(0)?.detail.basis).toBe('slip_bound'));
 it('shows information when nearby risk cannot be assessed',()=>expect(checkClockRisk(request(),[planned({agency:'BSNL'})],[]).at(0)?.detail.basis).toBe('not_assessed'));
 it('skips work ending after the request and ongoing clashes already owned by R1',()=>{expect(checkClockRisk(request({start:'2026-01-05'}),[planned()],ledger)).toEqual([]);expect(checkClockRisk(request({start:'2027-01-05'}),[planned({status:'ongoing'})],ledger)).toEqual([])});
 it('proposes a shifted window only when recheck has no warning',()=>{const work=planned(),findings=checkClockRisk(request(),[work,...ledger],ledger);const safe=earliestSafeStart(request(),findings,[work,...ledger],[segment]);expect(safe?.start).toBe('2027-01-28');expect(safe&&Number(new Date(safe.end))-Number(new Date(safe.start))).toBe(3*86400000)});
 it('rejects a proposed start that creates another excavation clash',()=>{const work=planned(),findings=checkClockRisk(request(),[work],ledger);const conflict=completed('later-cut',0,{type:'cable',agency:'Tangedco',status:'planned',start:'2027-01-28',end:'2027-02-02',actualEnd:undefined});expect(earliestSafeStart(request(),findings,[work,...ledger,conflict],[segment])).toBeNull()});
 it('retains emergency warnings and handles exact leap/month boundaries',()=>{expect(checkClockRisk(request({emergency:{reason:'burst main'}}),[planned()],ledger).at(0)?.detail.emergency).toBe(true);const relay=planned({end:'2024-02-29'});expect(checkClockRisk(request({start:'2025-02-27'}),[relay],[]).at(0)?.detail.plannedExpiry).toBe('2025-02-28');expect(checkClockRisk(request({start:'2025-02-28'}),[relay],[]).at(0)?.severity).toBe('info')});
 it('does not assess different segments, inspections or sufficiently distant requests',()=>{expect(checkClockRisk(request(),[planned({segmentIds:['other']})],ledger)).toEqual([]);expect(checkClockRisk(request({type:'inspection'}),[planned()],ledger)).toEqual([]);expect(checkClockRisk(request({start:'2028-01-01'}),[planned()],[])).toEqual([])});
});

describe('Coverage and regression gates',()=>{
 it('covers independent draws and overdue-conditioned draws across three distributions',()=>{for(const result of coverageSimulation()){expect(result.coverage,JSON.stringify(result)).toBeGreaterThanOrEqual(.89);if(result.continuous)expect(result.coverage,JSON.stringify(result)).toBeLessThanOrEqual(.9+1/(result.n+1)+.01)}},60000);
 it('has identical R6, forecast and simulation output in both timezones',()=>{const outputs=['Asia/Kolkata','America/Los_Angeles'].map(TZ=>{const result=spawnSync(process.execPath,['--import','tsx','scripts/clock_probe.ts'],{encoding:'utf8',env:{...process.env,TZ},timeout:60000});expect(result.status,result.stderr).toBe(0);return result.stdout});expect(outputs[0]).toBe(outputs[1])},120000);
 it('removes additive seed records and restores the original pending permit when disabled',()=>{const original=request({id:'permit-2'}),changed={...original,title:'Post-relay service connection',start:'2027-10-23'};const result=clockSeed([planned(),planned({id:'ledger-001'}),planned({id:'clock-risk-demo'})],[changed],original,false);expect(result.works).toEqual([planned()]);expect(result.requests).toEqual([original])});
 it('reproduces the complete pre-feature seed when disabled and preserves R1/R2/R3 metrics',()=>{const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));const baseline=read('src/engine/__tests__/fixtures/base-seed.json');const switched=clockSeed(read('public/data/works.json'),read('public/data/requests.json'),read('public/data/demo.json').basePermit2,false);expect([...switched.works].sort((a,b)=>a.id.localeCompare(b.id))).toEqual([...baseline.works].sort((a,b)=>a.id.localeCompare(b.id)));expect(switched.requests).toEqual(baseline.requests);const current=read('public/data/validation.json');expect(current.rules).toEqual(baseline.validation.rules);expect(current.r3).toEqual(baseline.validation.r3);expect(current.baselines).toEqual(baseline.validation.baselines)});
 it('returns no R6 findings with the feature flag disabled',async()=>{vi.resetModules();vi.doMock('../params',async()=>({...await vi.importActual<typeof import('../params')>('../params'),ENABLE_CLOCK_RISK:false}));try{const module=await import('../rules');expect(module.checkClockRisk(request({start:'2027-01-05'}),[planned()],[])).toEqual([])}finally{vi.doUnmock('../params');vi.resetModules()}});
});
