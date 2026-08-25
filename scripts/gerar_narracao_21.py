import asyncio
import edge_tts
import subprocess
from pathlib import Path

SEGMENTOS = [
    ("s01", "Você provavelmente viu as notícias sobre o Lito nas últimas semanas.", 2.0),
    ("s02", "Um homem ativo, trabalhando, fazendo planos...", 2.0),
    ("s03", "Até que a vida dele mudou completamente.", 3.0),
    ("s04", "E é aqui que muita gente confunde seguro de vida.", 3.0),
    ("s05", "Seguro de vida não é só sobre morrer.", 3.0),
    ("s06", "Dependendo da apólice, existe também cobertura para doenças graves.", 4.0),
    ("s07", "E isso pode fazer uma diferença enorme.", 3.0),
    ("s08", "Porque uma doença grave não traz só o tratamento.", 4.0),
    ("s09", "Pode trazer afastamento do trabalho.", 3.0),
    ("s10", "Pode mudar toda a rotina da família.", 3.0),
    ("s11", "Pode exigir cuidador, adaptações e muito mais.", 3.0),
    ("s12", "E é justamente aí que entra a proteção financeira.", 3.0),
    ("s13", "A cobertura de doenças graves pode pagar uma indenização em vida, conforme o contrato.", 4.0),
    ("s14", "Um recurso para ajudar você a reorganizar a vida.", 3.0),
    ("s15", "Quando sua prioridade deveria ser cuidar da saúde.", 3.0),
    ("s16", "Não descobrir como pagar as contas.", 3.0),
    ("s17", "Ninguém escolhe quando uma doença grave vai aparecer.", 4.0),
    ("s18", "Mas você pode escolher estar financeiramente preparado para ela.", 4.0),
    ("s19", "Seguro de vida não é esperar o pior.", 4.0),
    ("s20", "É proteger o que importa enquanto você ainda pode cuidar de tudo.", 4.0),
    ("s21", "Converse com um especialista sobre seguro de vida e doenças graves.", 3.0),
]

OUT_DIR = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\public\audio")
OUT_DIR.mkdir(parents=True, exist_ok=True)

async def gerar(bloco, texto, dur_esperada):
    arquivo = OUT_DIR / f"{bloco}.mp3"
    communicate = edge_tts.Communicate(texto, "pt-BR-AntonioNeural", rate="-5%", volume="+3%")
    await communicate.save(str(arquivo))
    sz = Path(arquivo).stat().st_size
    print(f"[OK] {bloco}.mp3 ({sz/1024:.1f}KB) - {len(texto)} chars")
    return str(arquivo)

async def main():
    print("Gerando 21 segmentos de narração...")
    tasks = [gerar(b, t, d) for b, t, d in SEGMENTOS]
    arquivos = await asyncio.gather(*tasks)
    
    # Concatenar
    list_path = OUT_DIR / "narracao_list_21.txt"
    with open(list_path, "w") as f:
        for arq in arquivos:
            f.write(f"file '{arq}'\n")
    
    full_path = OUT_DIR / "narracao_21_full.mp3"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(list_path), "-c", "copy", str(full_path)
    ], capture_output=True, timeout=60)
    
    sz = Path(full_path).stat().st_size // 1024
    dur = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1", str(full_path)], capture_output=True, text=True, timeout=10)
    print(f"\nNarração final: {sz}KB | {dur.stdout.strip()}s | {full_path}")

asyncio.run(main())