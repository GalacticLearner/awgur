import { createContext,useContext,useEffect,useState } from 'react';
import type { ReactNode } from 'react';
import type { Work,PermitRequest,Segment,ValidationReport,DelayEntry,Suggestion } from '../engine/types';
import { DEMO_TODAY,RESTORATION_DAYS,addDays,validateSuggestion,assertWindow } from '../engine';
type Role='resident'|'officer';
interface Stored { version:1;works:Work[];requests:PermitRequest[];followed:string[];role:Role }
interface Data { segments:Segment[];validation:ValidationReport;demo:{heroStreetId:string;heroStreetName:string;heroProjectIds:string[]};geometry:{source:string;attribution:string;segmentCount:number} }
interface Store extends Data,Stored { loading:boolean;error:string;saveError:string;reload:()=>void;setRole:(role:Role)=>void;follow:(id:string)=>void;addDelay:(id:string,entry:DelayEntry)=>void;applySuggestion:(id:string,suggestion:Suggestion)=>void;decide:(id:string,decision:'approved'|'change_requested'|'emergency',reason?:string)=>string|undefined;addRequest:(request:PermitRequest)=>void;updateRequest:(id:string,patch:Partial<PermitRequest>)=>void;reset:()=>void }
const KEY='works-registry-v1';
const Context=createContext<Store|null>(null);
const blankData:Data={segments:[],validation:{cases:0,scope:'',rules:{} as ValidationReport['rules'],baselines:{},r3:{suggestions:0,valid:0,passRate:0,invalid:[]},counts:{}},demo:{heroStreetId:'',heroStreetName:'',heroProjectIds:[]},geometry:{source:'',attribution:'',segmentCount:0}};
function readStored():Stored|undefined {try{const value=JSON.parse(localStorage.getItem(KEY)||'null');if(value?.version===1&&Array.isArray(value.works)&&Array.isArray(value.requests)&&Array.isArray(value.followed)&&['resident','officer'].includes(value.role))return value}catch{/* Corrupt state recovers from seeds. */}}
export function StoreProvider({children}:{children:ReactNode}) {
 const [state,setState]=useState<Stored>({version:1,works:[],requests:[],followed:[],role:'resident'});
 const [data,setData]=useState<Data>(blankData),[seeds,setSeeds]=useState<{works:Work[];requests:PermitRequest[]}>({works:[],requests:[]});
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[saveError,setSaveError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let cancelled=false;setLoading(true);setError('');const load=async()=>{try{
  const names=['segments','works','requests','validation','demo','geometry'];
  const [segments,works,requests,validation,demo,geometry]=await Promise.all(names.map(async name=>{const response=await fetch(`./data/${name}.json`);if(!response.ok)throw Error(`Missing ${name} data`);return response.json()}));
  if(!Array.isArray(segments)||!segments.length||!Array.isArray(works)||!Array.isArray(requests)||!validation.rules||!demo.heroStreetId)throw Error('Demo data could not be read');
  if(cancelled)return;setData({segments,validation,demo,geometry});setSeeds({works,requests});setState(readStored()||{version:1,works,requests,followed:[],role:'resident'});setLoading(false);
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
