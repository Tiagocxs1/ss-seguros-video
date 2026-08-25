# GitHub Actions - Render 100% Free

## Como usar (3 passos):

### 1. Suba para GitHub (se não tem repo)
```bash
cd C:\Users\Admin\Desktop\Projetos\ss-seguros-video
git init
git add .
git commit -m "Initial commit"
gh repo create ss-seguros-video --public --source=. --push
# ou crie no github.com e: git remote add origin ... && git push -u origin main
```

### 2. Rode o workflow
- Vá em: **https://github.com/SEU_USER/ss-seguros-video/actions**
- Clique em **"Render Video"** → **"Run workflow"** → **"Run workflow"**

### 3. Baixe o vídeo
- Espere ~10-15 min
- Na execução, clique em **Artifacts** → **ss-seguros-reel** → download

---

## Limites Free Tier

| Item | Limite |
|------|--------|
| Minutos/mês | 2.000 (público) / variável (privado) |
| Tempo por job | 6 horas |
| Artefatos | 2 GB / 7 dias |
| Concurrentes | 20 jobs |

**Nosso render:** ~15 min = usa ~15 min do quota.

---

## Se repo for privado

GitHub dá minutos grátis para private repos baseado no plano:
- Free: ~500 min/mês
- Pro: 3.000 min/mês
- Team: 10.000 min/mês

---

## Alternativa: GitLab CI (400 min/mês free)

Se estourar quota no GitHub, use `.gitlab-ci.yml` similar.

---

## Dica: Rode local se liberar espaço

O erro `ENOSPC` é só espaço em disco. Se liberar ~10GB no C:, roda local:
```cmd
# Limpeza agressiva
Remove-Item C:\Windows\Temp\* -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item C:\Users\Admin\AppData\Local\Temp\* -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item C:\Users\Admin\AppData\Local\Microsoft\Windows\INetCache\* -Force -Recurse -ErrorAction SilentlyContinue
npm cache clean --force
```

Depois: `npm run render`