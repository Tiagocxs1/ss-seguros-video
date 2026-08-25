# Deploy no Google Cloud - Guia Rápido

## Pré-requisitos (rode uma vez)

```bash
# 1. Instale gcloud CLI
# Windows: https://cloud.google.com/sdk/docs/install
# Mac: brew install google-cloud-sdk
# Linux: curl https://sdk.cloud.google.com | bash

# 2. Login e configure projeto
gcloud auth login
gcloud config set project SEU_PROJECT_ID

# 3. Habilite billing no projeto (obrigatório)
# Console: https://console.cloud.google.com/billing
```

## Deploy Automático (Recomendado)

### Windows:
```cmd
deploy.bat
# ou
deploy.bat MEU_PROJECT_ID meu-bucket-videos
```

### Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
# ou
./deploy.sh MEU_PROJECT_ID meu-bucket-videos
```

## O que o script faz:

1. **Habilita APIs**: Cloud Build, Cloud Run, Artifact Registry, Cloud Storage
2. **Cria bucket** `gs://SEU_PROJECT_ID-renders` (ou nome customizado)
3. **Atualiza `cloudbuild.yaml`** com seu bucket
4. **Submete Cloud Build** com:
   - Máquina: `E2_HIGHCPU_8` (8 vCPU, 8GB RAM)
   - Disco: 100GB
   - Timeout: 2 horas
   - Temp dir: `/tmp` (no disco grande)
4. **Upload automático** do vídeo para `gs://BUCKET/ss-seguros-reel.mp4`

## Acompanhar Progresso

```bash
# Via terminal
gcloud builds list --project=SEU_PROJECT_ID --limit=5

# Ou no Console:
# https://console.cloud.google.com/cloud-build/builds?project=SEU_PROJECT_ID
```

## Resultado Final

- **Arquivo**: `gs://SEU_BUCKET/ss-seguros-reel.mp4`
- **URL pública**: `https://storage.googleapis.com/BUCKET/ss-seguros-reel.mp4`
- **Duração**: ~96s (1:36)
- **Resolução**: 1080x1920 (9:16)

## Troubleshooting

| Erro | Solução |
|------|---------|
| `PERMISSION_DENIED` | Rode `gcloud auth application-default login` |
| `BILLING_NOT_ENABLED` | Ative billing no console do projeto |
| `QUOTA_EXCEEDED` | Peça aumento de quota Cloud Build / Compute |
| `ENOSPC` local | Use este deploy - roda 100% na nuvem |

## Custos Estimados

| Recurso | Custo (aprox) |
|---------|---------------|
| Cloud Build (2h, 8 vCPU) | ~$0.50 |
| Cloud Storage (10MB) | <$0.01/mês |
| **Total** | **~$0.50 por render** |

## Arquivos Gerados

```
ss-seguros-video/
├── Dockerfile          # Container para Cloud Build
├── cloudbuild.yaml     # Pipeline de build
├── deploy.sh           # Linux/Mac
├── deploy.bat          # Windows
└── DEPLOY_GUIDE.md     # Este arquivo
```