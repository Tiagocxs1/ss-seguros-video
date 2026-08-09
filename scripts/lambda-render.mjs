// Script de RENDER via Remotion Lambda.
// Divide o video em chunks paralelos na AWS e baixa o MP4 final.
// Requer: AWS creds + funcao Lambda + site deployados (rodar lambda:setup antes).
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { renderMediaOnLambda, getRenderProgress, downloadMedia } from "@remotion/lambda";
import { region, functionName, compositionId, outDir, renderSettings } from "./lambda-config.mjs";

const serveUrlEnvFile = resolve(process.cwd(), ".lambda-serve-url");
const serveUrl =
  process.env.REMOTION_SERVE_URL ??
  (existsSync(serveUrlEnvFile) ? readFileSync(serveUrlEnvFile, "utf8").trim() : "");

function check() {
  const missing = [];
  if (!process.env.AWS_ACCESS_KEY_ID) missing.push("AWS_ACCESS_KEY_ID");
  if (!process.env.AWS_SECRET_ACCESS_KEY) missing.push("AWS_SECRET_ACCESS_KEY");
  if (!serveUrl) missing.push("REMOTION_SERVE_URL (rode npm run lambda:setup)");
  if (missing.length) {
    console.error(`[ERRO] Faltam: ${missing.join(", ")}`);
    process.exit(1);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  check();
  const startedAt = Date.now();

  console.log(`[1/3] Iniciando render na Lambda (${functionName} @ ${region})...`);
  console.log(`  composition: ${compositionId} | serveUrl: ${serveUrl}`);
  const { renderId, bucketName } = await renderMediaOnLambda({
    region,
    functionName,
    serveUrl,
    composition: compositionId,
    codec: renderSettings.codec,
    crf: renderSettings.crf,
    maxRetries: renderSettings.maxRetries,
    timeoutInMilliseconds: renderSettings.timeoutInMilliseconds,
    framesPerLambda: 120,
    inputProps: {},
  });
  console.log(`  renderId: ${renderId} | bucket: ${bucketName}`);

  console.log("[2/3] Acompanhando progresso...");
  let lastLog = -1;
  for (;;) {
    const progress = await getRenderProgress({ renderId, bucketName, functionName, region });
    const pct = progress.overallProgress ?? 0;
    if (pct >= 1) break;
    if (Math.floor(pct * 20) > lastLog) {
      lastLog = Math.floor(pct * 20);
      console.log(`  progresso: ${Math.round(pct * 100)}%`);
    }
    await sleep(4000);
  }

  console.log("[3/3] Render concluido na nuvem. Baixando MP4...");
  const outputPath = resolve(process.cwd(), outDir, "guardian-promo-lambda.mp4");
  await downloadMedia({
    region,
    bucketName,
    renderId,
    functionName,
    outPath: outputPath,
    onProgress: ({ downloaded, total }) => {
      const pct = total ? Math.round((downloaded / total) * 100) : 0;
      process.stdout.write(`  download: ${pct}%\r`);
    },
  });

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`\n[FEITO] Video baixado em ${outputPath} (${elapsed}s no total, incluindo download).`);
  console.log("Comparacao local: ~630s | Lambda: tipicamente < 60s");
}

main().catch((err) => {
  console.error("[ERRO]", err?.message ?? err);
  process.exit(1);
});
