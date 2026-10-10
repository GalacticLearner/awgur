import { Share } from '@capacitor/share';
import { isNative } from './platform';
import { HOSTED_URL } from '../engine/params';
import type { Work } from '../engine/types';
export async function shareWork(work:Work):Promise<string>{const url=`${HOSTED_URL}#/project/${encodeURIComponent(work.id)}`;const text=`${work.title}. ${work.agency}; ${work.status}; ${work.delays.length} delay entries. Synthetic demo data.`;
 if(isNative){await Share.share({title:work.title,text,url});return 'Share sheet opened'}
 if(navigator.share){await navigator.share({title:work.title,text,url});return 'Shared'}
 if(navigator.clipboard){await navigator.clipboard.writeText(`${text}\n${url}`);return 'Project summary copied'}
 return 'Copy the project address from your browser to share it';
}
