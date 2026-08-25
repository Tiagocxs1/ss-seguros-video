import asyncio
import edge_tts
import subprocess
from pathlib import Path
import pandas as pd

df = pd.read_csv('roteiro_lito_merged_v3.csv', encoding='utf-8-sig')

OUT_DIR = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\public\audio")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Apenas UMA narração por bloco lógico (7 blocos), não 32
BLOCOS = [
    ("s01", "Você provavelmente viu as notícias sobre o Lito nas últimas semanas. Um homem ativo, trabalhando, fazendo planos... Seis milhões te seguem. Até que a vida dele mudou completamente. Creutzfeldt-Jakob. Sem cura. Degenerativa. Rara.", 12.5),
    ("s02", "A esposa, Mila Seidl, contou: num momento de lucidez, ele sentou com o filho de sete anos e explicou o ciclo da vida. Do jeito mais bonito que existe. Cabeça lúcida. Corpo que não obedece.", 15.0),
    ("s03", "Doença grave não avisa. Chega e leva tudo: homecare, cuidador vinte e quatro horas, estrutura. Perda de renda. Despesas invisíveis. Enquanto a vida para.", 14.0),
    ("s04", "O câncer dele? Descoberto no toque retal. Exame de rotina. Sem drama. Sem vergonha. Prevenção salvou a vida dele — enquanto dava tempo.", 14.5),
    ("s05", "Doença grave não escolhe idade. Não escolhe saúde. Não escolhe estilo de vida. Escolhe quem não se protegeu.", 11.0),
    ("s06", "S&S Seguros. Seguro de vida. Seguro doenças graves. Não é luxo. É responsabilidade. Proteja quem você ama. Antes que precise.", 12.0),
]

OUT_DIR = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\public\audio")
OUT_DIR.mkdir(parents=True, exist_ok=True)

async def gerar(bloco, texto, dur_esperada):
    arquivo = OUT_DIR / f"{bloco}.mp3"
    # rate=-3% mais rápido, volume +2dB, voice AntonioNeural
    communicate = edge_tts.Communicate(texto, "pt-BR-AntonioNeural", rate="-5%", volume="+3%")
    await communicate.save(str(arquivo))
    sz = Path(arquivo).stat().st_size
    print(f"[OK] {bloco}.mp3 ({sz/1024:.1f}KB) - {len(texto)} chars")
    return str(arquivo)

async def main():
    print("Gerando 6 blocos de narração dinâmica...")
    tasks = [gerar(b, t, d) for b, t, d in BLOCOS]
    arquivos = await asyncio.gather(*tasks)
    
    # Concatenar
    list_path = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\public\audio\narracao_list_final.txt")
    with open(list_path, "w") as f:
        for arq in arquivos:
            f.write(f"file '{arq}'\n")
    
    full_path = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\public\audio\narracao_final.mp3")
    import subprocess
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(list_path), "-c", "copy", str(full_path)
    ], capture_output=True, timeout=60)
    
    sz = Path(full_path).stat().st_size // 1024
    dur = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1", str(full_path)], capture_output=True, text=True, timeout=10)
    print(f"\n✅ Narração final: {sz}KB | {dur.stdout.strip()}s | {full_path}")

asyncio.run(main())