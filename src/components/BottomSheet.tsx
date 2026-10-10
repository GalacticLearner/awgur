import { useEffect,useRef } from 'react';
import type { ReactNode } from 'react';
import { ChevronUp,ChevronDown } from 'lucide-react';
import L from 'leaflet';
import { useUI } from '../state/ui';
export function BottomSheet({title,subtitle,children}:{title:string;subtitle:string;children:ReactNode}){const {sheetExpanded,setSheetExpanded}=useUI();const ref=useRef<HTMLElement>(null);useEffect(()=>{if(ref.current){L.DomEvent.disableClickPropagation(ref.current);L.DomEvent.disableScrollPropagation(ref.current)}},[]);return <section ref={ref} className={`street-panel ${sheetExpanded?'expanded':''}`} aria-label="Selected street works"><button className="sheet-heading" aria-expanded={sheetExpanded} onClick={()=>setSheetExpanded(!sheetExpanded)}><span className="sheet-grip"/><span><h1>{title}</h1><span className="muted">{subtitle}</span></span>{sheetExpanded?<ChevronDown size={20}/>:<ChevronUp size={20}/>}</button><div className="sheet-scroller">{children}</div></section>}
