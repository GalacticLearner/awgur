import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import type { Finding } from '../engine/types';
export function FindingCard({finding}:{finding:Finding}) {return <article className="finding"><div className="finding-label"><TriangleAlert size={18} aria-hidden="true"/><strong>{finding.rule} · {finding.rule==='R1'?'Recent road relay':'Repeat disturbance'}</strong></div><p>{finding.message}</p><div className="finding-links">{finding.relatedWorkIds.map(id=><Link key={id} to={`/project/${id}`}>View related work</Link>)}</div></article>}
