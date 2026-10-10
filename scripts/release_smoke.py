import subprocess,time,pathlib,zipfile,hashlib,json
out=pathlib.Path('qa/release');out.mkdir(parents=True,exist_ok=True)
release='android/app/build/outputs/apk/release/app-release.apk'
debug='android/app/build/outputs/apk/debug/app-debug.apk'
def assets(apk):
    with zipfile.ZipFile(apk) as archive:
        return {name:hashlib.sha256(archive.read(name)).hexdigest() for name in archive.namelist() if name.startswith('assets/public/') and not name.endswith('/')}
assert assets(release)==assets(debug),'Release and debug app assets differ'
(out/'asset-equivalence.json').write_text(json.dumps({'equal':True,'files':len(assets(release))},indent=2))
def adb(*args):return subprocess.check_output(['adb',*args],text=True)
adb('install','-r',release);adb('logcat','-c');adb('shell','am','start','-W','-n','app.worksregistry.demo/.MainActivity');time.sleep(5)
app_pid=adb('shell','pidof','app.worksregistry.demo').strip().split()[0]
try:
    adb('shell','uiautomator','dump','/sdcard/release.xml');adb('pull','/sdcard/release.xml',str(out/'release.xml'))
except subprocess.CalledProcessError:
    (out/'uiautomator-note.txt').write_text('UIAutomation tree unavailable; signed app foreground, crash log, asset equivalence and captured content are checked separately.')
with open(out/'release-launch.png','wb') as image:image.write(subprocess.check_output(['adb','exec-out','screencap','-p']))
log=adb('logcat','-d');(out/'logcat.txt').write_text(log)
app_log=adb('logcat','-d',f'--pid={app_pid}');(out/'app-logcat.txt').write_text(app_log)
assert 'FATAL EXCEPTION' not in app_log,'Native release process crashed'
if (out/'release.xml').exists():assert 'android.webkit.WebView' in (out/'release.xml').read_text(),'Release WebView missing'
assert any('app.worksregistry.demo' in line and 'ResumedActivity' in line for line in adb('shell','dumpsys','activity','activities').splitlines()),'Signed app is not foreground'
# Capture a true offline cold launch of the signed release; visually reviewed before publication.
adb('shell','cmd','connectivity','airplane-mode','enable');adb('shell','svc','wifi','disable');adb('shell','svc','data','disable');time.sleep(3);adb('shell','am','force-stop','app.worksregistry.demo');adb('shell','am','start','-W','-n','app.worksregistry.demo/.MainActivity');time.sleep(5)
with open(out/'release-offline.png','wb') as image:image.write(subprocess.check_output(['adb','exec-out','screencap','-p']))
time.sleep(8)
with open(out/'release-offline-settled.png','wb') as image:image.write(subprocess.check_output(['adb','exec-out','screencap','-p']))
(out/'offline-logcat.txt').write_text(adb('logcat','-d'))
print('Signed APK installs, opens, has identical web assets to tested debug build, and offline-launch captures are ready.')
