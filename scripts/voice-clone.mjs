#!/usr/bin/env node
/**
 * voice-clone.mjs — Clonagem de voz via Fish Audio (free tier s2.1-pro-free).
 *
 * Fluxo:
 *  1. Faz upload da referência para Fish Audio → obtém reference_id
 *  2. Chama /v1/tts com text + reference_id → recebe áudio clonado
 *
 * Uso:
 *  npm run voice:clone -- --voice <id> --text "<texto>"
 *  npm run voice:clone -- --voice <id> --text "<texto>" --out voices/generated/saida.mp3
 *  npm run voice:clone -- --url <audio-url> --text "<texto>"   # URL pública de áudio
 *
 * Pré-requisito:
 *  - FISH_API_KEY no .env (free em https://fish.audio)
 *  - Amostra de referência em voices/examples/<id>/reference.wav ou --url/--file
 *
 * A amostra deve ter 10-30s, voz limpa, sem música/ruído.
 */

import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import { fileURLToPath } from "url";

const VOICES_DIR = path.resolve("voices");
const EXAMPLES_DIR = path.join(VOICES_DIR, "examples");
const GENERATED_DIR = path.join(VOICES_DIR, "generated");
const MODELS_CACHE = path.join(VOICES_DIR, ".fish_models.json");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Carrega .env do projeto ──────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key) env[key] = value;
  }
  return env;
}

const env = loadEnv();
const FISH_API_KEY = env.FISH_API_KEY || process.env.FISH_API_KEY || "";

if (!FISH_API_KEY) {
  console.error("❌ FISH_API_KEY não configurada no .env");
  console.error("   Obtenha gratuitamente em https://fish.audio (signup sem cartão)");
  console.error("   Depois adicione no .env: FISH_API_KEY= sua_key_aqui");
  process.exit(1);
}

// ── HTTP helpers ─────────────────────────────────────────────────────────────
function httpRequest(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.request(url, {
      method: opts.method || "GET",
      timeout: 120_000,
      ...opts,
    }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        resolve({ status: res.statusCode, body: buf, headers: res.headers });
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout (120s)")); });
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

function buildMultipart(parts) {
  const boundary = "----VCMB" + Math.random().toString(36).slice(2, 10);
  const chunks = [];
  for (const p of parts) {
    chunks.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="${p.name}"; filename="${p.filename}"\r\n` +
      `Content-Type: ${p.contentType}\r\n\r\n`
    ));
    chunks.push(p.buffer);
    chunks.push(Buffer.from("\r\n"));
  }
  chunks.push(Buffer.from(`--${boundary}--\r\n`));
  return { boundary, body: Buffer.concat(chunks) };
}

// ── Model cache (evita re-upload da referência toda vez) ─────────────────────
function loadModelCache() {
  try {
    if (fs.existsSync(MODELS_CACHE)) {
      return JSON.parse(fs.readFileSync(MODELS_CACHE, "utf-8"));
    }
  } catch {}
  return {};
}

function saveModelCache(cache) {
  fs.mkdirSync(path.dirname(MODELS_CACHE), { recursive: true });
  fs.writeFileSync(MODELS_CACHE, JSON.stringify(cache, null, 2));
}

function getCachedModelId(voiceId, refPath) {
  const cache = loadModelCache();
  const entry = cache[voiceId];
  if (entry && entry.refPath === refPath && entry.modelId) {
    return entry.modelId;
  }
  return null;
}

function setCachedModelId(voiceId, refPath, modelId) {
  const cache = loadModelCache();
  cache[voiceId] = { refPath, modelId, createdAt: new Date().toISOString() };
  saveModelCache(cache);
}

// ── Fish Audio API ───────────────────────────────────────────────────────────
const FISH_BASE = "https://api.fish.audio";
const FISH_MODEL = "s2.1-pro-free";

async function fishCreateModel(referenceBuffer, filename, transcript = "") {
  const boundary = "----FISHAUDIO" + Math.random().toString(36).slice(2, 10);
  const chunks = [];

  const addFile = (name, buf) => {
    chunks.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${filename}"\r\nContent-Type: audio/wav\r\n\r\n`
    ));
    chunks.push(buf);
    chunks.push(Buffer.from("\r\n"));
  };

  const addField = (name, value) => {
    chunks.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
    ));
  };

  addFile("voices", referenceBuffer);
  addField("title", `voice-${Date.now()}`);
  addField("type", "tts");
  addField("train_mode", "fast");
  addField("enhance_audio_quality", "true");
  addField("visibility", "unlist");
  if (transcript) addField("texts[]", transcript);

  chunks.push(Buffer.from(`--${boundary}--\r\n`));
  const body = Buffer.concat(chunks);

  const result = await httpRequest(`${FISH_BASE}/model`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${FISH_API_KEY}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": body.length,
    },
    body,
  });

  console.log(`   Debug: status=${result.status}, body.len=${result.body.length}`);

  if (result.status < 200 || result.status >= 300) {
    const detail = result.body.toString().slice(0, 200);
    throw new Error(`Fish Audio model create falhou (HTTP ${result.status}): ${detail}`);
  }

  const resp = JSON.parse(result.body.toString("utf-8"));
  return resp._id || resp.id || resp.model_id;
}

