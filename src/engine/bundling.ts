import type { PermitRequest,Work,Segment,Suggestion,Rule } from './types';
import { BUNDLE_HORIZON_DAYS,MORATORIUM_MONTHS } from './params';
import { addDays,addMonths,assertWindow,duration,intervalGap } from './dates';
import { checkPermit,effectiveEnd,isDisturbing,isResurfacing } from './rules';
import { feasible,validateSuggestion } from './validateSuggestion';
export function suggestBundling(request:PermitRequest,works:Work[],segments:Segment[]):Suggestion[] {
 assertWindow(request.start,request.end);if(!isDisturbing(request.type))return [];
 const suggestions:Suggestion[]=[];
 const before=checkPermit(request,works,segments);
 for(const segmentId of new Set(request.segmentIds))for(const work of works){
  if(work.status!=='planned'||!work.segmentIds.includes(segmentId)||work.id===request.id||(!isDisturbing(work.type)&&!isResurfacing(work.type))||intervalGap(request.start,request.end,work.start,work.end)>BUNDLE_HORIZON_DAYS)continue;
  const rw=feasible(request),ww=feasible(work),longer=Math.max(duration(request.start,request.end),duration(work.start,work.end));
  let start=rw.start>ww.start?rw.start:ww.start;
  const endLimit=rw.end<ww.end?rw.end:ww.end;
  // Advance to the end of a protection period when the flexible windows allow it.
  for(const relay of works.filter(w=>w.segmentIds.includes(segmentId)&&isResurfacing(w.type)&&['completed','ongoing'].includes(w.status)).sort((a,b)=>effectiveEnd(a).localeCompare(effectiveEnd(b)))){const end=effectiveEnd(relay),expiry=addMonths(end,MORATORIUM_MONTHS);if(end<start&&start<expiry)start=expiry}
  let suggestion:Suggestion|undefined;
  const jointEnd=addDays(start,longer-1);
  if(jointEnd<=endLimit){suggestion={id:`joint-${request.id}-${work.id}-${segmentId}`,kind:'joint_window',segmentId,requestId:request.id,relatedWorkIds:[work.id],start,end:jointEnd,workWindows:[{workId:work.id,start,end:jointEnd}],message:`Coordinate with ${work.agency} in one feasible window. Longer work duration is preserved.`,targets:[]}}
  else if(isResurfacing(work.type)&&work.start>request.end){suggestion={id:`sequence-${request.id}-${work.id}-${segmentId}`,kind:'sequence',segmentId,requestId:request.id,relatedWorkIds:[work.id],start:request.start,end:request.end,workWindows:[{workId:work.id,start:work.start,end:work.end}],message:'Complete the utility excavation first, then resurface the road.',targets:[]}}
  if(!suggestion||!validateSuggestion(suggestion,request,works).ok)continue;
  const shiftedWorks=works.map(w=>{const window=suggestion!.workWindows.find(x=>x.workId===w.id);return window?{...w,start:window.start,end:window.end}:w});
  const after=checkPermit({...request,start:suggestion.start,end:suggestion.end},shiftedWorks,segments);
  suggestion.targets=(['R1','R2'] as Rule[]).filter(rule=>before.some(f=>f.rule===rule)&&!after.some(f=>f.rule===rule));
  suggestions.push(suggestion);
 }
 return suggestions.sort((a,b)=>a.start.localeCompare(b.start)||a.id.localeCompare(b.id));
}

