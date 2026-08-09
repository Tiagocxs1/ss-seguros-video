# Remotion Lambda — Guardian Video

Renderização em nuvem (paralela) via AWS Lambda. O vídeo que leva ~10min no
PC renderiza em **segundos a ~1 minuto** na nuvem.

## Status

- [x] `@remotion/lambda@4.0.506` instalado
- [x] Scripts prontos: `npm run lambda:setup`, `npm run lambda:deploy`, `npm run render:lambda`
- [ ] **Credenciais AWS** — pendente (só falta você colar as chaves)

## Pré-requisito: conta AWS

1. Crie conta em https://aws.amazon.com/free (requer cartão de crédito; retém ~US$1 e devolve).
2. Plano **Basic (gratuito)**.

## Como ativar (5 min, uma única vez)

### 1. Criar usuário IAM com chaves

1. Console AWS → **IAM** → **Users** → **Create user** (nome: `remotion`)
2. **Access type**: marque apenas "Programmatic access" (sem console)
3. **Permissions**: anexe a política `AdministratorAccess` (mais simples;
   alternativamente, use a policy mínima do Remotion em
   https://remotion.dev/docs/lambda/permissions)
4. **Create access key** → salve **Access Key ID** e **Secret Access Key**

### 2. Configurar credenciais neste projeto

Crie um arquivo `.env` na raiz do projeto com:

```env
AWS_ACCESS_KEY_ID=AKIA...SEU_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=SEU_SECRET_KEY
AWS_REGION=us-east-1
```

> Alternativa global: instalar o AWS CLI e rodar `aws configure`
> (salva em `~/.aws/credentials`).

### 3. Rodar o setup (deploy da função + site + serveUrl)

```bash
npm run lambda:setup
```

### 4. Renderizar na nuvem

```bash
npm run render:lambda
```

O MP4 final sai em `out/guardian-promo-lambda.mp4`.

## Atualizar o template após mudanças no código

```bash
npm run lambda:deploy   # sobe nova versão do site
npm run render:lambda   # renderiza de novo
```

## Custos (estimativa)

| Item | Custo |
|---|---|
| Licença Remotion Lambda | Gratuita (empresa até 3 funcionários) |
| AWS Lambda | Free tier: 1M requests + 400k GB-s/mês (suficiente para dezenas de vídeos) |
| S3 + CloudWatch + egress | Centavos por vídeo (~R$2–5/mês no total) |
| **Total prático** | **~R$2–5/mês** para volume baixo |

> Regra de custo-eficiência: use Lambda para **volume**. Para um vídeo único,
> `npm run render:fast` local é gratuito e suficiente.

## Troubleshooting

- **`Missing credentials`**: o `.env` não foi carregado. Rode os scripts via
  `node --env-file=.env scripts/lambda-setup.mjs` ou exporte as vars antes.
- **401 no freesound**: irrelevante para render (trilha já baixada localmente).
- **Aumentar memória/CPU**: padrão do Remotion já usa ~2GB/arm. Ver
  `timeoutInMilliseconds` e `framesPerLambda` em `scripts/lambda-render.mjs`.
