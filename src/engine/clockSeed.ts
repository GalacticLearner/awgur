import type {Work,PermitRequest} from './types';
// Seed switching is pure and reversible. Local edits to existing permits are retained.
export function clockSeed(works:Work[],requests:PermitRequest[],basePermit2:PermitRequest|undefined,enabled:boolean){
 if(enabled)return {works,requests};
 return {works:works.filter(work=>!work.id.startsWith('ledger-')&&!work.id.startsWith('clock-risk-')),requests:requests.map(request=>request.id==='permit-2'&&request.title==='Post-relay service connection'&&!request.decision&&basePermit2?basePermit2:request)};
}
