import subprocess, time, pathlib, xml.etree.ElementTree as ET
out=pathlib.Path('qa/android'); out.mkdir(parents=True,exist_ok=True)
def adb(*args):
    return subprocess.check_output(['adb',*args], text=True)
adb('install','-r','android/app/build/outputs/apk/debug/app-debug.apk')
adb('logcat','-c')
adb('shell','am','start','-n','app.worksregistry.demo/.MainActivity')
time.sleep(8)
adb('shell','uiautomator','dump','/sdcard/window.xml')
adb('pull','/sdcard/window.xml',str(out/'launch.xml'))
adb('shell','screencap','-p','/sdcard/launch.png')
adb('pull','/sdcard/launch.png',str(out/'launch.png'))
xml=(out/'launch.xml').read_text()
assert 'android.webkit.WebView' in xml, 'Installed WebView missing'
subprocess.check_call(['node','scripts/native_probe.mjs'])
log=adb('logcat','-d')
(out/'logcat.txt').write_text(log)
assert 'FATAL EXCEPTION' not in log, 'Native crash detected'
print('Installed APK launch and synthetic disclosure verified on emulator.')


subprocess.check_call(['node','scripts/android_flow.mjs'])
