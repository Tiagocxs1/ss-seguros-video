import pandas as pd

# CSV 1: Narrative-focused (21 rows)
csv1_data = [
    [1,"00:00–00:02","Você provavelmente viu as notícias sobre o Lito nas últimas semanas.","Lito falando / arquivo","Corte seco","Impact hit","-18 dB","RÁPIDA","HOOK"],
    [2,"00:02–00:04","Um homem ativo, trabalhando, fazendo planos...","Lito em atividade / aviação","Match cut","Whoosh curto","-18 dB","NORMAL","VIDA NORMAL"],
    [3,"00:04–00:07","Até que a vida dele mudou completamente.","Lito / anúncio do diagnóstico","Hard cut","Low boom","-21 dB","IMPACTO","VIRADA"],
    [4,"00:07–00:10","E é aqui que muita gente confunde seguro de vida.","Close do Lito","Punch in 104%","Hit + pausa","-24 dB","LENTA","REFLEXÃO"],
    [5,"00:10–00:13","Seguro de vida não é só sobre morrer.","Lito / tela escura","Corte para preto","Bass hit","-27 dB","IMPACTO","FRASE-CHAVE"],
    [6,"00:13–00:17","Dependendo da apólice, existe também cobertura para doenças graves.","Lito / material editorial","Dissolve curto","Soft pulse","-20 dB","NORMAL","EXPLICAÇÃO"],
    [7,"00:17–00:20","E isso pode fazer uma diferença enorme.","Lito hospital / atualização","Cut","Sub hit","-22 dB","IMPACTO","CONSEQUÊNCIA"],
    [8,"00:20–00:24","Porque uma doença grave não traz só o tratamento.","Hospital / Lito","Hard cut","Heartbeat baixo","-20 dB","NORMAL","PROBLEMA"],
    [9,"00:24–00:27","Pode trazer afastamento do trabalho.","Lito / material profissional","Cut no beat","Tick","-18 dB","RÁPIDA","RENDA"],
    [10,"00:27–00:30","Pode mudar toda a rotina da família.","Lito / família / reportagem","Dissolve","Soft impact","-17 dB","NORMAL","FAMÍLIA"],
    [11,"00:30–00:33","Pode exigir cuidador, adaptações e muito mais.","Home care / material editorial","Push in","Low boom","-19 dB","RÁPIDA","CUSTOS"],
    [12,"00:33–00:36","E é justamente aí que entra a proteção financeira.","Lito + família","Match cut","Riser curto","-18 dB","IMPACTO","VIRADA"],
    [13,"00:36–00:40","A cobertura de doenças graves pode pagar uma indenização em vida, conforme o contrato.","Lito / gráfico simples","Digital zoom","Soft hit","-20 dB","NORMAL","EDUCAÇÃO"],
    [14,"00:40–00:43","Um recurso para ajudar você a reorganizar a vida.","Lito retrato","Slow push","Warm hit","-16 dB","LENTA","BENEFÍCIO"],
    [15,"00:43–00:46","Quando sua prioridade deveria ser cuidar da saúde.","Lito / hospital","Dissolve","Heartbeat + breath","-18 dB","LENTA","EMOÇÃO"],
    [16,"00:46–00:49","Não descobrir como pagar as contas.","Lito / família","Hard cut","Impact + silêncio","-24 dB","IMPACTO","CLÍMAX"],
    [17,"00:49–00:53","Ninguém escolhe quando uma doença grave vai aparecer.","Lito hospital","Slow zoom","Low boom","-22 dB","LENTA","FRASE DE IMPACTO"],
    [18,"00:53–00:57","Mas você pode escolher estar financeiramente preparado para ela.","Lito retrato / família","Dissolve","Riser","-15 dB","IMPACTO","RESPOSTA"],
    [19,"00:57–01:01","Seguro de vida não é esperar o pior.","Lito em atividade","Match cut","Soft hit","-13 dB","NORMAL","MENSAGEM"],
    [20,"01:01–01:05","É proteger o que importa enquanto você ainda pode cuidar de tudo.","Família / Lito retrato","Slow dissolve","Music swell","-10 dB","LENTA","FECHAMENTO"],
    [21,"01:05–01:08","Converse com um especialista sobre seguro de vida e doenças graves.","Tela final S&S","Fade","Chime final","-8 dB","NORMAL","CTA"],
]

