import type { Work } from './types';
import { addDays,daysBetween } from './dates';
import { SLIP_ALPHA } from './params';

export interface SlipForecast {
 status:'ok'|'insufficient'|'not_applicable';baselineEnd:string;upperEnd?:string;boundDays?:number;
 classKey:string;nClass:number;n:number;needed:number;overdueDays?:number;alpha:number;
}

export function slipDays(work:Work):number|null {
 if(work.status!=='completed'||!work.actualEnd)return null;
 return daysBetween(work.end,work.actualEnd);
}

export function conformalUpper(scores:number[],alpha:number):number|null {
 if(!(alpha>0&&alpha<1))throw new RangeError('alpha must be between zero and one');
 if(scores.some(score=>!Number.isFinite(score)))throw new RangeError('Slip scores must be finite');
 const sorted=[...scores].sort((a,b)=>a-b),k=Math.ceil((sorted.length+1)*(1-alpha)-1e-9);
 return k>=1&&k<=sorted.length?sorted[k-1]:null;
}

export function forecastEnd(work:Work,ledger:Work[],today:string,alpha=SLIP_ALPHA):SlipForecast {
 if(!(alpha>0&&alpha<1))throw new RangeError('alpha must be between zero and one');
 const base={baselineEnd:work.end,classKey:'all',nClass:0,n:0,needed:Math.ceil(1/alpha)-1,alpha};
 if(work.status==='completed'||work.status==='cancelled')return {status:'not_applicable',...base};
 const eligible=ledger.filter(item=>item.id!==work.id&&item.status==='completed'&&slipDays(item)!==null);
 const classes:[string,(item:Work)=>boolean][]=[
  [`${work.agency}|${work.type}`,item=>item.agency===work.agency&&item.type===work.type],
  [work.agency,item=>item.agency===work.agency],
  [work.type,item=>item.type===work.type],
  ['all',()=>true]
 ];
 const selected=classes.map(([key,test])=>({key,items:eligible.filter(test)})).find(group=>group.items.length>=base.needed);
 if(!selected)return {status:'insufficient',...base,nClass:eligible.length,n:eligible.length};
 const overdueDays=work.status==='ongoing'&&today>work.end?daysBetween(work.end,today):undefined;
 const scores=selected.items.map(item=>slipDays(item)!).filter(score=>overdueDays===undefined||score>overdueDays);
 const bound=conformalUpper(scores,alpha);
 const common={...base,classKey:selected.key,nClass:selected.items.length,n:scores.length,...(overdueDays===undefined?{}:{overdueDays})};
 if(bound===null)return {status:'insufficient',...common};
 return {status:'ok',...common,boundDays:bound,upperEnd:addDays(work.end,Math.max(0,bound))};
}
