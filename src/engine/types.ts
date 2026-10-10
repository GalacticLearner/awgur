export type WorkType = 'cut'|'pipeline'|'cable'|'drain'|'relay'|'resurface'|'inspection';
export type Status = 'planned'|'ongoing'|'completed'|'cancelled';
export type Rule = 'R1'|'R2'|'R3';
export interface Segment { id:string;name:string;wayId:number;coords:[number,number][];lengthM:number;neighbors:string[] }
export interface DelayEntry { date:string;code:'contractor'|'weather'|'utility_clash'|'material'|'permit_wait'|'funds'|'scope_change'|'other';note?:string }
export interface Work { id:string;title:string;type:WorkType;agency:string;contractor?:string;purpose:string;segmentIds:string[];start:string;end:string;actualEnd?:string;status:Status;flexDays?:number;projectId?:string;emergency?:{reason:string};delays:DelayEntry[];restorationDue?:string;restoredOn?:string;followers?:number;hero?:boolean }
export interface PermitRequest { id:string;agency:string;type:WorkType;purpose:string;segmentIds:string[];start:string;end:string;flexDays?:number;projectId?:string;emergency?:{reason:string};channel:'municipal'|'telecom_row';receivedOn?:string;decisionDeadline?:string;decision?:'approved'|'change_requested'|'emergency';title?:string }
export interface Finding { rule:Rule;severity:'warn'|'info';segmentId:string;message:string;relatedWorkIds:string[];detail:Record<string,unknown> }
export interface Suggestion { id:string;kind:'joint_window'|'sequence';segmentId:string;requestId:string;relatedWorkIds:string[];start:string;end:string;workWindows:{workId:string;start:string;end:string}[];message:string;targets:Rule[] }
export interface GroundTruth { id:string;category:string;expectedRules:Rule[];request:PermitRequest;existingWorkIds:string[];why:string }
export interface Metrics { tp:number;fp:number;fn:number;tn:number;precision:number;recall:number;errors:{id:string;kind:'FP'|'FN';why:string}[] }
export interface ValidationReport { cases:number;scope:string;rules:Record<Rule,Metrics>;baselines:Record<string,Metrics>;r3:{suggestions:number;valid:number;passRate:number;invalid:{id:string;reasons:string[]}[]};counts:Record<string,number> }
