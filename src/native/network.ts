import { Network } from '@capacitor/network';
import { isNative } from './platform';
export async function watchNetwork(onChange:(connected:boolean)=>void):Promise<()=>void>{
 if(isNative){const status=await Network.getStatus();onChange(status.connected);const listener=await Network.addListener('networkStatusChange',s=>onChange(s.connected));return()=>{void listener.remove()}}
 const update=()=>onChange(navigator.onLine);update();window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update)};
}
