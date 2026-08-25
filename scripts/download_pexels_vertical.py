import requests
import os
from pathlib import Path

# Known good vertical Pexels/Unsplash images (direct URLs)
# These are popular vertical aviation/family images
VERTICAL_ASSETS = {
    # Aviation vertical
    "pexels_aviation_01.jpg": "https://images.pexels.com/photos/174711/pexels-photo-174711.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_aviation_02.jpg": "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_aviation_03.jpg": "https://images.pexels.com/photos/1462440/pexels-photo-1462440.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_aviation_04.jpg": "https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_aviation_05.jpg": "https://images.pexels.com/photos/1029730/pexels-photo-1029730.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_aviation_06.jpg": "https://images.pexels.com/photos/846964/pexels-photo-846964.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    
    # Family vertical
    "pexels_family_01.jpg": "https://images.pexels.com/photos/1163463/pexels-photo-1163463.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_family_02.jpg": "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_family_03.jpg": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_family_04.jpg": "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_family_05.jpg": "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_family_06.jpg": "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    
    # Pilot/mechanic vertical
    "pexels_pilot_01.jpg": "https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_pilot_02.jpg": "https://images.pexels.com/photos/1264211/pexels-photo-1264211.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    
    # Medical/health vertical (for hospital scenes)
    "pexels_hospital_01.jpg": "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
    "pexels_hospital_02.jpg": "https://images.pexels.com/photos/40568/medical-team-hospital.jpg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop",
}

OUT_DIR = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\public\images\pexels")
OUT_DIR.mkdir(parents=True, exist_ok=True)

def download(url, filename):
    path = OUT_DIR / filename
    if path.exists():
        print(f"[SKIP] {filename} already exists")
        return True
    try:
        r = requests.get(url, timeout=30, stream=True)
        r.raise_for_status()
        with open(path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        size = path.stat().st_size
        print(f"[OK] {filename} ({size/1024:.1f}KB)")
        return True
    except Exception as e:
        print(f"[FAIL] {filename}: {e}")
        return False

print("Downloading vertical assets from Pexels...")
success = 0
for filename, url in VERTICAL_ASSETS.items():
    if download(url, filename):
        success += 1

print(f"\nDownloaded {success}/{len(VERTICAL_ASSETS)} assets to {OUT_DIR}")