# CSV 2: Asset-focused (32 rows)
csv2_data = [
    [1,"00:00-00:02","LITO_VIDEO","Lito — anúncio do câncer de próstata","https://www.terra.com.br/vida-e-estilo/saude/lito-sousa-especialista-de-aviacao-revela-diagnostico-de-cancer-de-prostata%2C2e40c904621cb80043a27be8d849583c013s57za.html","Abrir o vídeo incorporado e extrair 1–2s do próprio Lito falando; melhor material para o hook.","FONTE EDITORIAL/REDE SOCIAL — verificar autorização de reutilização","Corte seco","Impact hit + whoosh","HOOK"],
    [2,"00:02-00:04","LITO_VIDEO","Lito — metáfora do heavy check","https://www.terra.com.br/vida-e-estilo/saude/lito-sousa-especialista-de-aviacao-revela-diagnostico-de-cancer-de-prostata%2C2e40c904621cb80043a27be8d849583c013s57za.html","Usar o trecho em que ele compara o momento a um 'heavy check'.","FONTE EDITORIAL/REDE SOCIAL — verificar autorização","Punch-in 103%","Whoosh curto","CONTEXTO"],
    [3,"00:04-00:06","LITO_IMAGE","Lito no estúdio / escritório de aviação","https://www.reportermt.com/papo-reto/lito-sousa-do-canal-avioes-e-musica-revela-cancer-de-prostata/240533","Imagem nítida para contraste entre vida normal e diagnóstico.","FONTE EDITORIAL — direitos da imagem","Ken Burns 103→106%","Low boom","CONTRASTE"],
    [4,"00:06-00:08","LITO_VIDEO","Lito — relato dos exames de rotina","https://www.uol.com.br/splash/noticias/2026/07/17/lito-sousa-revela-diagnostico-de-cancer-de-prostata-e-fala-sobre-tratamento.ghtm","Usar close do rosto enquanto fala sobre exames/check-up.","FONTE EDITORIAL/REDE SOCIAL — verificar autorização","Corte no beat","Tick + soft hit","PREVENÇÃO"],
    [5,"00:06-00:08","LITO_VIDEO","Lito — câncer de próstata","https://www.uol.com.br/splash/noticias/2026/07/17/lito-sousa-revela-diagnostico-de-cancer-de-prostata-e-fala-sobre-tratamento.ghtm","Trecho curto da revelação do diagnóstico.","FONTE EDITORIAL/REDE SOCIAL — verificar autorização","Hard cut","Impact hit","IMPACTO"],
    [6,"00:10-00:12","LITO_IMAGE","Lito no escritório com aviões","https://www.estadao.com.br/economia/sua-carreira/avioes-musicas-lito-sousa-canal-youtube-aviacao-historia-profissional/","Foto de alta qualidade; usar antes da virada para a doença rara.","FONTE EDITORIAL — direitos da imagem","Slow push-in","Riser","HISTÓRIA"],
    [7,"00:12-00:14","LITO_VIDEO","Lito — vídeo de 3 de agosto sobre câncer/inflamação","https://www.tribunadosertao.com.br/geral/2026/08/03/952406-lito-sousa-detalha-diagnostico-de-cancer-de-prostata-e-internacao-por-inflamacao-cerebral","Fonte que referencia o vídeo publicado no YouTube; localizar o vídeo original e baixar o trecho.","FONTE ORIGINAL PREFERENCIAL: YouTube/Aviões e Músicas","Cut + micro zoom","Heartbeat","VIRADA"],
    [8,"00:14-00:16","LITO_VIDEO","Lito — sintomas neurológicos / braço esquerdo","https://www.tribunadosertao.com.br/geral/2026/08/03/952406-lito-sousa-detalha-diagnostico-de-cancer-de-prostata-e-internacao-por-inflamacao-cerebral","Trecho em que descreve perda de controle motor.","FONTE ORIGINAL PREFERENCIAL","Freeze 6 frames","Sub hit","SINTOMAS"],
    [9,"00:16-00:18","LITO_VIDEO","Lito no hospital — apelo por tratamento experimental","https://www.uol.com.br/splash/noticias/2026/08/23/influenciador-lito-souza-pede-para-entrar-em-tratamento-experimental.amp.htm","Material de maior impacto: Lito aparece em cama hospitalar fazendo apelo.","FONTE EDITORIAL/REDE SOCIAL — verificar autorização","Dissolve 3 frames","Heartbeat + room tone","IMPACTO"],
    [10,"00:18-00:20","LITO_VIDEO","Lito no hospital — trecho do apelo","https://www1.folha.uol.com.br/equilibrioesaude/2026/08/lito-faz-apelo-em-video-nas-redes-sociais-para-ter-acesso-a-tratamento-experimental.shtml","Usar 1–2s, sem explorar sofrimento; foco no rosto/voz.","FONTE EDITORIAL/REDE SOCIAL — verificar autorização","Hard cut","Impact + silence 0.2s","EMOÇÃO"],
    [11,"00:20-00:22","LITO_VIDEO","Lito — apelo às instituições","https://www.uol.com.br/splash/noticias/2026/08/23/influenciador-lito-souza-pede-para-entrar-em-tratamento-experimental.amp.htm","Trecho do pedido por tratamento experimental.","FONTE EDITORIAL/REDE SOCIAL — verificar autorização","Punch-in 105%","Low boom","URGÊNCIA"],
    [12,"00:22-00:24","LITO_IMAGE","Lito / Aviões e Músicas — imagem editorial","https://www.estadao.com.br/economia/sua-carreira/avioes-musicas-lito-sousa-canal-youtube-aviacao-historia-profissional/","Voltar à imagem dele em atividade para lembrar quem ele é além da doença.","FONTE EDITORIAL — direitos da imagem","Parallax leve","Soft whoosh","HUMANIZAÇÃO"],
    [13,"00:24-00:26","LITO_VIDEO","Lito — conteúdo de aviação / vida profissional","https://www.estadao.com.br/economia/sua-carreira/avioes-musicas-lito-sousa-canal-youtube-aviacao-historia-profissional/","Se disponível no artigo, usar B-roll/arquivo dele no escritório; caso contrário, usar a foto.","FONTE EDITORIAL","Match cut","Air whoosh","VIDA NORMAL"],
    [14,"00:26-00:28","LITO_VIDEO","Lito — rotina de criação","https://www.tribunadosertao.com.br/geral/2026/08/03/952406-lito-sousa-detalha-diagnostico-de-cancer-de-prostata-e-internacao-por-inflamacao-cerebral","Priorizar imagens dele trabalhando/escrevendo ou falando antes da piora.","FONTE ORIGINAL PREFERENCIAL","Speed ramp 90→105%","Keyboard click","ROTINA"],
    [15,"00:28-00:30","LITO_IMAGE","Lito em seu ambiente de aviação","https://www.reportermt.com/papo-reto/lito-sousa-do-canal-avioes-e-musica-revela-cancer-de-prostata/240533","Plano limpo do Lito para introduzir a pergunta financeira.","FONTE EDITORIAL — direitos da imagem","Slow zoom","Music dip","PERGUNTA"],
    [16,"00:30-00:32","EDITORIAL","Lito + manchete sobre diagnóstico","https://www.uol.com.br/splash/noticias/2026/08/24/eu-queria-construir-navios-como-lito-sousa-se-especializou-em-avioes.ghtm","Montagem rápida de headline + imagem de Lito.","FONTE EDITORIAL — usar apenas conforme licença","Whip transition","Whoosh","CONTEXTO"],
    [17,"00:32-00:34","EDITORIAL","Lito + home care","https://www.cnnbrasil.com.br/saude/lito-sousa-como-e-o-tratamento-home-care-da-doenca-de-creutzfeldt-jakob/","Usar imagem editorial de Mila/Lito ou home care, se disponível.","FONTE EDITORIAL — direitos da imagem","Dissolve","Room tone","CUSTOS"],
    [18,"00:34-00:36","EDITORIAL","Lito + família / cuidados","https://www1.folha.uol.com.br/equilibrioesaude/2026/08/tenho-duas-opcoes-velar-o-meu-marido-ou-lutar-por-ele-decidi-lutar-diz-mila-seidl-esposa-de-lito-sousa.shtml","Momento para falar de cuidador e estrutura familiar.","FONTE EDITORIAL — direitos da imagem","Slow push","Heartbeat low","FAMÍLIA"],
    [19,"00:36-00:38","EDITORIAL","Lito + estudo experimental PRiSM","https://www.uol.com.br/vivabem/noticias/redacao/2026/08/24/o-que-se-sabe-do-estudo-de-harvard-sobre-a-doenca-de-lito-sousa.ghtm","Usar gráfico/manchete sobre estudo para representar necessidade de recursos.","FONTE EDITORIAL","Digital zoom","Tech hit","TRATAMENTO"],
    [20,"00:38-00:40","EDITORIAL","Lito + evolução rápida da doença","https://www1.folha.uol.com.br/equilibrioesaude/2026/08/lito-faz-apelo-em-video-nas-redes-sociais-para-ter-acesso-a-tratamento-experimental.shtml","Headline/recorte para reforçar urgência, sem sensacionalismo.","FONTE EDITORIAL","Cut","Bass hit","URGÊNCIA"],
    [21,"00:40-00:42","LITO_VIDEO","Primeiro vídeo do canal após diagnóstico","https://noticias.uol.com.br/ultimas-noticias/agencia-estado/2026/08/24/como-foi-o-primeiro-video-do-canal-de-lito-sousa-depois-do-diagnostico-de-doenca-rara.amp.htm","Usar trecho do canal sendo mantido pelos amigos; conecta doença com impacto profissional.","FONTE EDITORIAL/YouTube — verificar autorização","Match cut","Keyboard + click","IMPACTO FINANCEIRO"],
    [22,"00:42-00:44","LITO_IMAGE","Lito — retrato de alta qualidade","https://www.estadao.com.br/economia/sua-carreira/avioes-musicas-lito-sousa-canal-youtube-aviacao-historia-profissional/","Imagem emocional antes da frase 'não existe só o custo do tratamento'.","FONTE EDITORIAL — direitos da imagem","Ken Burns","Music drop","EMOÇÃO"],
    [23,"00:44-00:46","LITO_VIDEO","Lito — fala sobre momento físico e emocional","https://www.uol.com.br/splash/noticias/2026/07/17/lito-sousa-revela-diagnostico-de-cancer-de-prostata-e-fala-sobre-tratamento.ghtm","Trecho em que fala dos meses desafiadores.","FONTE EDITORIAL/REDE SOCIAL — verificar autorização","Corte seco","Soft impact","VULNERABILIDADE"],
    [24,"00:46-00:48","LITO_VIDEO","Lito — metáfora da turbulência","https://www.terra.com.br/vida-e-estilo/saude/lito-sousa-especialista-de-aviacao-revela-diagnostico-de-cancer-de-prostata%2C2e40c904621cb80043a27be8d849583c013s57za.html","Trecho da fala sobre turbulência, excelente ponte narrativa para seguro.","FONTE EDITORIAL/REDE SOCIAL — verificar autorização","Speed ramp leve","Airplane whoosh","METÁFORA"],
    [25,"00:48-00:50","STOCK","Família em casa","https://www.pexels.com/search/videos/family%20at%20home/","Único momento em que entra stock claramente: representar o que queremos proteger.","STOCK — licença Pexels","Cross dissolve","Warm chime","FAMÍLIA"],
    [26,"00:50-00:52","STOCK","Família / cuidado","https://www.pexels.com/search/videos/family%20love/","Plano de abraço, curto e natural.","STOCK — licença Pexels","Cut on beat","Soft hit","PROTEÇÃO"],
    [27,"00:52-00:54","EDITORIAL","Lito — home care","https://www.cnnbrasil.com.br/saude/lito-sousa-como-e-o-tratamento-home-care-da-doenca-de-creutzfeldt-jakob/","Retorno ao caso real para explicar que doença grave altera toda a estrutura da vida.","FONTE EDITORIAL — direitos da imagem","Slow push","Low boom","REALIDADE"],
    [28,"00:54-00:56","LITO_VIDEO","Lito — apelo final / hospital","https://www.uol.com.br/splash/noticias/2026/08/23/influenciador-lito-souza-pede-para-entrar-em-tratamento-experimental.amp.htm","Último uso do material real do Lito; cortar antes de ficar excessivamente dramático.","FONTE EDITORIAL/REDE SOCIAL — verificar autorização","Fade through black","Silence + heartbeat","CLÍMAX"],
    [29,"00:54-00:56","STOCK","Família / cotidiano","https://www.pexels.com/search/videos/family/","Plano positivo para representar proteção e continuidade.","STOCK — licença Pexels","Dissolve","Warm riser","ESPERANÇA"],
    [30,"00:58-01:00","LITO_IMAGE","Lito — retrato final","https://www.estadao.com.br/economia/sua-carreira/avioes-musicas-lito-sousa-canal-youtube-aviacao-historia-profissional/","Retomar o Lito em imagem digna, não hospitalar.","FONTE EDITORIAL — direitos da imagem","Slow zoom out","Music swell","MENSAGEM"],
    [31,"00:58-01:00","STOCK","Família em casa / proteção","https://www.pexels.com/search/videos/family%20home/","Background discreto atrás do texto final.","STOCK — licença Pexels","Fade","Soft chime","CTA"],
    [32,"01:03-01:06","GRAPHIC","Tela final — Seguro de Vida + Doenças Graves","SEM DOWNLOAD — criar no editor","Tipografia + identidade da S&S; sem stock.","ASSET PRÓPRIO","Fade to dark","Final resolve","CTA"],
]

