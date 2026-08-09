# Voice Cloning — amostras de voz para XTTS v2

Coloque aqui os arquivos de áudio de referência para clonagem de voz.

## Estrutura

```
voices/
  examples/
    <nome-do-cliente>/
      reference.wav      ← 15-30s de áudio limpo (ver pré-processamento abaixo)
      metadata.json      ← opcional: nome, idioma, observações
  generated/
    <nome-do-cliente>_<timestamp>/
      clone.wav          ← saída gerada pelo modelo
```

## Pré-processamento da amostra (OBRIGATÓRIO para bons resultados)

Áudios de Reels/Instagram têm música, ruído e estéreo — o XTTS exige áudio limpo.

Padrão ideal: **mono, 16kHz, 15-30s, sem silêncios longos**.

### Processamento automático (recomendado)

```bash
# Corta primeiros 25s, normaliza volume, remove graves/agudos, converte para mono 16kHz
ffmpeg -y -i input_original.wav -t 25 -ss 0 \
  -af "highpass=f=80,lowpass=f=11000,loudnorm=I=-16:TP=-1.5:LRA=11,pan=mono|c0=c0" \
  -ar 16000 -ac 1 -c:a pcm_s16le \
  voices/examples/<id>/reference.wav
```

### Regras para a amostra de referência

| Item | Valor |
|------|-------|
| Duração | 15 a 30 segundos |
| Canais | Mono |
| Sample rate | 16kHz |
| Formato | WAV pcm_s16le |
| Conteúdo | Voz falando natural, sem música/ruído |
| Nome da pasta | identificador único (ex: `luisa_lopes`, `cliente1`) |

## Como usar

```bash
# Por voice ID (usa voices/examples/<id>/reference.wav)
npm run voice:clone -- --voice luisa_lopes --text "Proteja quem você ama com a Guardian."

# Com URL de áudio (útil quando o reference.wav já está online)
npm run voice:clone -- --url "https://site.com/audio.wav" --text "Seu texto..."

# Com arquivo local direto
npm run voice:clone -- --file "C:\caminho\audio.wav" --text "Seu texto..."

# Customizando saída e idioma
npm run voice:clone -- --voice luisa_lopes --text "Olá!" --out voices/generated/minha_narracao.wav --lang pt
```

## Serviço usado

**XTTS v2 (Coqui)** via HuggingFace Space:
- Space: `https://huggingface.co/spaces/hasanbasbunar/Voice-Cloning-XTTS-v2`
- Hardware: A10G (zero-gpu)
- Idiomas suportados: pt, en, fr, es, de, it, pl, tr, ru, nl, cs, ar, zh, ja, ko, hu, hi
- Limite: gratuito (fila do Space)

## Troubleshooting

- **"Resultado não parece com a voz original"** → recorte o áudio para os primeiros 15-20s mais limpos
- **"Música/ruído na saída"** → aplique o filtro `highpass` no ffmpeg
- **"Space sobrecarregado"** → aguarde 1-2 min e tente novamente
- **"Voz robótica"** → use áudio de referência com entonação natural, sem silêncios longos
