import subprocess
from pathlib import Path

SFX_DIR = Path(__file__).resolve().parent.parent / "public" / "audio" / "sfx"
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

SFX_SPECS = {
    "impact_hit": ("impact", 0.3, -6, 60),
    "whoosh_short": ("whoosh", 0.4, -12, 0),
    "low_boom": ("boom", 0.8, -3, 40),
    "hit_pause": ("hit_pause", 0.2, -9, 80),
    "bass_hit": ("bass_hit", 0.4, -6, 50),
    "soft_pulse": ("tone", 0.3, -18, 220),
    "sub_hit": ("sub_hit", 0.25, -12, 70),
    "heartbeat_low": ("heartbeat", 1.0, -15, 60),
    "tick": ("tick", 0.05, -12, 1000),
    "soft_impact": ("soft_impact", 0.3, -15, 100),
    "riser_short": ("riser", 0.5, -12, 40),
    "digital_zoom": ("tone", 0.2, -18, 800),
    "soft_hit": ("soft_hit", 0.2, -18, 120),
    "warm_hit": ("tone", 0.3, -15, 300),
    "heartbeat_breath": ("heartbeat", 1.2, -18, 55),
    "impact_silence": ("impact", 0.4, -6, 50),
    "riser": ("riser", 1.0, -9, 40),
    "music_swell": ("swell", 1.5, -12, 220),
    "chime_final": ("chime", 1.0, -9, 880),
}

for name, spec in SFX_SPECS.items():
    typ = spec[0]
    dur = spec[1]
    gain = spec[2]
    freq = spec[3]
    
    out_file = SFX_DIR / f"{name}.mp3"
    
    if typ == "impact":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*30)+random(0)*0.3*exp(-t*20):d={dur}:s=48000,volume={gain}dB"
    elif typ == "whoosh":
        fg = f"anoisesrc=color=white:d={dur}:s=48000,highpass=f=200,lowpass=f=2000,aevalsrc=exp(-t*8):d={dur}:s=48000,amix=inputs=2:duration=first:dropout_transition=0,volume={gain}dB"
    elif typ == "boom":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*3):d={dur}:s=48000,volume={gain}dB"
    elif typ == "tone":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*10):d={dur}:s=48000,volume={gain}dB"
    elif typ == "hit_pause":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*50):d={dur}:s=48000,volume={gain}dB"
    elif typ == "bass_hit":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*15):d={dur}:s=48000,volume={gain}dB"
    elif typ == "sub_hit":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*25):d={dur}:s=48000,volume={gain}dB"
    elif typ == "heartbeat":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*(exp(-t*20)+exp(-(t-0.15)*20)*between(t,0.15,0.3)):d={dur}:s=48000,volume={gain}dB"
    elif typ == "tick":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*200):d={dur}:s=48000,volume={gain}dB"
    elif typ == "soft_impact":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*20):d={dur}:s=48000,volume={gain}dB"
    elif typ == "riser":
        fg = f"aevalsrc=sin(2*PI*{freq}*(1+t*15)*t)*pow(t/{dur},2):d={dur}:s=48000,volume={gain}dB"
    elif typ == "soft_hit":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*30):d={dur}:s=48000,volume={gain}dB"
    elif typ == "warm_hit":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*10):d={dur}:s=48000,volume={gain}dB"
    elif typ == "swell":
        fg = f"aevalsrc=sin(2*PI*220*t)+sin(2*PI*330*t)+sin(2*PI*440*t)*pow(t/{dur},3):d={dur}:s=48000,volume={gain}dB"
    elif typ == "chime":
        fg = f"aevalsrc=sin(2*PI*{freq}*t)*exp(-t*2)+sin(2*PI*{freq*1.5}*t)*exp(-t*3):d={dur}:s=48000,volume={gain}dB"
    else:
        continue
    
    ok, err = run_ffmpeg(fg, out_file)
    if ok:
        print(f"[OK] {name}.mp3")
    else:
        print(f"[FAIL] {name}: {err[:300]}")

print("\nSFX generation complete!")