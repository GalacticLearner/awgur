import { readFileSync,writeFileSync } from 'node:fs';
import { checkPermit,suggestBundling,validateSuggestion,intervalGap } from '../src/engine/index';
import type { Segment,Work,GroundTruth,Rule,Metrics,ValidationReport } from '../src/engine/types';
import {validateClockRisk} from '../src/engine/clockValidation';
import {ENABLE_CLOCK_RISK} from '../src/engine/params';
const read=<T,>(name:string):T=>JSON.parse(readFileSync(`public/data/${name}.json`,'utf8'));
const segments=read<Segment[]>('segments'),fixtures=read<Work[]>('fixtures'),cases=read<GroundTruth[]>('ground_truth');
const metrics=():Metrics=>({tp:0,fp:0,fn:0,tn:0,precision:0,recall:0,errors:[]});
const rules={R1:metrics(),R2:metrics(),R3:metrics()},baselines={B0:metrics(),B1:metrics()};
function observe(metric:Metrics,expected:boolean,predicted:boolean,item:GroundTruth){if(expected&&predicted)metric.tp++;else if(!expected&&predicted){metric.fp++;metric.errors.push({id:item.id,kind:'FP',why:item.why})}else if(expected&&!predicted){metric.fn++;metric.errors.push({id:item.id,kind:'FN',why:item.why})}else metric.tn++}
let suggestions=0,valid=0;const invalid:{id:string;reasons:string[]}[]=[];
for(const item of cases){
 const works=fixtures.filter(w=>item.existingWorkIds.includes(w.id)),request=item.request;
 const findings=checkPermit(request,works,segments),bundles=suggestBundling(request,works,segments);
 for(const rule of ['R1','R2','R3'] as const)observe(rules[rule],item.expectedRules.includes(rule),rule==='R3'?bundles.length>0:findings.some(f=>f.rule===rule),item);
 const expected=item.expectedRules.some(rule=>rule==='R1'||rule==='R2');
 const requestNames=new Set(request.segmentIds.map(id=>segments.find(s=>s.id===id)?.name));
 observe(baselines.B0,expected,works.some(w=>w.status!=='cancelled'&&intervalGap(request.start,request.end,w.start,w.actualEnd??w.end)===0&&w.segmentIds.some(id=>requestNames.has(segments.find(s=>s.id===id)?.name))),item);
 observe(baselines.B1,expected,works.some(w=>w.status!=='cancelled'&&intervalGap(request.start,request.end,w.start,w.actualEnd??w.end)===0),item);
 for(const suggestion of bundles){suggestions++;const result=validateSuggestion(suggestion,request,works);if(result.ok)valid++;else invalid.push({id:suggestion.id,reasons:result.reasons})}
}
for(const metric of [...Object.values(rules),...Object.values(baselines)]){metric.precision=metric.tp+metric.fp?metric.tp/(metric.tp+metric.fp):0;metric.recall=metric.tp+metric.fn?metric.tp/(metric.tp+metric.fn):0}
const counts=Object.fromEntries([...new Set(cases.map(c=>c.category))].map(name=>[name,cases.filter(c=>c.category===name).length]));
const report:ValidationReport={cases:cases.length,scope:'Independently constructed synthetic cases; each case runs against its explicitly named fixture works, not random background records. This tests implementation correctness, not real Chennai clash rates.',rules,baselines,r3:{suggestions,valid,passRate:suggestions?valid/suggestions:0,invalid},counts};
if(ENABLE_CLOCK_RISK)report.clockRisk=validateClockRisk(read<Work[]>('works'));
writeFileSync('public/data/validation.json',JSON.stringify(report,null,2)+'\n');
const rows=Object.entries({...rules,...baselines}).map(([name,m])=>`| ${name} | ${m.tp} | ${m.fp} | ${m.fn} | ${(m.precision*100).toFixed(1)}% | ${(m.recall*100).toFixed(1)}% |`).join('\n');
const errors=Object.entries({...rules,...baselines}).flatMap(([name,m])=>m.errors.map(e=>`- ${name} ${e.kind}: ${e.id} — ${e.why}`));
writeFileSync('docs/validation.md',`# Validation\n\n${report.scope}\n\n${cases.length} cases. Ground truth generated and committed before the rule code. No labels are derived from predictions.\n\n| Rule / baseline | TP | FP | FN | Precision | Recall |\n|---|---:|---:|---:|---:|---:|\n${rows}\n\nR3 valid suggestions: ${valid}/${suggestions} (${(report.r3.passRate*100).toFixed(1)}%).\n\n## Every false positive and false negative\n\n${errors.length?errors.join('\n'):'None in these constructed cases.'}\n\n## Limits\n\nThese isolated fixtures are intentionally synthetic, balanced and constructed; perfect performance is not evidence of usefulness on real permits. Adjacent segments share exact OSM endpoints. Opposite carriageways are distinct segment ids. No coordinate snapping or parsing is implemented, so their robustness/accuracy tests are omitted. B0 is exact street-name plus overlapping dates; B1 ignores space and checks date overlap only. Both baselines use effective actual completion dates.\n`);
console.table(Object.fromEntries(Object.entries({...rules,...baselines}).map(([name,m])=>[name,{TP:m.tp,FP:m.fp,FN:m.fn,precision:m.precision,recall:m.recall}])));
console.log(`R3 valid: ${valid}/${suggestions}`);
if(report.clockRisk){const {coverage,hindsight,scope}=report.clockRisk;const agencyRows=Object.entries(coverage.byAgency).map(([name,result])=>`| ${name} | ${result.covered}/${result.evaluated} | ${(result.rate*100).toFixed(1)}% | ${result.insufficient} |`).join('\n');writeFileSync('docs/validation.md',readFileSync('docs/validation.md','utf8')+`\n## Clock Risk\n\n${scope}\n\nLeave-one-out upper-bound coverage: ${coverage.covered}/${coverage.evaluated} (${(coverage.rate*100).toFixed(1)}%). Insufficient history: ${coverage.insufficientIds.length}.\n\n| Agency | Covered/evaluated | Coverage | Insufficient |\n|---|---:|---:|---:|\n${agencyRows}\n\nHindsight relay/resurface comparison (${hindsight.evaluated} records): planned-date false-safe ${hindsight.plannedFalseSafe}/${hindsight.evaluated} (${(hindsight.plannedRate*100).toFixed(1)}%); slip-bound false-safe ${hindsight.boundFalseSafe}/${hindsight.evaluated} (${(hindsight.boundRate*100).toFixed(1)}%). Mean extra wait ${hindsight.meanExtraDays.toFixed(1)} days; median ${hindsight.medianExtraDays} days.\n\nExcluded from coverage: ${coverage.insufficientIds.join(', ')||'none'}. Excluded from hindsight: ${hindsight.insufficientIds.join(', ')||'none'}.\n\nThe finite-sample lower coverage guarantee requires exchangeable scores in the chosen reference class. It is marginal, not a guarantee for this street or season. Tied integer slips can over-cover. Completed records exclude abandoned and still-running works; seasonal shifts and padded baseline schedules can invalidate the practical assumption.\n`);console.log(JSON.stringify(report.clockRisk,null,2))}
