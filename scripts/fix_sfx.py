import subprocess
from pathlib import Path

SFX_DIR = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\public\audio\sfx")
SFX_DIR.mkdir(parents=True, exist_ok=True)

def run_ffmpeg(filter_graph, out_file):
    cmd = [
        "ffmpeg", "-y",
        "-filter_complex", filter_graph,
        "-c:a", "libmp3lame", "-b:a", "128k",
        str(out_file)
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        return result.returncode == 0, result.stderr
    except Exception as e:
        return False, str(e)

# Fix failing SFX with comma-free expressions
# Use d=1 for all (1 second), envelope handles actual duration
FAILING_SPECS = {
    "whoosh_short": ("whoosh", 1.0, -12),
    "riser_short": ("riser", 1.0, -12),
    "riser": ("riser", 1.0, -9),
    "music_swell": ("swell", 1.5, -12),
}

for name, spec in FAILING_SPECS.items():
    typ = spec[0]
    dur = spec[1]
    gain = spec[2]
    out_file = SFX_DIR / f"{name}.mp3"
    
    if typ == "whoosh":
        # Whoosh: random noise with fast decay envelope
        fg = f"aevalsrc=random(0)*exp(-t*8):d={dur}:s=48000,highpass=f=200,lowpass=f=2000,volume={gain}dB"
    elif typ == "riser":
        # Riser: rising pitch with quadratic volume swell (no commas in expression)
        fg = f"aevalsrc=sin(2*PI*40*(1+t*15)*t)*(t*t*4):d={dur}:s=48000,volume={gain}dB"
    elif typ == "swell":
        # Swell: chord with cubic volume swell (no commas)
        fg = f"aevalsrc=sin(2*PI*220*t)+sin(2*PI*330*t)+sin(2*PI*440*t)*t*t*t:{dur}:s=48000,volume={gain}dB"
    else:
        continue
    
    ok, err = run_ffmpeg(fg, out_file)
    if ok:
        print(f"[OK] {name}.mp3")
    else:
        print(f"[FAIL] {name}: {err[:300]}")

print("\nFixed SFX generation complete!")