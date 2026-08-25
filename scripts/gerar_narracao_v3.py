import asyncio
import edge_tts
import subprocess
from pathlib import Path
import pandas as pd

df = pd.read_csv('roteiro_lito_merged_v3.csv', encoding='utf-8-sig')

OUT_DIR = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\public\audio")
OUT_DIR.mkdir(parents=True, exist_ok=True)

async def gerar_narracao(row):
    ordem = row['ordem']
    texto = row['narracao_exata_tts']
    arquivo = OUT_DIR / f"narracao_{ordem:02d}.mp3"
    
    communicate = edge_tts.Communicate(texto, "pt-BR-AntonioNeural", rate="-3%", volume="+2%")
    await communicate.save(str(arquivo))
    sz = arquivo.stat().st_size
    print(f"[OK] {ordem:2d} | {row['timecode']} | {row['funcao']:20s} | {sz/1024:.1f}KB")
    return str(arquivo)

async def main():
    print("Gerando 32 narrações individuais...")
    df = pd.read_csv('roteiro_lito_merged_v3.csv', encoding='utf-8-sig')
    
    tasks = [gerar_narracao(row) for _, row in df.iterrows()]
    arquivos = await asyncio.gather(*tasks)
    
    # Concatenate all
    print("\nConcatenando narrações...")
    list_path = Path("C:/Users/Admin/Desktop/Projetos/ss-seguros-video/public/audio/narracao_list.txt")
    with open(list_path, "w") as f:
        for arq in arquivos:
            f.write(f"file '{arq}'\n")
    
    full_path = Path("C:/Users/Admin/Desktop/Projetos/ss-seguros-video/public/audio/narracao_full_v3.mp3")
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(list_path), "-c", "copy", str(full_path)
    ], capture_output=True, timeout=120)
    
    sz = full_path.stat().st_size // 1024
    print(f"\n✅ Narração completa: {full_path} ({sz}KB)")

asyncio.run(main())