import { mkdirSync, writeFileSync } from 'node:fs';
const BBOX = [12.975,80.250,12.992,80.268];
const CHUNK_METRES=160;
type Point=[number,number];
type Segment={id:string;name:string;wayId:number;coords:Point[];lengthM:number;neighbors:string[]};
const distance=(a:Point,b:Point)=>{const rad=Math.PI/180;const p=(b[0]-a[0])*rad,q=(b[1]-a[1])*rad;return 6371000*2*Math.asin(Math.sqrt(Math.sin(p/2)**2+Math.cos(a[0]*rad)*Math.cos(b[0]*rad)*Math.sin(q/2)**2))};
const segments:Segment[]=[];
function add(wayId:number,name:string,coords:Point[],index:number){if(coords.length<2)return;segments.push({id:`osm-${wayId}-${index}`,name,wayId,coords,lengthM:Math.round(coords.slice(1).reduce((sum,p,i)=>sum+distance(coords[i],p),0)),neighbors:[]})}
let source='OpenStreetMap via Overpass';
try {
 const query=`[out:json][timeout:60];way[highway~"^(residential|tertiary|secondary|primary|unclassified|living_street)$"](${BBOX.join(',')});out geom;`;
 let result:any;
 for(const endpoint of ['https://overpass.private.coffee/api/interpreter','https://maps.mail.ru/osm/tools/overpass/api/interpreter']) {
   try{const response=await fetch(endpoint,{method:'POST',headers:{'User-Agent':'awgurDemo/1.0 (https://github.com/GalacticLearner/awgur)'},body:new URLSearchParams({data:query}),signal:AbortSignal.timeout(90000)});if(!response.ok)throw Error(String(response.status));result=await response.json();break}catch(error){console.warn('Overpass attempt failed:',String(error))}
 }
 if(!result?.elements?.length) throw Error('No OSM ways available');
 // Split at all shared OSM vertices, so network adjacency is real even where a junction sits inside a way.
 const counts=new Map<string,number>();
 for(const way of result.elements)for(const p of way.geometry){const k=`${p.lat},${p.lon}`;counts.set(k,(counts.get(k)||0)+1)}
 for(const way of result.elements){let coords:Point[]=[];let length=0,index=0;for(const p of way.geometry){const point:Point=[p.lat,p.lon];if(coords.length)length+=distance(coords.at(-1)!,point);coords.push(point);if(coords.length>1&&(length>=CHUNK_METRES||(counts.get(`${p.lat},${p.lon}`)||0)>1)){add(way.id,way.tags?.['name:en']||way.tags?.name||'Unnamed lane',coords,index++);coords=[point];length=0}}add(way.id,way.tags?.['name:en']||way.tags?.name||'Unnamed lane',coords,index)}
 if(segments.length<10)throw Error('Insufficient road geometry');
} catch(error) {
 console.warn('Using documented synthetic geometry fallback:',String(error));source='Synthetic street grid stand-in';segments.length=0;
 for(let row=0;row<10;row++)for(let col=0;col<12;col++){const a:Point=[12.977+row*.0012,80.251+col*.0012];const b:Point=col%2?[a[0]+.0012,a[1]]:[a[0],a[1]+.0012];add(900000+row,`Demo ${row+1} Street`,[a,b],col)}
}
// Retain the central 400 segments for a bounded, phone-friendly demo network.
if(segments.length>400){segments.sort((a,b)=>distance(a.coords[0],[12.9825,80.2605])-distance(b.coords[0],[12.9825,80.2605])||a.id.localeCompare(b.id));segments.splice(400);segments.sort((a,b)=>a.id.localeCompare(b.id))}
const endpoints=new Map<string,string[]>();
for(const segment of segments)for(const p of [segment.coords[0],segment.coords.at(-1)!]){const k=p.join(',');endpoints.set(k,[...(endpoints.get(k)||[]),segment.id])}
for(const segment of segments)segment.neighbors=[...new Set([segment.coords[0],segment.coords.at(-1)!].flatMap(p=>endpoints.get(p.join(','))||[]))].filter(id=>id!==segment.id).sort();
mkdirSync('public/data',{recursive:true});
writeFileSync('public/data/segments.json',JSON.stringify(segments,null,2)+'\n');
writeFileSync('public/data/geometry.json',JSON.stringify({source,bbox:BBOX,attribution:source.startsWith('OpenStreetMap')?'Map data © OpenStreetMap contributors (ODbL)':'Synthetic geometry stand-in near Thiruvanmiyur',segmentCount:segments.length,chunkTargetM:CHUNK_METRES},null,2)+'\n');
console.log(`${segments.length} segments; ${source}`);


