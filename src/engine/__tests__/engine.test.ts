import { describe,it,expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { addMonths,addDays,utc,checkPermit,suggestBundling,validateSuggestion } from '../index';
import type { Segment,Work,PermitRequest,GroundTruth } from '../types';
const read=<T,>(name:string):T=>JSON.parse(readFileSync(`public/data/${name}.json`,'utf8'));
const segments=read<Segment[]>('segments'),fixtures=read<Work[]>('fixtures'),cases=read<GroundTruth[]>('ground_truth');
const s=segments[0].id;
const request=(patch:Partial<PermitRequest>={}):PermitRequest=>({id:'new',agency:'CMWSSB',type:'cut',purpose:'Test',segmentIds:[s],start:'2026-10-10',end:'2026-10-17',flexDays:30,channel:'municipal',...patch});
const work=(patch:Partial<Work>={}):Work=>({id:'existing',title:'Existing',agency:'GCC',type:'relay',purpose:'Test',segmentIds:[s],start:'2025-09-01',end:'2025-10-01',actualEnd:'2025-10-12',status:'completed',delays:[],flexDays:30,...patch});
describe('Constructed ground truth',()=>{for(const item of cases)it(item.id,()=>{const works=fixtures.filter(w=>item.existingWorkIds.includes(w.id));const actual=checkPermit(item.request,works,segments).map(f=>f.rule);if(suggestBundling(item.request,works,segments).length)actual.push('R3');expect([...new Set(actual)].sort()).toEqual([...item.expectedRules].sort());for(const suggestion of suggestBundling(item.request,works,segments))expect(validateSuggestion(suggestion,item.request,works).ok).toBe(true)})});
describe('UTC dates and strict moratorium boundary',()=>{
 it('clamps leap and non-leap month ends',()=>{expect(addMonths('2024-01-31',1)).toBe('2024-02-29');expect(addMonths('2025-01-31',1)).toBe('2025-02-28');expect(addMonths('2024-02-29',12)).toBe('2025-02-28')});
 it('rejects invalid dates and backwards windows',()=>{expect(()=>utc('2026-02-30')).toThrow();expect(()=>checkPermit(request({end:'2026-09-01'}),[],segments)).toThrow()});
 it('does not warn exactly at twelve calendar months',()=>{expect(checkPermit(request({start:'2026-10-12'}),[work()],segments)).toEqual([])});
 it('uses actual completion rather than planned end',()=>{expect(checkPermit(request(),[work()],segments).some(f=>f.rule==='R1')).toBe(true)});
 it('has identical output in Kolkata and Los Angeles',()=>{const outputs=['Asia/Kolkata','America/Los_Angeles'].map(TZ=>{const result=spawnSync(process.execPath,['--import','tsx','scripts/date_probe.ts'],{encoding:'utf8',env:{...process.env,TZ}});expect(result.status,result.stderr).toBe(0);return result.stdout});expect(outputs[0]).toBe(outputs[1])});
});
describe('Spatial, cancellation and project boundaries',()=>{
 it('accepts an empty segment list',()=>expect(checkPermit(request({segmentIds:[]}),[work()],segments)).toEqual([]));
 it('ignores cancelled works',()=>expect(checkPermit(request(),[work({status:'cancelled'}),work({id:'cut',type:'cut',status:'cancelled'})],segments)).toEqual([]));
 it('works without neighbors',()=>expect(checkPermit(request(),[work({type:'cable',agency:'Tangedco',start:'2026-10-05',end:'2026-10-15',actualEnd:undefined})],[{...segments[0],neighbors:[]}]).some(f=>f.rule==='R2')).toBe(true));
 it('deduplicates overlapping multi-segment work',()=>{const other=segments[1].id;const result=checkPermit(request({segmentIds:[s,s,other]}),[work({segmentIds:[s,other]})],segments);expect(result.filter(f=>f.rule==='R1')).toHaveLength(2)});
 it('does not treat absent project ids as one project',()=>expect(checkPermit(request(),[work({agency:'CMWSSB',type:'cut',start:'2026-10-01',end:'2026-10-04',actualEnd:undefined})],segments).some(f=>f.rule==='R2')).toBe(true));
 it('counts ninety days, excludes ninety-one',()=>{const existing=work({type:'cut',agency:'Tangedco',start:'2026-01-01',end:'2026-01-08',actualEnd:'2026-01-08'});expect(checkPermit(request({start:addDays(existing.end,90),end:addDays(existing.end,95)}),[existing],segments).some(f=>f.rule==='R2')).toBe(true);expect(checkPermit(request({start:addDays(existing.end,91),end:addDays(existing.end,96)}),[existing],segments)).toEqual([])});
});
describe('Bundling guardrails',()=>{
 it('never compresses a long work into a too-short intersection',()=>{const existing=work({type:'pipeline',status:'planned',agency:'CMWSSB',projectId:'shared',start:'2026-10-17',end:'2026-11-17',actualEnd:undefined,flexDays:0});expect(suggestBundling(request({projectId:'shared',flexDays:0}),[existing],segments)).toEqual([])});
 it('validates rejection of a shifted window inside R1',()=>{const candidate={id:'bad',kind:'joint_window' as const,segmentId:s,requestId:'new',relatedWorkIds:[],start:'2026-10-10',end:'2026-10-17',workWindows:[],message:'Test',targets:[]};expect(validateSuggestion(candidate,request(),[work()]).ok).toBe(false)});
 it('is deterministic even if work order changes',()=>{const works=read<Work[]>('works'),requests=read<PermitRequest[]>('requests');expect(checkPermit(requests[0],works,segments)).toEqual(checkPermit(requests[0],[...works].reverse(),segments));expect(suggestBundling(requests[0],works,segments)).toEqual(suggestBundling(requests[0],[...works].reverse(),segments))});
 it('hero has R1, R2 and a validated R3 that removes R1',()=>{const works=read<Work[]>('works'),req=read<PermitRequest[]>('requests')[0];const findings=checkPermit(req,works,segments);expect(findings.some(f=>f.rule==='R1')).toBe(true);expect(findings.some(f=>f.rule==='R2')).toBe(true);const suggestion=suggestBundling(req,works,segments).find(x=>x.targets.includes('R1'));expect(suggestion).toBeDefined();expect(validateSuggestion(suggestion!,req,works).ok).toBe(true);expect(checkPermit({...req,start:suggestion!.start,end:suggestion!.end},works,segments).some(f=>f.rule==='R1')).toBe(false)});
});

