import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'app.worksregistry.demo', appName: 'Works Registry', webDir: 'dist',
  server: { androidScheme: 'https' },
  plugins: { SplashScreen: { backgroundColor: '#f6f4eb', launchAutoHide: true, launchShowDuration: 1000 }, SystemBars: { insetsHandling: 'css', style: 'LIGHT' } },
};
export default config;
