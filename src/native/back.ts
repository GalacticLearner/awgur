import { App } from '@capacitor/app';
import { isNative } from './platform';
export async function listenBack(handler:()=>void) {if(!isNative)return {remove:async()=>{}};return App.addListener('backButton',handler)}
export async function exitApp(){if(isNative)await App.exitApp()}
