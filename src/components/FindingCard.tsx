import { Link } from 'react-router-dom';
import { TriangleAlert,ArrowUpRight } from 'lucide-react';
import { useStore } from '../state/store';
import type { Finding } from '../engine/types';
export function FindingCard({finding}:{finding:Finding}) {
 const {works,segments}=useStore();const segment=segments.find(s=>s.id===finding.segmentId);const streetSegments=segment?segments.filter(s=>s.name===segment.name):[];
 return <article className="finding"><div className="finding-label"><TriangleAlert size={18} aria-hidden="true"/><strong>{finding.rule} · {finding.rule==='R1'?'Recent road relay':'Repeat disturbance'}</strong></div>
 {segment&&<p className="finding-location">{segment.name} · requested segment {streetSegments.findIndex(s=>s.id===segment.id)+1} of {streetSegments.length} · {segment.lengthM} m{finding.detail.adjacent?' · includes an endpoint-connected segment':''}</p>}
 <p>{finding.message}</p><div className="finding-links">{finding.relatedWorkIds.map(id=><Link key={id} to={`/project/${id}`}><span>{works.find(work=>work.id===id)?.title||'View related work'}</span><ArrowUpRight size={14} aria-hidden="true"/></Link>)}</div></article>
}
