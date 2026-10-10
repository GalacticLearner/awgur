import { createContext,useContext,useEffect,useState } from 'react';
import type { ReactNode } from 'react';
import type { Work,PermitRequest,Segment,ValidationReport,DelayEntry,Suggestion } from '../engine/types';
import { DEMO_TODAY,RESTORATION_DAYS,addDays,validateSuggestion,assertWindow,utc,ENABLE_CLOCK_RISK } from '../engine';
import { clockSeed } from '../engine/clockSeed';
type Role='resident'|'officer';
interface Stored { version:1;works:Work[];requests:PermitRequest[];followed:string[];role:Role }
interface Data { segments:Segment[];validation:ValidationReport;demo:{heroStreetId:string;heroStreetName:string;heroProjectIds:string[]};geometry:{source:string;attribution:string;segmentCount:number} }
interface Store extends Data,Stored { loading:boolean;error:string;saveError:string;reload:()=>void;setRole:(role:Role)=>void;follow:(id:string)=>void;addDelay:(id:string,entry:DelayEntry)=>void;applySuggestion:(id:string,suggestion:Suggestion)=>void;decide:(id:string,decision:'approved'|'change_requested'|'emergency',reason?:string)=>string|undefined;addRequest:(request:PermitRequest)=>void;updateRequest:(id:string,patch:Partial<PermitRequest>)=>void;reset:()=>void }
const KEY='works-registry-v1';
const Context=createContext<Store|null>(null);
const blankData:Data={segments:[],validation:{cases:0,scope:'',rules:{} as ValidationReport['rules'],baselines:{},r3:{suggestions:0,valid:0,passRate:0,invalid:[]},counts:{}},demo:{heroStreetId:'',heroStreetName:'',heroProjectIds:[]},geometry:{source:'',attribution:'',segmentCount:0}};
function readStored(segmentIds:Set<string>):Stored|undefined {
 try {
  const value=JSON.parse(localStorage.getItem(KEY)||'null');
  if(value?.version!==1||!Array.isArray(value.works)||!Array.isArray(value.requests)||!Array.isArray(value.followed)||!['resident','officer'].includes(value.role))return;
  const types=['cut','pipeline','cable','drain','relay','resurface','inspection'];
  const validRecord=(record:any)=>{if(!record||typeof record.id!=='string'||! /^[a-zA-Z0-9_-]+$/.test(record.id)||typeof record.agency!=='string'||typeof record.purpose!=='string'||!types.includes(record.type)||!Array.isArray(record.segmentIds)||!record.segmentIds.every((id:unknown)=>typeof id==='string'&&segmentIds.has(id)))return false;assertWindow(record.start,record.end);if(record.emergency&&(typeof record.emergency.reason!=='string'||!record.emergency.reason.trim()))return false;return true};
  const codes=['contractor','weather','utility_clash','material','permit_wait','funds','scope_change','other'];
  if(!value.works.every((work:any)=>validRecord(work)&&typeof work.title==='string'&&['planned','ongoing','completed','cancelled'].includes(work.status)&&Array.isArray(work.delays)&&work.delays.every((entry:any)=>entry&&codes.includes(entry.code)&&typeof entry.date==='string'&&Number.isFinite(utc(entry.date))&&(entry.note===undefined||typeof entry.note==='string'))))return;
  if(!value.requests.every((request:any)=>validRecord(request)&&['municipal','telecom_row'].includes(request.channel)))return;
  if(!value.followed.every((id:unknown)=>typeof id==='string'))return;
  for(const work of value.works){if(work.actualEnd)assertWindow(work.start,work.actualEnd);if(work.restorationDue)utc(work.restorationDue);if(work.restoredOn)utc(work.restoredOn)}
  return value;
 }catch{/* Unreadable local demo state safely restores the bundled seed. */}
}

