import json,pathlib,subprocess,hashlib
out=pathlib.Path('qa/demo');raw=out/'raw';clips=out/'clips';clips.mkdir(parents=True,exist_ok=True)
web=json.loads((out/'web-recording.json').read_text());timeline=json.loads(pathlib.Path('scripts/demo_timeline.json').read_text())
font='node_modules/@fontsource/public-sans/files/public-sans-latin-600-normal.woff2'
def run(args):subprocess.run(args,check=True)
def label(name,text):
    path=out/f'{name}.txt';path.write_text(text,encoding='utf-8');return str(path)
def caption(path,x=80,y=12,size=23):return f'drawtext=fontfile={font}:textfile={path}:fontsize={size}:fontcolor=0x193b36:x={x}:y={y}'
def zoom_filter(zoom,center,delayed=False):
    if zoom==1:return ''
    z=f'1+{zoom-1:.3f}*(1-exp(-on/8))' if not delayed else 'if(lt(on,150),1,1+0.4*(1-exp(-(on-150)/8)))'
    x,y=center
    return f"zoompan=z='{z}':x='max(0,min(iw-iw/zoom,{x}-iw/zoom/2))':y='max(0,min(ih-ih/zoom,{y}-ih/zoom/2))':d=1:s=1920x1080:fps=30"
def anchor(name):
    box=web['anchors'][name];return box['x']+box['width']/2,box['y']+box['height']/2
titles={
 'problem':'awgur | Website: a planned-safe cut can be too early',
 'clock-risk-web':'Website | Clock Risk connects the ledger to permit review',
 'clock-risk-android':'Installed Android APK | Upper finish bound, then apply and recheck',
 'insufficient':'Installed Android APK | Insufficient history is an explicit result',
 'coordination':'Installed Android APK | Validated coordination window',
 'public-exception':'Installed Android APK | Emergency reason stays on the project record',
 'hindsight':'Website | Synthetic replay: 56/63 to 3/63 false-safe starts; +11.9 days mean wait',
 'coverage':'Website | 179/196 covered (91.3%); known conformal method',
 'research':'Next | Municipal histories, seasonal holdouts, risk versus waiting cost'
}
parts=[]
for scene in timeline['scenes']:
    name=scene['name'];duration=scene['end']-scene['start'];dest=clips/f'{len(parts):02d}-{name}.mp4'
    if scene['source']=='both':
        command=['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(web['offsetSeconds']+scene['webStart']),'-i',str(raw/'web.webm'),'-ss',str(scene['nativeStart']),'-i',str(raw/'native.mp4'),'-t',str(duration)]
        title=label(name,'awgur | A delay record informs the decision before the next cut')
        graph=f"[0:v]fps=30,scale=960:540,pad=960:1000:0:230:color=0xf6f4eb[left];[1:v]fps=30,scale=-2:1000,pad=960:1000:(ow-iw)/2:0:color=0xf6f4eb[right];[left][right]hstack,pad=1920:1080:0:40:color=0xf6f4eb,{caption(title)}[v]"
        command+=['-filter_complex',graph,'-map','[v]']
    else:
        native=scene['source']=='native';source=raw/('native.mp4' if native else 'web.webm');start=scene['sourceStart']+(0 if native else web['offsetSeconds'])
        command=['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(start),'-i',str(source),'-t',str(duration)]
        filters=['fps=30']
        if native:
            filters+=['scale=-2:1000','pad=1920:1080:(ow-iw)/2:40:color=0xf6f4eb']
            zoom={'clock-risk-android':1.4,'insufficient':1.3,'coordination':1.25}.get(name,1)
            if zoom!=1:filters.append(zoom_filter(zoom,(960,640),name=='clock-risk-android'))
        else:
            zoom={'clock-risk-web':1.45,'hindsight':1.15,'coverage':1.1}.get(name,1)
            if zoom!=1:filters.append(zoom_filter(zoom,anchor({'clock-risk-web':'risk','hindsight':'hindsight','coverage':'coverage'}[name])))
            filters+=['scale=1776:1000','pad=1920:1080:72:40:color=0xf6f4eb']
        filters.append(caption(label(name,titles[name])))
        filters.append(caption(label(name+'-footer','Synthetic demo data | Voice-over supplied separately'),80,1047,19))
        command+=['-vf',','.join(filters)]
    command+=['-an','-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-r','30','-movflags','+faststart',str(dest)]
    run(command);parts.append(dest)
manifest=clips/'concat.txt';manifest.write_text('\n'.join(f"file '{path.name}'" for path in parts)+'\n')
final=out/'awgur-demo.mp4';run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(manifest),'-c','copy','-movflags','+faststart',str(final)])
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(final)]))
assert abs(float(probe['format']['duration'])-160)<.15,'Unexpected final duration'
assert final.stat().st_size<100*1024*1024,'Video exceeds GitHub file limit'
assert probe['streams'][0]['width']==1920 and probe['streams'][0]['height']==1080
for time,name in [(8,'problem'),(30,'web-risk'),(55,'android-risk'),(73,'insufficient'),(97,'public-exception'),(116,'results'),(153,'both')]:run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(time),'-i',str(final),'-frames:v','1',str(out/f'frame-{name}.png')])
metadata={'durationSeconds':float(probe['format']['duration']),'bytes':final.stat().st_size,'sha256':hashlib.sha256(final.read_bytes()).hexdigest(),'resolution':[1920,1080],'audio':'silent for user voice-over','sources':['actual hosted website','actual installed Android debug APK'],'timeline':timeline['scenes']}
(out/'video-checks.json').write_text(json.dumps(metadata,indent=2));print(json.dumps(metadata,indent=2))
