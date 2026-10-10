import { Fragment,memo,useEffect,useMemo,useState } from 'react';
import { MapContainer,Polyline,TileLayer,Marker,Tooltip,useMap } from 'react-leaflet';
import L from 'leaflet';
import { Plus,Minus,LocateFixed,Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { useStore } from '../state/store';
import { useUI } from '../state/ui';
import { DEMO_TODAY,RECENT_MONTHS,addMonths,TILE_URL,TILE_ATTRIBUTION } from '../engine';
import type { Segment,Work } from '../engine/types';
const colours={planned:'#94651b',ongoing:'#b54432',completed:'#27796a',idle:'#94aaa3'};
const flagIcon=L.divIcon({className:'map-flag',html:'<span class="map-flag-body"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 21V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/></svg></span>',iconSize:[48,48],iconAnchor:[24,40]});
function colour(segment:Segment,works:Work[]){const active=works.filter(w=>w.segmentIds.includes(segment.id)&&w.status!=='cancelled');if(active.some(w=>w.status==='ongoing'))return colours.ongoing;if(active.some(w=>w.status==='planned'))return colours.planned;if(active.some(w=>w.status==='completed'&&(w.actualEnd??w.end)>=addMonths(DEMO_TODAY,-RECENT_MONTHS)))return colours.completed;return colours.idle}
const SegmentLayer=memo(function SegmentLayer({segments,works,selected,onSelect}:{segments:Segment[];works:Work[];selected:string[];onSelect:(id:string)=>void}){return <>{segments.map(segment=><Fragment key={segment.id}><Polyline positions={segment.coords} pathOptions={{color:colour(segment,works),weight:selected.includes(segment.id)?7:3.5,opacity:.95}}/><Polyline positions={segment.coords} pathOptions={{color:'#193b36',weight:24,opacity:0}} eventHandlers={{click:()=>onSelect(segment.id)}}><Tooltip sticky>{segment.name}</Tooltip></Polyline></Fragment>)}</>});
function Focus({segments,selected,compact}:{segments:Segment[];selected:string[];compact:boolean}){const map=useMap();useEffect(()=>{const points=segments.filter(s=>selected.includes(s.id)).flatMap(s=>s.coords);if(points.length)map.fitBounds(L.latLngBounds(points),{padding:[Math.min(compact?30:54,map.getSize().x*.1),Math.min(compact?30:48,map.getSize().y*.12)],maxZoom:compact?17:17,animate:false})},[map,segments,selected,compact]);useEffect(()=>{const observer=new ResizeObserver(()=>map.invalidateSize());observer.observe(map.getContainer());return()=>observer.disconnect()},[map]);return null}
function Controls({onReset}:{onReset:()=>void}){const map=useMap();return <div className="map-controls"><button aria-label="Zoom in" onClick={()=>map.zoomIn()}><Plus size={20}/></button><button aria-label="Zoom out" onClick={()=>map.zoomOut()}><Minus size={20}/></button><button aria-label="Show demo area" onClick={()=>{map.fitBounds([[12.9795,80.2575],[12.9855,80.2635]]);onReset()}}><LocateFixed size={20}/></button></div>}
export function RegistryMap({selectedIds,onSelect,flagged=[],compact=false}:{selectedIds:string[];onSelect:(id:string)=>void;flagged?:string[];compact?:boolean}){
 const {segments,works,geometry}=useStore(),{online}=useUI();const [tiles,setTiles]=useState(true),[failed,setFailed]=useState(false);
 const selected=useMemo(()=>selectedIds,[selectedIds.join('|')]);
 useEffect(()=>{if(!online)setTiles(false)},[online]);
 return <div className={`registry-map ${compact?'compact-map':''}`} aria-label="Public works street map"><MapContainer center={[12.9825,80.2605]} zoom={16} zoomControl={false} preferCanvas={true} attributionControl={true}>
 {tiles&&online&&!failed&&<TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} referrerPolicy="strict-origin-when-cross-origin" eventHandlers={{tileerror:()=>{setFailed(true);setTiles(false)}}}/>}
 <SegmentLayer segments={segments} works={works} selected={selected} onSelect={onSelect}/><Focus segments={segments} selected={selected} compact={compact}/><Controls onReset={()=>{}}/>
 {segments.filter(s=>flagged.includes(s.id)).map(s=><Marker key={s.id} position={s.coords[Math.floor(s.coords.length/2)]} icon={flagIcon} title={`View street with clash · ${s.name}`} alt={`View street with clash · ${s.name}`} eventHandlers={{click:()=>onSelect(s.id)}}><Tooltip>Clash flagged · {s.name}</Tooltip></Marker>)}
 </MapContainer><div className="map-topline"><span className="map-caption">THIRUVANMIYUR</span><button className="map-layer" disabled={!online} aria-pressed={tiles&&!failed&&online} onClick={()=>{setFailed(false);setTiles(value=>!value)}}><Layers size={16} aria-hidden="true"/>{tiles&&!failed&&online?'Hide basemap':'Show basemap'}</button></div>
 {!tiles||failed||!online?<div className="map-note">{failed||!online?'Basemap unavailable. ':''}Bundled street geometry</div>:null}
 <div className="map-attribution">{geometry.source.startsWith('OpenStreetMap')?<>Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> (ODbL)</>:<>Synthetic street geometry stand-in</>}</div>
 </div>
}
