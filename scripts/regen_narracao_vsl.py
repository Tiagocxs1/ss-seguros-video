import sys, subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

BLOCOS = {
    "s01": "Doenca rara. Piloto. Pai. Filho de sete anos.",
    "s02": "Lito Sousa. Seis milhoes te seguem. Piloto, mecanico de aviao. O diagnostico: Creutzfeldt-Jakob. Sem cura. Degenerativa. Rara.",
    "s03": "A esposa, Mila, contou: num momento de lucidez, ele explicou pro filho o ciclo da vida. Do jeito mais bonito que existe. Cabeca lucida. Corpo que nao obedece.",
    "s04": "Doenca grave nao avisa. Chega e leva tudo: homecare, cuidador vinte e quatro horas, estrutura. Perda de renda. Despesas invisiveis. Enquanto a vida para.",
    "s05": "O cancer dele? Descoberto no toque retal. Exame de rotina. Sem drama. Sem vergonha. Prevencao salvou a vida dele enquanto dava tempo.",
    "s06": "Doenca grave nao escolhe idade. Nao escolhe saude. Nao escolhe estilo de vida. Escolhe quem nao se protegeu.",
    "s07": "S e S Seguros. Seguro de vida. Seguro doencas graves. Nao e luxo. E responsabilidade. Proteja quem voce ama. Antes que precise.",
}

OUT_DIR = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\public\audio")
OUT_DIR.mkdir(parents=True, exist_ok=True)

for nome, texto in BLOCOS.items():
    arquivo = OUT_DIR / f"{nome}.mp3"
    cmd = [
        "edge-tts",
        "--voice", "pt-BR-AntonioNeural",
        "--rate", "-3%",
        "--volume", "+2dB",
        "--text", texto,
        "--write-media", str(arquivo)
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if r.returncode != 0:
        print(f"[ERRO] {nome}: {r.stderr[:300]}")
    else:
        sz = arquivo.stat().st_size
        print(f"[OK] {nome}.mp3 ({sz/1024:.1f}KB)")

print("\n✅ Narração VSL regenerada")