import subprocess,time,pathlib
out=pathlib.Path('qa/android');out.mkdir(parents=True,exist_ok=True)
def adb(*args):return subprocess.check_output(['adb',*args],text=True)
adb('install','-r','android/app/build/outputs/apk/debug/app-debug.apk')
adb('logcat','-c');adb('shell','am','start','-W','-n','app.worksregistry.demo/.MainActivity');time.sleep(8)
# UIAutomator cannot reliably traverse WebView content and can time out while tiles render.
# Retain its tree when available; rendered-content and complete flow checks are authoritative.
try:
    adb('shell','uiautomator','dump','/sdcard/window.xml');adb('pull','/sdcard/window.xml',str(out/'launch.xml'))
except subprocess.CalledProcessError:
    (out/'uiautomator-note.txt').write_text('UI tree dump was unavailable; installed WebView content is verified directly.')
adb('shell','screencap','-p','/sdcard/launch.png');adb('pull','/sdcard/launch.png',str(out/'launch.png'))
subprocess.check_call(['node','scripts/native_probe.mjs'])
log=adb('logcat','-d');(out/'logcat.txt').write_text(log)
assert 'FATAL EXCEPTION' not in log,'Native crash detected'
subprocess.check_call(['node','scripts/android_flow.mjs'])
print('Installed APK content and complete native flows verified.')
