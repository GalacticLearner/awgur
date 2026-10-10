import { createContext,useContext } from 'react';
export interface UIState { sheetExpanded:boolean;setSheetExpanded:(value:boolean)=>void;online:boolean;dialog:'reset'|null;setDialog:(value:'reset'|null)=>void }
export const UIContext=createContext<UIState>({sheetExpanded:false,setSheetExpanded:()=>{},online:true,dialog:null,setDialog:()=>{}});
export const useUI=()=>useContext(UIContext);
