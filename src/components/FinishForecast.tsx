import type {Work} from '../engine/types';
import {forecastEnd,DEMO_TODAY,ENABLE_CLOCK_RISK} from '../engine';
import {formatDate} from './WorkRow';
export function FinishForecast({work,ledger}:{work:Work;ledger:Work[]}){
 if(!ENABLE_CLOCK_RISK)return null;
 const forecast=forecastEnd(work,ledger,DEMO_TODAY);
 if(forecast.status==='not_applicable')return null;
 return <section className="finish-forecast" aria-label="Clock Risk finish forecast"><h3>Clock Risk · finish forecast</h3>{forecast.status==='ok'?<><p>{forecast.overdueDays!==undefined?<>Overdue by <strong>{forecast.overdueDays} days</strong>. </>:<>Planned end: {formatDate(forecast.baselineEnd)}. </>}Latest likely finish: <strong>{formatDate(forecast.upperEnd!)}</strong> ({Math.round((1-forecast.alpha)*100)}% upper bound).</p><p>Based on {forecast.n} comparable completed works in this demo ledger{forecast.overdueDays!==undefined?' that also ran past this point':''}. This is a forecast, not a promise.</p></>:<p>No finish forecast: <strong>{forecast.n} comparable completed works</strong> {forecast.overdueDays!==undefined?`that also ran more than ${forecast.overdueDays} days late`: 'in this demo ledger'}; at least {forecast.needed} are needed.</p>}<p className="small-note">Reference class: {forecast.classKey} · {forecast.nClass} records before overdue filtering. Synthetic history. The coverage condition is that future slips are exchangeable with this reference class; it is marginal coverage, not a probability guarantee for this work.</p></section>;
}
