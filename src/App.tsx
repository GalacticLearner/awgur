import { useState,useEffect,useRef,lazy,Suspense } from 'react';
import { HashRouter,Routes,Route,NavLink,Link,useLocation,useNavigate } from 'react-router-dom';
import { Map,ClipboardCheck,Info,Route as RouteIcon,WifiOff,X } from 'lucide-react';
import { StoreProvider,useStore } from './state/store';
import { UIContext } from './state/ui';
import { listenBack,exitApp } from './native/back';
import { firstPaint } from './native/systemBars';
import { watchNetwork } from './native/network';
import { ErrorBoundary } from './components/ErrorBoundary';
import StreetView from './screens/StreetView';
import '@fontsource/public-sans/latin-400.css';
import '@fontsource/public-sans/latin-600.css';
import '@fontsource/public-sans/latin-700.css';
import './styles/base.css';
const ProjectPage=lazy(()=>import('./screens/ProjectPage'));
const OfficerReview=lazy(()=>import('./screens/OfficerReview'));
const About=lazy(()=>import('./screens/About'));
function Shell(){const store=useStore(),location=useLocation(),navigate=useNavigate();const [sheetExpanded,setSheetExpanded]=useState(false),[online,setOnline]=useState(navigator.onLine),[dialog,setDialog]=useState<'reset'|null>(null);const backRef=useRef(()=>{});
 backRef.current=()=>{if(location.pathname==='/'&&sheetExpanded){setSheetExpanded(false);return}if(dialog){setDialog(null);return}if((window.history.state?.idx||0)>0){navigate(-1);return}if(location.pathname!=='/'){navigate('/',{replace:true});return}void exitApp()};
 useEffect(()=>{let cleanup:(()=>void)|undefined,disposed=false;void watchNetwork(setOnline).then(fn=>{if(disposed)fn();else cleanup=fn}).catch(()=>setOnline(navigator.onLine));return()=>{disposed=true;cleanup?.()}},[]);
 useEffect(()=>{let disposed=false;const listener=listenBack(()=>backRef.current());void listener.then(handle=>{if(disposed)void handle.remove()});return()=>{disposed=true;void listener.then(handle=>handle.remove())}},[]);
 useEffect(()=>{const handle=requestAnimationFrame(()=>{void firstPaint().catch(()=>{})});return()=>cancelAnimationFrame(handle)},[]);
 useEffect(()=>{setDialog(null);if(location.pathname!=='/')setSheetExpanded(false);document.querySelector('main')?.scrollTo(0,0)},[location.pathname]);
 useEffect(()=>{const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){setDialog(null);setSheetExpanded(false)}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[]);
 return <UIContext.Provider value={{sheetExpanded,setSheetExpanded,online,dialog,setDialog}}><div className={`app-shell ${location.pathname==='/'?'map-shell':''}`}><header className="app-header"><Link className="brand" to="/"><span className="brand-mark"><RouteIcon size={23} aria-hidden="true"/></span><span><strong>Works Registry</strong><span className="brand-place">Thiruvanmiyur · Chennai</span></span></Link><label className="role-switch"><span className="sr-only">Demo account</span><select aria-label="Demo account" value={store.role} onChange={event=>store.setRole(event.target.value as 'resident'|'officer')}><option value="resident">Asha · Resident</option><option value="officer">Ravi · Officer</option></select></label></header><div className="disclosure-bar"><span className="demo-label">Synthetic demo data</span><span>Public record · local demo</span></div>
 {!online&&<div className="offline-banner" role="status"><WifiOff size={16} aria-hidden="true"/>Offline. Map background unavailable. Works and findings are still available.</div>}{store.saveError&&<p className="error-message" role="alert">{store.saveError}</p>}
 <div className="route-content">{store.loading?<main className="page loading-state" aria-busy="true"><h1>Opening the street registry</h1><p>Loading bundled works and geometry…</p></main>:store.error?<main className="page"><h1>Data unavailable</h1><p role="alert">{store.error}</p><button className="primary" onClick={store.reload}>Reload registry</button></main>:<Suspense fallback={<main className="page loading-state" aria-busy="true"><p>Opening screen…</p></main>}><Routes><Route path="/" element={<StreetView/>}/><Route path="/project/:id" element={<ProjectPage/>}/><Route path="/review" element={<OfficerReview/>}/><Route path="/review/:id" element={<OfficerReview/>}/><Route path="/about" element={<About/>}/><Route path="*" element={<main className="page"><h1>Page not found</h1><Link className="primary" to="/">Open street registry</Link></main>}/></Routes></Suspense>}</div>
 <nav className="bottom-nav" aria-label="Main navigation"><NavLink to="/" end><Map size={21} aria-hidden="true"/><span>Street</span></NavLink><NavLink to="/review"><ClipboardCheck size={21} aria-hidden="true"/><span>Review</span></NavLink><NavLink to="/about"><Info size={21} aria-hidden="true"/><span>About</span></NavLink><span className="nav-demo-date">Demo date · 10 Oct 2026</span></nav>
 {dialog==='reset'&&<div className="dialog-backdrop"><section role="dialog" aria-modal="true" aria-labelledby="reset-title" className="dialog"><button className="dialog-close icon-button" aria-label="Close reset confirmation" onClick={()=>setDialog(null)}><X size={20}/></button><h2 id="reset-title">Reset local demo?</h2><p>This removes this device’s follows, new permits, delay entries and decisions. Seeded records will be restored.</p><div className="dialog-actions"><button className="secondary" autoFocus onClick={()=>setDialog(null)}>Keep changes</button><button className="warning-button" onClick={()=>{store.reset();setDialog(null);navigate('/')}}>Reset demo</button></div></section></div>}
 </div></UIContext.Provider>
}
export default function App(){return <ErrorBoundary><HashRouter><StoreProvider><Shell/></StoreProvider></HashRouter></ErrorBoundary>}
