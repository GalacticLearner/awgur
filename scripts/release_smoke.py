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
adb('shell','uiautomator','dump','/sdcard/release.xml');adb('pull','/sdcard/release.xml',str(out/'release.xml'))
with open(out/'release-launch.png','wb') as image:image.write(subprocess.check_output(['adb','exec-out','screencap','-p']))
log=adb('logcat','-d');(out/'logcat.txt').write_text(log)
assert 'FATAL EXCEPTION' not in log,'Native release crash'
assert 'android.webkit.WebView' in (out/'release.xml').read_text(),'Release WebView missing'
# Capture a true offline cold launch of the signed release; visually reviewed before publication.
adb('shell','cmd','connectivity','airplane-mode','enable');adb('shell','svc','wifi','disable');adb('shell','svc','data','disable');adb('shell','am','force-stop','app.worksregistry.demo');adb('shell','am','start','-W','-n','app.worksregistry.demo/.MainActivity');time.sleep(5)
with open(out/'release-offline.png','wb') as image:image.write(subprocess.check_output(['adb','exec-out','screencap','-p']))
print('Signed APK installs, opens, has identical web assets to tested debug build, and offline-launch captures are ready.')
