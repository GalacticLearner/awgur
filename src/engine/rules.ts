import type { Work,PermitRequest,Finding,Segment,WorkType } from './types';
import { DISTURBING_TYPES,RESURFACING_TYPES,MORATORIUM_MONTHS,REPEAT_GAP_DAYS,AVERAGE_DAYS_PER_MONTH } from './params';
import { addMonths,assertWindow,daysBetween,intervalGap } from './dates';
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
 const unique=new Map(findings.map(f=>[`${f.rule}:${f.segmentId}:${f.relatedWorkIds.join(',')}`,f]));
 return [...unique.values()].sort((a,b)=>`${a.rule}:${a.segmentId}:${a.relatedWorkIds.join(',')}`.localeCompare(`${b.rule}:${b.segmentId}:${b.relatedWorkIds.join(',')}`));
}
