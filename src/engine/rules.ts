import type { Work,PermitRequest,Finding,Segment,WorkType } from './types';
import { DISTURBING_TYPES,RESURFACING_TYPES,MORATORIUM_MONTHS,REPEAT_GAP_DAYS,AVERAGE_DAYS_PER_MONTH,ENABLE_CLOCK_RISK,CLOCK_RISK_NEAR_DAYS,DEMO_TODAY } from './params';
import { addDays,addMonths,assertWindow,daysBetween,intervalGap } from './dates';
import { forecastEnd } from './slip';
export const isDisturbing=(type:WorkType)=>DISTURBING_TYPES.some(value=>value===type);
export const isResurfacing=(type:WorkType)=>RESURFACING_TYPES.some(value=>value===type);
export const effectiveEnd=(work:Work)=>work.actualEnd??work.end;
export function moratoriumFindings(request:PermitRequest,works:Work[]):Finding[] {
 if(!isDisturbing(request.type))return [];
 const findings:Finding[]=[];
 for(const segmentId of new Set(request.segmentIds))for(const work of works){
  if(work.id===request.id||!work.segmentIds.includes(segmentId)||!isResurfacing(work.type)||!['completed','ongoing'].includes(work.status))continue;
  const end=effectiveEnd(work),expiresOn=addMonths(end,MORATORIUM_MONTHS);
  if(end<request.start&&request.start<expiresOn)findings.push({rule:'R1',severity:'warn',segmentId,relatedWorkIds:[work.id],message:`This segment was relaid on ${end}. The configurable ${MORATORIUM_MONTHS}-month no-dig window ends ${expiresOn}.${request.emergency?' Emergency warning remains; a public override reason is required.':''}`,detail:{completedOn:end,expiresOn,monthsRemaining:Math.ceil(daysBetween(request.start,expiresOn)/AVERAGE_DAYS_PER_MONTH),configurableDefault:true,emergency:!!request.emergency}});
 }
 return findings;
}
export function checkClockRisk(request:PermitRequest,works:Work[],ledger:Work[],today=DEMO_TODAY):Finding[] {
 if(!ENABLE_CLOCK_RISK||!isDisturbing(request.type))return [];
 const findings:Finding[]=[];
 for(const segmentId of new Set(request.segmentIds))for(const work of works){
  if(work.id===request.id||!work.segmentIds.includes(segmentId)||!isResurfacing(work.type)||!['planned','ongoing'].includes(work.status)||work.end>=request.start)continue;
  const plannedExpiry=addMonths(work.end,MORATORIUM_MONTHS);
  if(work.status==='ongoing'&&request.start<plannedExpiry)continue;
  const forecast=forecastEnd(work,ledger,today);
  if(work.status==='planned'&&request.start<plannedExpiry){
   findings.push({rule:'R6',severity:'warn',segmentId,relatedWorkIds:[work.id],message:`This planned road work ends ${work.end}. If it finishes on time, the ${MORATORIUM_MONTHS}-month window ends ${plannedExpiry}, after this permit starts.${request.emergency?' A public emergency override reason is required.':''}`,detail:{basis:'planned_dates',baselineEnd:work.end,plannedExpiry,forecastStatus:forecast.status,...(forecast.status==='ok'?{upperEnd:forecast.upperEnd,boundExpiry:addMonths(forecast.upperEnd!,MORATORIUM_MONTHS),n:forecast.n}:{}),configurableDefault:true,emergency:!!request.emergency}});continue;
  }
  if(forecast.status==='ok'){
   const boundExpiry=addMonths(forecast.upperEnd!,MORATORIUM_MONTHS);
   if(request.start<boundExpiry)findings.push({rule:'R6',severity:'warn',segmentId,relatedWorkIds:[work.id],message:`Clear on planned dates, but not if this road work runs late. Its latest likely finish is ${forecast.upperEnd}; the window then ends ${boundExpiry}, after this permit starts.${request.emergency?' A public emergency override reason is required.':''}`,detail:{basis:'slip_bound',baselineEnd:work.end,plannedExpiry,upperEnd:forecast.upperEnd,boundExpiry,boundDays:forecast.boundDays,n:forecast.n,classKey:forecast.classKey,alpha:forecast.alpha,emergency:!!request.emergency}});
  } else if(forecast.status==='insufficient'&&request.start<addDays(plannedExpiry,CLOCK_RISK_NEAR_DAYS))findings.push({rule:'R6',severity:'info',segmentId,relatedWorkIds:[work.id],message:`No slip forecast: ${forecast.n} comparable completed works are available; at least ${forecast.needed} are needed. This check uses planned dates only.`,detail:{basis:'not_assessed',baselineEnd:work.end,plannedExpiry,n:forecast.n,needed:forecast.needed,classKey:forecast.classKey}});
 }
 return findings.sort((a,b)=>`${a.segmentId}:${a.relatedWorkIds.join(',')}`.localeCompare(`${b.segmentId}:${b.relatedWorkIds.join(',')}`));
}
export function earliestSafeStart(request:PermitRequest,findings:Finding[],works:Work[],segments:Segment[]):PermitRequest|null {
 const clearDates=findings.filter(finding=>finding.rule==='R6'&&finding.severity==='warn').map(finding=>String(finding.detail.boundExpiry??finding.detail.plannedExpiry)).filter(date=>/^\d{4}-\d{2}-\d{2}$/.test(date));
 if(!clearDates.length)return null;
 const start=clearDates.sort().at(-1)!,shift=daysBetween(request.start,start),candidate={...request,start,end:addDays(request.end,shift)};
 return checkPermit(candidate,works,segments).some(finding=>finding.severity==='warn'&&['R1','R2','R6'].includes(finding.rule))?null:candidate;
}
export function checkPermit(request:PermitRequest,works:Work[],segments:Segment[]):Finding[] {
 assertWindow(request.start,request.end);
 const findings=moratoriumFindings(request,works);
 if(isDisturbing(request.type))for(const segmentId of new Set(request.segmentIds)){
  const nearby=new Set([segmentId,...(segments.find(s=>s.id===segmentId)?.neighbors||[])]);
  for(const work of works){
   if(work.id===request.id||work.status==='cancelled'||!isDisturbing(work.type)||!work.segmentIds.some(id=>nearby.has(id)))continue;
   if(work.agency===request.agency&&work.projectId&&request.projectId&&work.projectId===request.projectId)continue;
   const gapDays=intervalGap(request.start,request.end,work.start,effectiveEnd(work));
   if(gapDays<=REPEAT_GAP_DAYS)findings.push({rule:'R2',severity:'warn',segmentId,relatedWorkIds:[work.id],message:`${work.agency} has another excavation on this or an endpoint-connected segment, ${gapDays===0?'with overlapping dates':`${gapDays} days away`}. Review coordination against the ${REPEAT_GAP_DAYS}-day demo assumption.`,detail:{gapDays,adjacent:!work.segmentIds.includes(segmentId),assumption:true}});
  }
 }
 findings.push(...checkClockRisk(request,works,works,DEMO_TODAY));
 const unique=new Map(findings.map(f=>[`${f.rule}:${f.segmentId}:${f.relatedWorkIds.join(',')}`,f]));
 return [...unique.values()].sort((a,b)=>`${a.rule}:${a.segmentId}:${a.relatedWorkIds.join(',')}`.localeCompare(`${b.rule}:${b.segmentId}:${b.relatedWorkIds.join(',')}`));
}
