import { SystemBars,SystemBarsStyle } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { isNative } from './platform';
export async function firstPaint(){if(!isNative)return;await SystemBars.setStyle({style:SystemBarsStyle.Light});await SplashScreen.hide()}