export function StoreProvider({children}:{children:ReactNode}) {
 const [state,setState]=useState<Stored>({version:1,works:[],requests:[],followed:[],role:'resident'});
 const [data,setData]=useState<Data>(blankData),[seeds,setSeeds]=useState<{works:Work[];requests:PermitRequest[]}>({works:[],requests:[]});
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[saveError,setSaveError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let cancelled=false;setLoading(true);setError('');const load=async()=>{try{
  const names=['segments','works','requests','validation','demo','geometry'];
  const [segments,works,requests,validation,demo,geometry]=await Promise.all(names.map(async name=>{const response=await fetch(`./data/${name}.json`);if(!response.ok)throw Error(`Missing ${name} data`);return response.json()}));
  if(!Array.isArray(segments)||!segments.length||!Array.isArray(works)||!Array.isArray(requests)||!validation.rules||!demo.heroStreetId)throw Error('Demo data could not be read');
  if(cancelled)return;
  const seed=clockSeed(works,requests,demo.basePermit2,ENABLE_CLOCK_RISK);
  const stored=readStored(new Set(segments.map((segment:Segment)=>segment.id)));
  if(stored&&ENABLE_CLOCK_RISK&&!stored.works.some(work=>work.id==='clock-risk-relay-demo')){
   stored.works.push(...works.filter((work:Work)=>work.id.startsWith('ledger-')||work.id.startsWith('clock-risk-')));
   stored.requests=stored.requests.map(request=>request.id==='permit-2'&&!request.decision&&request.start===demo.basePermit2?.start&&request.end===demo.basePermit2?.end?requests.find((item:PermitRequest)=>item.id==='permit-2'):request);
  }
  const restored=stored?{...stored,...clockSeed(stored.works,stored.requests,demo.basePermit2,ENABLE_CLOCK_RISK)}:undefined;
  setData({segments,validation,demo,geometry});setSeeds(seed);setState(restored||{version:1,...seed,followed:[],role:'resident'});setLoading(false);
 }catch{if(!cancelled){setError('The bundled demo data could not be loaded. Try reloading the registry.');setLoading(false)}}};void load();return()=>{cancelled=true}},[attempt]);
 useEffect(()=>{if(loading||error)return;try{localStorage.setItem(KEY,JSON.stringify(state));setSaveError('')}catch{setSaveError('Changes cannot be saved on this device. Keep the app open or free some storage.')}},[state,loading,error]);
 const update=(fn:(value:Stored)=>Stored)=>setState(fn);
 const store:Store={...data,...state,loading,error,saveError,reload:()=>setAttempt(n=>n+1),setRole:role=>update(s=>({...s,role})),follow:id=>update(s=>({...s,followed:s.followed.includes(id)?s.followed.filter(x=>x!==id):[...s.followed,id]})),
 addDelay:(id,entry)=>update(s=>({...s,works:s.works.map(w=>w.id===id?{...w,delays:[...w.delays,entry]}:w)})),
 applySuggestion:(id,suggestion)=>{const request=state.requests.find(r=>r.id===id);if(!request||!validateSuggestion(suggestion,request,state.works).ok)throw Error('Suggestion is no longer valid. Review the permit again.');update(s=>({...s,requests:s.requests.map(r=>r.id===id?{...r,start:suggestion.start,end:suggestion.end}:r),works:s.works.map(w=>{const scheduled=suggestion.workWindows.find(x=>x.workId===w.id);return scheduled?{...w,start:scheduled.start,end:scheduled.end,restorationDue:addDays(scheduled.end,RESTORATION_DAYS)}:w})}))},
 decide:(id,decision,reason)=>{const request=state.requests.find(r=>r.id===id);if(!request||request.decision)return;if(decision==='emergency'&&!reason?.trim())throw Error('Add an emergency reason before approving.');const workId=`approved-${id}`;update(s=>({...s,requests:s.requests.map(r=>r.id===id?{...r,decision,emergency:decision==='emergency'?{reason:reason!.trim()}:r.emergency}:r),works:decision==='change_requested'?s.works:[...s.works,{id:workId,title:request.title||request.purpose,type:request.type,agency:request.agency,contractor:'Demo utility contractor',purpose:request.purpose,segmentIds:request.segmentIds,start:request.start,end:request.end,status:request.start>DEMO_TODAY?'planned':request.end<DEMO_TODAY?'completed':'ongoing',actualEnd:request.end<DEMO_TODAY?request.end:undefined,projectId:request.projectId||request.id,flexDays:request.flexDays,delays:decision==='emergency'?[{date:DEMO_TODAY,code:'other',note:`Emergency override: ${reason!.trim()}`}]:[],emergency:decision==='emergency'?{reason:reason!.trim()}:undefined,restorationDue:addDays(request.end,RESTORATION_DAYS),followers:0}]}));return decision==='change_requested'?undefined:workId},
 updateRequest:(id,patch)=>{const current=state.requests.find(r=>r.id===id);if(!current||current.decision)return;assertWindow(patch.start??current.start,patch.end??current.end);update(s=>({...s,requests:s.requests.map(r=>r.id===id?{...r,...patch,id:r.id}:r)}))},
 addRequest:request=>update(s=>({...s,requests:[...s.requests,request]})),reset:()=>{setState({version:1,works:seeds.works,requests:seeds.requests,followed:[],role:'resident'});setSaveError('')}
 };
 return <Context.Provider value={store}>{children}</Context.Provider>
}
export function useStore(){const store=useContext(Context);if(!store)throw Error('Registry store unavailable');return store}
