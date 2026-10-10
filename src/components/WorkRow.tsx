import { Link } from 'react-router-dom';
import { ArrowUpRight,CalendarDays } from 'lucide-react';
import { StatusChip,WarningChip } from './StatusChip';
import { DEMO_TODAY,daysBetween } from '../engine';
import type { Work } from '../engine/types';
export const formatDate=(date:string)=>new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z'));
export function WorkRow({work,streetId,clash}:{work:Work;streetId?:string;clash?:boolean}){const end=work.actualEnd??(work.status==='ongoing'&&work.end<DEMO_TODAY?DEMO_TODAY:work.end);const delay=Math.max(0,daysBetween(work.end,end));return <Link className="work-row" to={`/project/${work.id}${streetId?'?street='+streetId:''}`}><div className="row-top"><StatusChip status={work.status}/><ArrowUpRight size={18} aria-hidden="true"/></div><h3>{work.title}</h3><p className="agency">{work.agency}</p><p className="date-line"><CalendarDays size={14} aria-hidden="true"/>{formatDate(work.start)} — {formatDate(work.end)}</p>{delay>0||clash?<div className="row-flags">{delay>0&&<WarningChip>{delay} days over planned end</WarningChip>}{clash&&<WarningChip>Clash flagged</WarningChip>}</div>:null}</Link>}
