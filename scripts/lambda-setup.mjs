// Script de SETUP do Remotion Lambda.
// 1. Deploy da funcao Lambda 2. Deploy do site (bundle) 3. Salva a serveUrl num .env
// Requer AWS credentials configuradas no ambiente (veja LAMBDA_SETUP.md).
import { execSync } from "node:child_process";
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { region, functionName } from "./lambda-config.mjs";

const outDir = "out";
const envFile = resolve(process.cwd(), ".env");
const serveUrlEnvFile = resolve(process.cwd(), ".lambda-serve-url");

function checkEnv() {
  const missing = [];
  if (!process.env.AWS_ACCESS_KEY_ID) missing.push("AWS_ACCESS_KEY_ID");
  if (!process.env.AWS_SECRET_ACCESS_KEY) missing.push("AWS_SECRET_ACCESS_KEY");
  if (missing.length) {
    console.error(
      `[ERRO] Credenciais AWS ausentes: ${missing.join(", ")}.\n` +
        `Crie um .env no projeto ou exporte as variaveis antes de rodar. Veja LAMBDA_SETUP.md.`,
    );
    process.exit(1);
  }
}

function saveServeUrl(url) {
  writeFileSync(serveUrlEnvFile, url.trim(), "utf8");
  console.log(`[OK] serveUrl salva em ${serveUrlEnvFile}`);
  console.log(`[OK] Copie este valor para REMOTION_SERVE_URL ou use .lambda-serve-url automaticamente.`);
  console.log(url.trim());
}

function loadExistingServeUrl() {
  if (existsSync(serveUrlEnvFile)) {
    return readFileSync(serveUrlEnvFile, "utf8").trim();
  }
  return process.env.REMOTION_SERVE_URL;
}

function main() {
  const mode = process.argv[2] ?? "all";
  checkEnv();

  if (mode === "all" || mode === "function") {
    console.log(`[1/3] Deploy da funcao Lambda '${functionName}' em ${region}...`);
    execSync(
      `npx remotion lambda functions deploy --function-name ${functionName} --region ${region}`,
      { stdio: "inherit", shell: true },
    );
  }

  if (mode === "all" || mode === "site") {
    console.log("[2/3] Deploy do site (bundle da composicao)...");
    execSync(`npx remotion lambda sites create --out-dir ${outDir} --site-name guardian --region ${region}`, {
      stdio: "inherit",
      shell: true,
    });
  }

  if (mode === "all" || mode === "url") {
    console.log("[3/3] Obtendo serveUrl do site...");
    const out = execSync(
      `npx remotion lambda sites ls --region ${region} --json`,
      { encoding: "utf8", shell: true },
    );
    let url = loadExistingServeUrl();
    try {
      const sites = JSON.parse(out);
      if (Array.isArray(sites) && sites.length > 0) {
        url = sites[0].serveUrl;
      }
    } catch {
      // fallback para env
    }
    if (url) {
      saveServeUrl(url);
    } else {
      console.warn("[AVISO] Nao foi possivel detectar a serveUrl automaticamente.");
      console.warn("Rode: npx remotion lambda sites ls --region " + region);
      console.warn("E defina REMOTION_SERVE_URL=<url> no ambiente.");
    }
  }

  console.log("\n[FEITO] Setup do Remotion Lambda concluido.");
  console.log("Proximo passo: npm run render:lambda");
}

main();
