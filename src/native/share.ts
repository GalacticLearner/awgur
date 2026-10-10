import { Share } from '@capacitor/share';
import { isNative } from './platform';
import { HOSTED_URL } from '../engine/params';
import type { Work } from '../engine/types';
export async function shareWork(work:Work):Promise<string>{const seeded=/^(hero-|background-)/.test(work.id);const url=seeded?`${HOSTED_URL}#/project/${encodeURIComponent(work.id)}`:HOSTED_URL;const text=`${work.title}. ${work.agency}; ${work.status}; ${work.delays.length} delay entries. Synthetic demo data. Local edits stay on this device. ${seeded?'The link shows the seeded record.':'This work is device-local; the link opens the seeded registry.'}`;
 if(isNative){await Share.share({title:work.title,text,url});return 'Share sheet opened'}
 if(navigator.share){await navigator.share({title:work.title,text,url});return 'Shared'}
 if(navigator.clipboard){await navigator.clipboard.writeText(`${text}\n${url}`);return 'Project summary copied'}
 return 'Copy the project address from your browser to share it';
}
