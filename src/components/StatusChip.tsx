import { CircleCheck,Clock,Construction,Ban,TriangleAlert } from 'lucide-react';
import type { Status } from '../engine/types';
export function StatusChip({status}:{status:Status}){const Icon=status==='completed'?CircleCheck:status==='ongoing'?Construction:status==='cancelled'?Ban:Clock;const label=status==='completed'?'Completed':status==='ongoing'?'Ongoing':status==='cancelled'?'Cancelled':'Planned';return <span className={`status-chip ${status}`}><Icon size={14} aria-hidden="true"/>{label}</span>}
export function WarningChip({children}:{children:React.ReactNode}){return <span className="warning-chip"><TriangleAlert size={14} aria-hidden="true"/>{children}</span>}
