import { useEffect,useMemo,useState,useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search,X,TriangleAlert,Construction,Clock,CircleCheck } from 'lucide-react';
import { RegistryMap } from '../components/Map';
import { BottomSheet } from '../components/BottomSheet';
import { WorkRow } from '../components/WorkRow';
import { useStore } from '../state/store';
import { useUI } from '../state/ui';
import { DEMO_TODAY,RECENT_MONTHS,addMonths,checkPermit } from '../engine';
import type { PermitRequest,Work } from '../engine/types';
export default function StreetView(){const {segments,works,demo}=useStore(),{setSheetExpanded}=useUI();const [params,setParams]=useSearchParams();const id=params.get('street')||demo.heroStreetId;const current=segments.find(s=>s.id===id)||segments.find(s=>s.id===demo.heroStreetId)!;
 useEffect(()=>{if(!params.get('street'))setParams({street:demo.heroStreetId},{replace:true})},[params,setParams,demo.heroStreetId]);
 const [query,setQuery]=useState(''),[searchOpen,setSearchOpen]=useState(false);
 const streets=useMemo(()=>[...new Map(segments.map(s=>[s.name,{id:s.id,name:s.name}])).values()].sort((a,b)=>a.name.localeCompare(b.name)),[segments]);
 const matching=streets.filter(s=>s.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).slice(0,9);
 const selected=useMemo(()=>segments.filter(s=>s.name===current.name).map(s=>s.id),[segments,current.name]);
 const visible=works.filter(w=>w.status!=='cancelled'&&w.segmentIds.some(segmentId=>selected.includes(segmentId))&&(w.status!=='completed'||(w.actualEnd??w.end)>=addMonths(DEMO_TODAY,-RECENT_MONTHS)));
 const findings=useMemo(()=>works.filter(w=>w.status!=='cancelled').flatMap(w=>checkPermit({...w,channel:'municipal'} as PermitRequest,works.filter(other=>other.id!==w.id),segments).map(f=>({...f,workId:w.id}))),[works,segments]);
 const flagged=useMemo(()=>[...new Set(findings.map(f=>f.segmentId))],[findings]);const clashIds=new Set(findings.map(f=>f.workId));
 const select=useCallback((streetId:string)=>{setParams({street:streetId});setSearchOpen(false);setQuery('');setSheetExpanded(false)},[setParams,setSheetExpanded]);
 const group=(label:string,status:Work['status'])=>{const list=visible.filter(w=>w.status===status).sort((a,b)=>Number(!!b.hero)-Number(!!a.hero)||a.start.localeCompare(b.start));return list.length?<section className="work-group"><h2>{label}<span>{list.length}</span></h2>{list.map(work=><WorkRow key={work.id} work={work} streetId={current.id} clash={clashIds.has(work.id)}/>)}</section>:null};
 return <main className="street-screen"><div className="street-toolbar"><div className="search-wrap"><Search size={19} aria-hidden="true"/><input aria-label="Search streets" placeholder="Find your street" value={query} onChange={event=>{setQuery(event.target.value);setSearchOpen(true)}} onFocus={()=>setSearchOpen(true)} onKeyDown={event=>{if(event.key==='Escape')setSearchOpen(false);if(event.key==='Enter'&&matching[0])select(matching[0].id)}}/>{searchOpen&&<button className="icon-button" aria-label="Close street search" onClick={()=>setSearchOpen(false)}><X size={19}/></button>}
 {searchOpen&&<div className="search-results" aria-label="Street suggestions">{matching.length?matching.map(s=><button key={s.name} onClick={()=>select(s.id)}><span>{s.name}</span><span className="muted">Select street</span></button>):<p>No matching street in this demo area.</p>}</div>}</div><div className="toolbar-note">Works on your street, from permit to restoration.</div></div>
 <div className="street-workspace"><div className="street-map-wrap"><RegistryMap selectedIds={selected} onSelect={select} flagged={flagged}/><div className="map-legend"><span><Construction size={14}/>Ongoing</span><span><Clock size={14}/>Planned</span><span><CircleCheck size={14}/>Recent</span><span><TriangleAlert size={14}/>Clash</span></div></div>
 <BottomSheet title={current.name} subtitle={`${visible.length} recorded works · demo date 10 Oct 2026`}>
 {visible.length?<>{group('Ongoing','ongoing')}{group('Planned','planned')}{group('Recent · last 12 months','completed')}<p className="panel-footnote">These are synthetic works on real street geometry. Street-wide lists include every segment with this street name.</p></>:<div className="empty-state"><h2>No works recorded</h2><p>No works recorded for this street in the demo data.</p><button onClick={()=>select(demo.heroStreetId)}>View South Mada Street demo</button></div>}
 </BottomSheet></div></main>
}
