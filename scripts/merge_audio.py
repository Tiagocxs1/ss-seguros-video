import subprocess, os

files = [f's{i:02d}.mp3' for i in range(1, 22)]
audio_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'audio')

with open(os.path.join(audio_dir, 'merge_list.txt'), 'w') as f:
    for fn in files:
        f.write(f"file '{fn}'\n")

result = subprocess.run(
    ['ffmpeg', '-y', '-f', 'concat', '-safe', '0',
     '-i', os.path.join(audio_dir, 'merge_list.txt'),
     '-c', 'copy',
     os.path.join(audio_dir, 'narracao_merged.mp3')],
    capture_output=True, text=True
)

if result.returncode != 0:
    print("ERROR:", result.stderr[-500:])
else:
    sz = os.path.getsize(os.path.join(audio_dir, 'narracao_merged.mp3'))
    print(f"OK - narracao_merged.mp3 ({sz//1024}KB)")