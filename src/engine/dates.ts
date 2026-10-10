import { MILLISECONDS_PER_DAY } from './params';
export function utc(iso:string):number {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))throw new RangeError(`Invalid date: ${iso}`);
 const [year,month,day]=iso.split('-').map(Number);
 const date=new Date(Date.UTC(year,month-1,day));
 if(date.toISOString().slice(0,10)!==iso)throw new RangeError(`Invalid date: ${iso}`);
 return date.getTime();
}
export const iso=(stamp:number)=>new Date(stamp).toISOString().slice(0,10);
export const addDays=(date:string,days:number)=>iso(utc(date)+days*MILLISECONDS_PER_DAY);
export const daysBetween=(a:string,b:string)=>Math.round((utc(b)-utc(a))/MILLISECONDS_PER_DAY);
export function addMonths(date:string,months:number):string {
 const current=new Date(utc(date));const target=new Date(Date.UTC(current.getUTCFullYear(),current.getUTCMonth()+months,1));
 const last=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();
 return iso(Date.UTC(target.getUTCFullYear(),target.getUTCMonth(),Math.min(current.getUTCDate(),last)));
}
export function intervalGap(aStart:string,aEnd:string,bStart:string,bEnd:string):number {return Math.max(0,daysBetween(aEnd,bStart),daysBetween(bEnd,aStart))}
export function assertWindow(start:string,end:string):void {if(utc(end)<utc(start))throw new RangeError('End date must be on or after start date')}
export const duration=(start:string,end:string)=>daysBetween(start,end)+1;
