import type {Work,ClockRiskReport} from './types';
import {forecastEnd,slipDays} from './slip';
import {addMonths,daysBetween} from './dates';
import {DEMO_TODAY,MORATORIUM_MONTHS,SLIP_ALPHA} from './params';
export function validateClockRisk(works:Work[]):ClockRiskReport{
 const completed=works.filter(work=>slipDays(work)!==null);
 const coverage:ClockRiskReport['coverage']={evaluated:0,covered:0,rate:0,insufficientIds:[],byAgency:{}};
 const hindsight:ClockRiskReport['hindsight']={evaluated:0,plannedFalseSafe:0,boundFalseSafe:0,plannedRate:0,boundRate:0,meanExtraDays:0,medianExtraDays:0,insufficientIds:[]};
 const waits:number[]=[];
 for(const work of completed){
  // A held-out completed work is presented as unstarted; its actual date never
  // enters its own calibration set. This is a diagnostic replay, not new labels.
  const forecast=forecastEnd({...work,status:'planned'},completed,DEMO_TODAY);
  const agency=coverage.byAgency[work.agency]??={evaluated:0,covered:0,rate:0,insufficient:0};
  if(forecast.status!=='ok'){coverage.insufficientIds.push(work.id);agency.insufficient++;if(['relay','resurface'].includes(work.type))hindsight.insufficientIds.push(work.id);continue}
  const covered=slipDays(work)!<=forecast.boundDays!;
  coverage.evaluated++;coverage.covered+=Number(covered);agency.evaluated++;agency.covered+=Number(covered);
  if(['relay','resurface'].includes(work.type)){
   const planned=addMonths(work.end,MORATORIUM_MONTHS),actual=addMonths(work.actualEnd!,MORATORIUM_MONTHS),bound=addMonths(forecast.upperEnd!,MORATORIUM_MONTHS);
   hindsight.evaluated++;hindsight.plannedFalseSafe+=Number(planned<actual);hindsight.boundFalseSafe+=Number(bound<actual);waits.push(daysBetween(planned,bound));
  }
 }
 coverage.rate=coverage.evaluated?coverage.covered/coverage.evaluated:0;
 for(const agency of Object.values(coverage.byAgency))agency.rate=agency.evaluated?agency.covered/agency.evaluated:0;
 hindsight.plannedRate=hindsight.evaluated?hindsight.plannedFalseSafe/hindsight.evaluated:0;hindsight.boundRate=hindsight.evaluated?hindsight.boundFalseSafe/hindsight.evaluated:0;
 waits.sort((a,b)=>a-b);hindsight.meanExtraDays=waits.length?waits.reduce((a,b)=>a+b,0)/waits.length:0;hindsight.medianExtraDays=waits.length?(waits[Math.floor((waits.length-1)/2)]+waits[Math.floor(waits.length/2)])/2:0;
 return {scope:'Synthetic seeded ledger, including existing completed demo records. Generated delay distributions are assumptions. Leave-one-out replay checks the mechanism; it does not estimate Chennai delays, real permit error rates or a per-work probability.',alpha:SLIP_ALPHA,coverage,hindsight};
}
