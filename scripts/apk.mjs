import { spawnSync } from 'node:child_process';
const windows = process.platform === 'win32';
for (const [command,args,cwd] of [['npm',['run','android:sync'],'.'],[windows?'gradlew.bat':'./gradlew',['assembleDebug'],'android']]) {
 const result = spawnSync(command,args,{cwd,stdio:'inherit',shell:windows});
 if(result.status!==0) process.exit(result.status??1);
}
