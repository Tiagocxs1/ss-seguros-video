import sys, asyncio, edge_tts
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

BLOCOS = {
    "s01": "Seis milhões de pessoas acompanharam. Piloto. Mecânico de avião. Pai. De repente... a vida parou.",
    "s02": "Lito Sousa. O cara que conserta aviões, que voa, que tem seis milhões te seguindo no Instagram. Recebeu o diagnóstico: Creutzfeldt-Jakob. Doença de príon. Rara. Degenerativa. Sem cura conhecida. Um em um milhão.",
    "s03": "A esposa, Mila Seidl, contou: num momento de lucidez, ele sentou com o filho de sete anos e explicou o ciclo da vida. Do jeito mais bonito que existe. A cabeça lúcida. O corpo... que não obedece mais.",
    "s04": "Doença grave não avisa. Chega e leva tudo: homecare, cuidador vinte e quatro horas, estrutura hospitalar em casa. Perda de renda. Despesas invisíveis. Enquanto a vida para.",
    "s05": "Mas olha o paradoxo: o câncer de próstata do Lito? Foi descoberto no toque retal. Exame de rotina. Sem drama. Sem vergonha. Prevenção salvou a vida dele — enquanto dava tempo.",
    "s06": "Doença grave não escolhe idade. Não escolhe saúde. Não escolhe estilo de vida. Não escolhe se você é piloto, influenciador, pai de família. Escolhe quem não se protegeu.",
    "s07": "S e S Seguros. Seguro de vida. Seguro doenças graves. Não é luxo. É responsabilidade. Proteja quem você ama. Antes que precise.",
}

OUT_DIR = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\public\audio")
OUT_DIR.mkdir(parents=True, exist_ok=True)

async def gerar(nome, texto):
    arquivo = OUT_DIR / f"{nome}.mp3"
    communicate = edge_tts.Communicate(texto, "pt-BR-AntonioNeural", rate="-3%", volume="+2%")
    await communicate.save(str(arquivo))
    sz = arquivo.stat().st_size
    print(f"[OK] {nome}.mp3 ({sz/1024:.1f}KB)")

async def main():
    for nome, texto in BLOCOS.items():
        try:
            await gerar(nome, texto)
        except Exception as e:
            print(f"[ERRO] {nome}: {e}")
    print("\n✅ Narração VSL HISTÓRIA REAL regenerada!")

asyncio.run(main())