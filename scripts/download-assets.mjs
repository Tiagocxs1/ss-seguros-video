#!/usr/bin/env node
/**
 * Download assets for S&S Seguros video
 * - 14 Lito Sousa real images (from temp folder)
 * - 20-30 B-roll images/videos from Pexels/Pixabay (vertical 9:16)
 */
import { mkdirSync, writeFileSync, existsSync, copyFileSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = resolve(fileURLToPath(import.meta.url), "..");

const BASE_DIR = resolve(__dirname, "..");
const PUBLIC_DIR = join(BASE_DIR, "public");
const IMAGES_DIR = join(PUBLIC_DIR, "images");
const VIDEOS_DIR = join(PUBLIC_DIR, "videos");

mkdirSync(IMAGES_DIR, { recursive: true });
mkdirSync(VIDEOS_DIR, { recursive: true });

// ─── Lito Sousa REAL images (already downloaded to temp) ──────────────────
const LITO_REAL_SOURCE = "C:\\Users\\Admin\\AppData\\Local\\Temp\\opencode\\video-seguros\\imagens";
const LITO_FILES = [
  "lito_real_01.webp",
  "lito_real_02.jpg",
  "lito_real_03.jpg",
  "lito_real_04.png",
  "lito_real_05.png",
  "lito_real_06.jpg",
  "lito_real_07.jpg",
  "lito_real_08.jpg",
  "lito_real_09.jpg",
  "lito_real_10.jpg",
  "lito_real_11.png",
  "lito_real_12.jpg",
  "lito_real_13.jpg",
  "lito_real_14.png",
];

console.log("📥 Copiando 14 imagens REAIS do Lito Sousa...");
let copied = 0;
for (const fname of LITO_FILES) {
  const src = join(LITO_REAL_SOURCE, fname);
  const dst = join(IMAGES_DIR, fname);
  if (existsSync(src)) {
    copyFileSync(src, dst);
    console.log(`  ✅ ${fname}`);
    copied++;
  } else {
    console.log(`  ⚠️  ${fname} NÃO ENCONTRADO em ${src}`);
  }
}
console.log(`\n✅ ${copied}/14 imagens do Lito copiadas para public/images/`);

// ─── B-roll queries for Pexels/Pixabay (vertical 9:16) ────────────────────
const BROLL_QUERIES = [
  // Emoção / família
  "father son emotional moment",
  "mother comforting child",
  "family hug emotional",
  "father explaining life to son",
  // Médico / hospital
  "doctor patient consultation",
  "hospital corridor medical",
  "medical diagnosis serious",
  "homecare nurse elderly",
  "caregiver helping elderly",
  // Financeiro / proteção
  "financial stress worried",
  "insurance policy signing",
  "family financial protection",
  "shield protection metaphor",
  "umbrella rain protection",
  // Prevenção / saúde
  "routine medical checkup",
  "preventive medicine concept",
  "healthy lifestyle family",
  "prostate exam awareness",
  // Estilo de vida / Brasil
  "brazilian family home",
  "pilot airplane cockpit",
  "mechanic airplane hangar",
  // Ativos gerais verticais
  "vertical portrait emotional",
  "cinematic vertical broll",
];

// ─── Script de download via Pexels API ────────────────────────────────────
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || "";

async function downloadFile(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buffer = await res.arrayBuffer();
    writeFileSync(dest, Buffer.from(buffer));
    return true;
  } catch {
    return false;
  }
}