# Parse timecodes to seconds for matching
def tc_to_seconds(tc):
    """Convert timecode like '00:00–00:02' or '00:00-00:02' to (start_sec, end_sec)"""
    tc = tc.replace("–", "-").replace(" ", "")
    start, end = tc.split("-")
    def to_sec(t):
        parts = t.split(":")
        return int(parts[0])*60 + int(parts[1])
    return (to_sec(start), to_sec(end))

# Build CSV1 segments with time ranges
csv1_segments = []
for row in csv1_data:
    start_sec, end_sec = tc_to_seconds(row[1])
    csv1_segments.append({
        "start": start_sec,
        "end": end_sec,
        "narracao": row[2],
        "midia_principal": row[3],
        "musica_db": row[6],
        "ritmo": row[7],
        "funcao_csv1": row[8]
    })

# Build merged rows by finding which CSV1 segment contains each CSV2 segment
merged_rows = []
for row in csv2_data:
    tc = row["timecode"].replace(" ", "")
    start_sec, end_sec = tc_to_seconds(tc)
    mid_sec = (start_sec + end_sec) / 2  # Use midpoint for matching
    
    # Find CSV1 segment that contains this midpoint
    match = None
    for seg in csv1_segments:
        if seg["start"] <= mid_sec < seg["end"]:
            match = seg
            break
    # If no exact match, find closest
    if match is None:
        match = min(csv1_segments, key=lambda s: abs(s["start"] - mid_sec))
    
    merged = {
        "ordem": row[0],
        "timecode": row[1],
        "tipo": row[2],
        "asset": row[3],
        "url": row[4],
        "uso": row[5],
        "direitos_status": row[6],
        "transicao": row[7],
        "efeito_sonoro": row[8],
        "funcao": row[9],
        "narracao_exata_tts": match.get("narracao", "") if match else "",
        "midia_principal_csv1": match.get("midia_principal", "") if match else "",
        "musica_db": match.get("musica_db", "") if match else "",
        "ritmo": match.get("ritmo", "") if match else "",
        "funcao_csv1": match.get("funcao_csv1", "") if match else "",
        "instrucao_tts": "Português do Brasil; natural; sem ler pontuação; reticências=pausa curta; não acelerar.",
        "observacao": "Se houver fala original do Lito, usar J-cut/L-cut para preservar autenticidade."
    }
    merged_rows.append(merged)

df_merged = pd.DataFrame(merged_rows)

cols_order = [
    "ordem", "timecode", "tipo", "asset", "url", "uso", "direitos_status",
    "narracao_exata_tts", "midia_principal_csv1", "transicao", "efeito_sonoro",
    "musica_db", "ritmo", "funcao",
    "instrucao_tts", "observacao"
]

df_merged = pd.DataFrame(merged_rows)[[
    "ordem", "timecode", "tipo", "asset", "url", "uso", "direitos_status",
    "narracao_exata_tts", "transicao", "efeito_sonoro",
    "musica_db", "ritmo", "funcao",
    "instrucao_tts", "observacao"
]]

output_path = r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\roteiro_lito_merged_v3.csv"
df_merged.to_csv(output_path, index=False, encoding="utf-8-sig")
print(f"Saved: {output_path}")
print(f"Rows: {len(df_merged)}")

# Show match quality
for i, row in df_merged.iterrows():
    if row["narracao_exact_tts"] == "":
        print(f"  Row {row['ordem']} ({row['timecode']}): NO MATCH")
    else:
        print(f"  Row {row['ordem']} ({row['timecode']}): OK - {row['funcao']}")