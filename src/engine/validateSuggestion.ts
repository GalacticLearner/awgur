import type { PermitRequest, Work, Suggestion } from './types';
import { DEFAULT_FLEX_DAYS } from './params';
import { addDays,assertWindow,duration } from './dates';
import { moratoriumFindings } from './rules';
export const feasible=(record:Pick<Work,'start'|'end'|'flexDays'>)=>({start:addDays(record.start,-(record.flexDays??DEFAULT_FLEX_DAYS)),end:addDays(record.end,record.flexDays??DEFAULT_FLEX_DAYS)});
export function validateSuggestion(suggestion:Suggestion,request:PermitRequest,works:Work[]):{ok:boolean;reasons:string[]} {
 const reasons:string[]=[];
 if(!suggestion.relatedWorkIds.length)reasons.push('Suggestion must involve a planned work');
 
 try{assertWindow(suggestion.start,suggestion.end);if(duration(suggestion.start,suggestion.end)<duration(request.start,request.end))reasons.push('Request duration is shortened')}catch{reasons.push('Invalid request window')}
 const window=feasible(request);
 if(suggestion.start<window.start||suggestion.end>window.end)reasons.push('Request window is outside its feasible range');
 if(moratoriumFindings({...request,start:suggestion.start,end:suggestion.end},works).length)reasons.push('Suggested request window violates R1');
 for(const workId of suggestion.relatedWorkIds){
  const work=works.find(w=>w.id===workId),scheduled=suggestion.workWindows.find(w=>w.workId===workId);
  if(!work||!scheduled){reasons.push(`Missing work or schedule: ${workId}`);continue}
  const allowed=feasible(work);

  try{assertWindow(scheduled.start,scheduled.end)}catch{reasons.push(`Invalid work window: ${workId}`)}
  if(scheduled.start<allowed.start||scheduled.end>allowed.end)reasons.push(`Work outside feasible range: ${workId}`);
  if(suggestion.kind==='sequence'&&scheduled.start<=suggestion.end)reasons.push('Resurfacing must start after excavation ends');
  if(suggestion.kind==='joint_window'&&(scheduled.start!==suggestion.start||scheduled.end!==suggestion.end))reasons.push('Joint schedules must use the same window');
  if(moratoriumFindings({...request,id:work.id,type:work.type,agency:work.agency,segmentIds:work.segmentIds,start:scheduled.start,end:scheduled.end},works.filter(w=>w.id!==work.id)).length)reasons.push(`Work window violates R1: ${workId}`);
 }
 return {ok:reasons.length===0,reasons};
}


