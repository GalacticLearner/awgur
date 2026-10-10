import {coverageSimulation} from './clock_simulation';
import {forecastEnd,checkClockRisk,addDays} from '../src/engine';
import type {Work,PermitRequest} from '../src/engine/types';
const work:Work={id:'relay',title:'UTC relay',type:'relay',agency:'GCC',purpose:'probe',segmentIds:['utc'],start:'2024-01-01',end:'2024-02-29',status:'planned',delays:[]};
const ledger=Array.from({length:19},(_,i)=>({...work,id:`history-${i}`,status:'completed' as const,actualEnd:addDays(work.end,i)}));
const request:PermitRequest={id:'utc-cut',type:'cut',agency:'BSNL',purpose:'probe',segmentIds:['utc'],start:'2025-03-01',end:'2025-03-05',channel:'municipal'};
console.log(JSON.stringify({forecast:forecastEnd(work,ledger,'2024-03-01'),findings:checkClockRisk(request,[work],ledger,'2024-03-01'),simulations:coverageSimulation()}));