async function fishTTS(text, referenceId, opts = {}) {
  const {
    language = "pt",
    temperature = 0.3,
    top_p = 0.5,
    speed = 1.0,
    repetition_penalty = 1.2,
    latency = "normal",
    chunk_length = 300,
    max_new_tokens = 1024,
  } = opts;

  const payload = {
    text,
    reference_id: referenceId,
    model: FISH_MODEL,
    format: "mp3",
    mp3_bitrate: 128,
    sample_rate: 44100,
    temperature,
    top_p,
    speed,
    latency,
    normalize: true,
    chunk_length,
    max_new_tokens,
    repetition_penalty,
    condition_on_previous_chunks: true,
  };

  const body = Buffer.from(JSON.stringify(payload));

  const result = await httpRequest(`${FISH_BASE}/v1/tts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${FISH_API_KEY}`,
      "Content-Type": "application/json",
      "model": FISH_MODEL,
      "Content-Length": body.length,
    },
    body,
  });

  if (result.status !== 200) {
    const detail = result.body.toString().slice(0, 200);
    throw new Error(`Fish Audio TTS falhou (HTTP ${result.status}): ${detail}`);
  }

  if (result.headers["transfer-encoding"] === "chunked" || !result.headers["content-length"]) {
    return result.body; // áudio direto
  }
  return result.body;
}

