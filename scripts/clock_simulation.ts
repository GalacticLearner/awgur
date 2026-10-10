import {conformalUpper} from '../src/engine/slip';
export function coverageSimulation(trials=20000){
 let seed=601102026;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return(seed+.5)/4294967296};
 const normal=()=>Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random());
 const distributions=[{name:'lognormal',continuous:true,draw:()=>Math.exp(normal())},{name:'integer ties',continuous:false,draw:()=>Math.floor(random()*8)},{name:'mixture',continuous:true,draw:()=>random()<.8?random()*8:15+random()*30}];
 const results=[];
 for(const distribution of distributions)for(const n of [9,19,49])for(const overdue of [false,true]){
  const draw=()=>{let score;do{score=distribution.draw()}while(overdue&&score<=2);return score};
  let covered=0;
  for(let trial=0;trial<trials;trial++){const scores=Array.from({length:n},draw),test=draw(),bound=conformalUpper(scores,.1)!;if(test<=bound)covered++}
  results.push({distribution:distribution.name,continuous:distribution.continuous,n,overdue,trials,coverage:covered/trials});
 }
 return results;
}