async function searchPexelsPhotos(query: string, perPage = 5) {
  if (!PEXELS_API_KEY) return [];
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=${perPage}&locale=pt-BR`,
    { headers: { Authorization: PEXELS_API_KEY } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.photos?.map((p: any) => ({
    url: p.src.large,
    id: p.id,
    photographer: p.photographer,
    width: p.width,
    height: p.height,
  })) || [];
}

async function searchPexelsVideos(query: string, perPage = 3) {
  if (!PEXELS_API_KEY) return [];
  const res = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=${perPage}`,
    { headers: { Authorization: PEXELS_API_KEY } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.videos?.map((v: any) => ({
    url: v.video_files.find((f: any) => f.quality === "hd" || f.quality === "sd")?.link || v.video_files[0]?.link,
    id: v.id,
    duration: v.duration,
    width: v.width,
    height: v.height,
  })) || [];
}

async function searchPixabayPhotos(query: string, perPage = 5) {
  if (!PIXABAY_API_KEY) return [];
  const res = await fetch(
    `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&orientation=vertical&per_page=${perPage}&safesearch=true&image_type=photo&lang=pt`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.hits?.map((h: any) => ({
    url: h.largeImageURL,
    id: h.id,
    user: h.user,
    width: h.imageWidth,
    height: h.imageHeight,
  })) || [];
}

async function main() {
  console.log("\n🎬 Iniciando download de B-roll (imagens + vídeos verticais)...\n");

  if (!PEXELS_API_KEY && !PIXABAY_API_KEY) {
    console.log("⚠️  Nenhuma API key configurada (PEXELS_API_KEY / PIXABAY_API_KEY)");
    console.log("   Configure as variáveis de ambiente para baixar B-roll automaticamente.");
    console.log("   Por enquanto, apenas as 14 imagens do Lito foram copiadas.\n");
    return;
  }

  let totalImages = 0;
  let totalVideos = 0;

  for (let i = 0; i < BROLL_QUERIES.length; i++) {
    const query = BROLL_QUERIES[i];
    console.log(`\n🔍 [${i + 1}/${BROLL_QUERIES.length}] ${query}`);

    // Imagens
    if (PEXELS_API_KEY) {
      const photos = await searchPexelsPhotos(query, 3);
      for (const p of photos) {
        if (totalImages >= 20) break;
        const ext = p.url.split(".").pop()?.split("?")[0] || "jpg";
        const fname = `broll_${String(totalImages + 1).padStart(2, "0")}_${p.id}.${ext}`;
        const dst = join(IMAGES_DIR, fname);
        const ok = await downloadFile(p.url, dst);
        if (ok) {
          console.log(`  📸 ${fname} (${p.width}x${p.height}) - ${p.photographer}`);
          totalImages++;
        }
      }
    }

    if (PIXABAY_API_KEY && totalImages < 20) {
      const photos = await searchPixabayPhotos(query, 2);
      for (const p of photos) {
        if (totalImages >= 20) break;
        const ext = p.url.split(".").pop()?.split("?")[0] || "jpg";
        const fname = `broll_${String(totalImages + 1).padStart(2, "0")}_px${p.id}.${ext}`;
        const dst = join(IMAGES_DIR, fname);
        const ok = await downloadFile(p.url, dst);
        if (ok) {
          console.log(`  📸 ${fname} (${p.width}x${p.height}) - ${p.user}`);
          totalImages++;
        }
      }
    }

    // Vídeos
    if (PEXELS_API_KEY && totalVideos < 10) {
      const videos = await searchPexelsVideos(query, 2);
      for (const v of videos) {
        if (totalVideos >= 10) break;
        if (!v.url) continue;
        const ext = v.url.split(".").pop()?.split("?")[0] || "mp4";
        const fname = `broll_vid_${String(totalVideos + 1).padStart(2, "0")}_${v.id}.${ext}`;
        const dst = join(VIDEOS_DIR, fname);
        const ok = await downloadFile(v.url, dst);
        if (ok) {
          console.log(`  🎥 ${fname} (${v.width}x${v.height}, ${v.duration}s)`);
          totalVideos++;
        }
      }
    }

    if (totalImages >= 20 && totalVideos >= 10) break;

    await new Promise(r => setTimeout(r, 300)); // rate limit
  }

  console.log(`\n✅ Download concluído:`);
  console.log(`   📸 ${totalImages} imagens B-roll em public/images/`);
  console.log(`   🎥 ${totalVideos} vídeos B-roll em public/videos/`);
  console.log(`\n📁 Total em public/images/: ${LITO_FILES.length + totalImages} arquivos`);
  console.log(`📁 Total em public/videos/: ${totalVideos} arquivos`);
}

main().catch(console.error);