// ── Fallback: HuggingFace Space ──────────────────────────────────────────────
async function fallbackHFSpace(referencePath, text, language, out) {
  const spaceUrl = "https://hasanbasbunar-voice-cloning-xtts-v2.hf.space";
  console.log(`🔄 Fallback para HF Space: ${spaceUrl}`);

  const { boundary, body } = buildMultipart([
    {
      name: "files",
      filename: path.basename(referencePath),
      contentType: "audio/wav",
      buffer: fs.readFileSync(referencePath),
    },
    {
      name: "data",
      filename: "",
      contentType: "application/json",
      buffer: Buffer.from(JSON.stringify({
        data: [null, text, language || "pt"],
        fn_index: 0,
        session_state: {},
      })),
    },
  ]);

  const result = await httpRequest(`${spaceUrl}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": body.length,
    },
    body,
  });

  if (result.status !== 200) {
    throw new Error(`HF Space retornou HTTP ${result.status}`);
  }

  let resp;
  try { resp = JSON.parse(result.body.toString("utf-8")); } catch {
    throw new Error("Resposta inválida do HF Space");
  }

  const audioData = resp?.data?.[0];
  if (!audioData) throw new Error("Sem áudio na resposta do HF Space");

  let audioBuf;
  if (audioData.startsWith("data:")) {
    audioBuf = Buffer.from(audioData.split(",")[1], "base64");
  } else if (/\.(wav|mp3|ogg)/i.test(audioData)) {
    const dl = await new Promise((resolve) => {
      https.get(audioData, (r) => {
        const chunks = [];
        r.on("data", (c) => chunks.push(c));
        r.on("end", () => resolve(Buffer.concat(chunks)));
      }).on("error", () => resolve(null));
    });
    audioBuf = dl;
  } else {
    audioBuf = Buffer.from(audioData, "base64");
  }

  if (!audioBuf) throw new Error("Não foi possível extrair áudio do HF Space");
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(path.resolve(out), audioBuf);
  return out;
}

// ── Argument parsing ─────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    voice: null, text: null, out: null, url: null, file: null,
    language: "pt", transcript: "",
    temperature: 0.3,
    top_p: 0.5,
    speed: 1.0,
    repetition_penalty: 1.2,
    latency: "normal",
    chunk_length: 300,
    max_new_tokens: 1024,
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if ((a === "--voice" || a === "-v") && args[i + 1]) out.voice = args[++i];
    else if ((a === "--text" || a === "-t") && args[i + 1]) out.text = args[++i];
    else if ((a === "--out" || a === "-o") && args[i + 1]) out.out = args[++i];
    else if ((a === "--url" || a === "-u") && args[i + 1]) out.url = args[++i];
    else if ((a === "--file" || a === "-f") && args[i + 1]) out.file = args[++i];
    else if (a === "--lang" && args[i + 1]) out.language = args[++i];
    else if (a === "--transcript" && args[i + 1]) out.transcript = args[++i];
    else if (a === "--temp" && args[i + 1]) out.temperature = parseFloat(args[++i]);
    else if (a === "--top_p" && args[i + 1]) out.top_p = parseFloat(args[++i]);
    else if (a === "--speed" && args[i + 1]) out.speed = parseFloat(args[++i]);
    else if (a === "--repetition" && args[i + 1]) out.repetition_penalty = parseFloat(args[++i]);
    else if (a === "--latency" && args[i + 1]) out.latency = args[++i];
    else if (a === "--chunk" && args[i + 1]) out.chunk_length = parseInt(args[++i]);
    else if (a === "--max-tokens" && args[i + 1]) out.max_new_tokens = parseInt(args[++i]);
  }
  return out;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const { voice, text, out, url, file, language, transcript,
      temperature, top_p, speed, repetition_penalty, latency, chunk_length, max_new_tokens } = parseArgs();

  if (!text) {
    console.error("Uso: voice-clone.mjs --voice <id> --text \"<texto>\" [--out caminho]");
    console.error("       voice-clone.mjs --url <audio-url> --text \"<texto>\" [--lang pt]");
    console.error("       voice-clone.mjs --file <caminho.wav> --text \"<texto>\" --transcript \"texto falado\"");
    console.error("\nFluxo:");
    console.error("  1. Coloque reference.wav em voices/examples/<id>/");
    console.error("  2. (Opcional) Adicione transcript em voices/examples/<id>/transcript.txt");
    console.error("  3. Rode: npm run voice:clone -- --voice <id> --text \"Seu texto...\"");
    console.error("\nVozes disponibles em voices/examples/:");
    if (fs.existsSync(EXAMPLES_DIR)) {
      const voices = fs.readdirSync(EXAMPLES_DIR).filter((d) =>
        fs.existsSync(path.join(EXAMPLES_DIR, d, "reference.wav"))
      );
      if (voices.length) {
        for (const v of voices) console.error("  ✓", v);
      } else {
        console.error("  (nenhuma. Coloque reference.wav em voices/examples/<id>/)");
      }
    }
    process.exit(1);
  }

  // Resolve áudio de referência
  let referencePath = null;
  let referenceBuffer = null;
  let referenceName = "reference.wav";
  let voiceId = voice || `tmp_${Date.now()}`;

  const resolveReference = async () => {
    if (url) {
      console.log(`⬇️ Baixando áudio: ${url}`);
      referencePath = await new Promise((resolve, reject) => {
        const mod = url.startsWith("https") ? https : http;
        const req = mod.request(url, { method: "GET", timeout: 60_000 }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            resolve(resolveReference()); // redirect
            return;
          }
          const chunks = [];
          const ext = path.extname(new URL(url).pathname) || ".wav";
          const tmp = path.join(__dirname, `tmp_ref_${Date.now()}${ext}`);
          const ws = fs.createWriteStream(tmp);
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            fs.writeFileSync(tmp, Buffer.concat(chunks));
            resolve(tmp);
          });
          res.pipe(ws);
        });
        req.on("error", reject);
        setTimeout(() => { req.destroy(); reject(new Error("Download timeout")); }, 60000);
      });
      referenceName = path.basename(referencePath);
    } else if (file) {
      referencePath = path.resolve(file);
      referenceName = path.basename(referencePath);
      if (!fs.existsSync(referencePath)) {
        console.error(`❌ Arquivo não encontrado: ${referencePath}`);
        process.exit(1);
      }
    } else if (voice) {
      referencePath = path.join(EXAMPLES_DIR, voice, "reference.wav");
      referenceName = `${voice}_reference.wav`;
      if (!fs.existsSync(referencePath)) {
        console.error(
          `❌ voices/examples/${voice}/reference.wav não encontrado.\n` +
          `Coloque um WAV de 10-30s (voz limpa, mono 16kHz) nessa pasta.`
        );
        process.exit(1);
      }

      // Tenta ler transcript.txt opcional
      const transcriptPath = path.join(EXAMPLES_DIR, voice, "transcript.txt");
      if (!transcript && fs.existsSync(transcriptPath)) {
        transcript = fs.readFileSync(transcriptPath, "utf-8").trim();
      }
    } else {
      console.error("❌ Forneça --voice <id>, --url <url> ou --file <caminho>");
      process.exit(1);
    }

    referenceBuffer = fs.readFileSync(referencePath);
    voiceId = voice || path.basename(referencePath, path.extname(referencePath));
  };

  await resolveReference();

  // Verifica cache: se já fizemos upload dessa referência, reutiliza
  const cachedId = getCachedModelId(voiceId, referencePath);
  let referenceId = cachedId;
  const needsUpload = !cachedId;

  if (needsUpload) {
    console.log(`📤 Enviando referência para Fish Audio (modelo: ${FISH_MODEL})...`);
    try {
      referenceId = await fishCreateModel(referenceBuffer, referenceName, transcript);
      setCachedModelId(voiceId, referencePath, referenceId);
      console.log(`✅ Modelo criado: ${referenceId}`);
    } catch (err) {
      console.error(`❌ Falha no upload da referência: ${err.message}`);
      console.error("   Tente novamente ou verifique sua FISH_API_KEY");
      process.exit(1);
    }
  } else {
    console.log(`♻️ Usando modelo em cache: ${referenceId}`);
  }

  // Saída
  const outPath = out || path.join(GENERATED_DIR, `${voiceId}_${Date.now()}.mp3`);

  console.log(`🎙️ Gerando narração...`);
  console.log(`   Modelo: ${FISH_MODEL}`);
  console.log(`   Voice:  ${voiceId}`);
  console.log(`   Lang:   ${language}`);
  console.log(`   Texto:  ${text.slice(0, 80)}${text.length > 80 ? "..." : ""}`);

  try {
    const audioBuf = await fishTTS(text, referenceId, {
      language,
      temperature,
      top_p,
      speed,
      repetition_penalty,
      latency,
      chunk_length,
      max_new_tokens,
    });

    fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outPath), audioBuf);

    const sizeKB = (audioBuf.length / 1024).toFixed(1);
    console.log(`✅ Narração salva: ${outPath} (${sizeKB} KB)`);

    // Duração aproximada
    const duration = audioBuf.length / (44100 * 2); // 16-bit mono ≈ 2 bytes/amostra
    console.log(`   Duração aprox: ${(duration / 60).toFixed(1)} min`);

  } catch (err) {
    console.error(`❌ Falha na geração: ${err.message}`);

    // Fallback para HF Space se Fish falhar
    console.log("🔄 Tentando fallback (HF Space)...");
    try {
      await fallbackHFSpace(referencePath, text, language, outPath);
      console.log(`✅ Fallback OK: ${outPath}`);
    } catch (fallbackErr) {
      console.error(`❌ Fallback também falhou: ${fallbackErr.message}`);
      console.error("\nVerifique:");
      console.error("  1. FISH_API_KEY está válida no .env");
      console.error("  2. A referência é um WAV/MP3 de 10-30s de voz limpa");
      console.error("  3. O texto não está vazio");
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
