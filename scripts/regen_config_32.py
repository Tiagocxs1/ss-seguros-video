import csv
from pathlib import Path

csv_path = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\roteiro_lito_merged_v3.csv")
# measured durations
durations = {
 1:5.06,2:4.22,3:3.38,4:3.82,5:3.82,6:3.31,7:5.45,8:5.45,9:3.29,10:3.29,11:3.74,12:3.74,13:3.12,14:3.07,15:3.07,16:4.18,17:3.98,18:3.98,19:6.10,20:6.10,21:3.74,22:3.98,23:3.98,24:3.22,25:3.91,26:3.91,27:4.75,28:4.75,29:4.75,30:3.26,31:3.26,32:4.44
}
# 14 lito reals cycling
lito_reals = [f"lito_real_{i:02d}.{ext}" for i,ext in [(1,'webp'),(2,'jpg'),(3,'jpg'),(4,'png'),(5,'png'),(6,'jpg'),(7,'jpg'),(8,'jpg'),(9,'jpg'),(10,'jpg'),(11,'png'),(12,'jpg'),(13,'jpg'),(14,'png')]]

def lito_for_ordem(o):
    return lito_reals[(o-1) % len(lito_reals)]

# Build TS
lines = []
lines.append("export const FPS = 30;")
lines.append("")
lines.append("export type SceneConfig = {")
lines.append("  id: string;")
lines.append("  title: string;")
lines.append("  audio: string;")
lines.append("  audioDuration: number;")
lines.append("  image: string;")
lines.append("  broll?: string;")
lines.append("  brollVideo?: string;")
lines.append('  type: "talking-head" | "broll-pip" | "kenburns" | "cta" | "stock";')
lines.append("  punchInFrame?: number;")
lines.append("  punchInScale?: number;")
lines.append("  zoomStart?: number;")
lines.append("  zoomEnd?: number;")
lines.append("  pipHeight?: number;")
lines.append("  lowerThirds?: LowerThird[];")
lines.append("};")
lines.append("")
lines.append("export type LowerThird = {")
lines.append("  text: string;")
lines.append("  highlightWords: string[];")
lines.append("  startFrame: number;")
lines.append("  duration: number;")
lines.append("  yPosition?: number;")
lines.append("  size?: number;")
lines.append("};")
lines.append("")
lines.append("export const HOLD_FRAMES = 14;")
lines.append("")
lines.append("const scene = (config: SceneConfig): SceneConfig => config;")
lines.append("")
lines.append("export const scenes: SceneConfig[] = [")

with open(csv_path, encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        ordem = int(row['ordem'])
        funcao = row['funcao'].strip()
        tipo_raw = row['tipo'].strip()
        # map tipo to scene type
        if tipo_raw == "LITO_VIDEO":
            stype = "talking-head" if ordem % 3 == 1 else "broll-pip"
        elif tipo_raw == "LITO_IMAGE":
            stype = "kenburns"
        elif tipo_raw == "STOCK":
            stype = "stock"
        elif tipo_raw == "GRAPHIC":
            stype = "cta"
        else: # EDITORIAL
            stype = "broll-pip"
        dur = durations.get(ordem, 3.5)
        img = lito_for_ordem(ordem)
        # lowerThird from narracao
        nar = row['narracao_exata_tts'].strip().replace('"','\\"')
        # pick 1-2 highlight words: first 2 words capitalized? simple: split and take first 2 words
        words = nar.split()
        highlights = []
        if words:
            highlights.append(words[0].strip('.,'))
            if len(words) > 3:
                highlights.append(words[2].strip('.,'))
        highlights_str = ", ".join([f'"{h}"' for h in highlights[:2]])
        # escape
        lines.append(f'  scene({{')
        lines.append(f'    id: "s{ordem:02d}",')
        lines.append(f'    title: "{funcao}",')
        lines.append(f'    audio: "audio/narracao_{ordem:02d}.mp3",')
        lines.append(f'    audioDuration: {dur:.2f},')
        lines.append(f'    image: "images/{img}",')
        if stype == "broll-pip":
            broll_img = lito_for_ordem(ordem % 14 +1)
            lines.append(f'    broll: "images/{broll_img}",')
            lines.append(f'    pipHeight: 0.52,')
        lines.append(f'    type: "{stype}",')
        lines.append(f'    zoomStart: 1.0,')
        lines.append(f'    zoomEnd: {1.04 + (ordem%3)*0.02:.2f},')
        lines.append(f'    lowerThirds: [')
        lines.append(f'      {{ text: "{nar}", highlightWords: [{highlights_str}], startFrame: 10, duration: 60, yPosition: 1420, size: 48 }},')
        lines.append(f'    ],')
        lines.append(f'  }}),')

lines.append("];")
lines.append("")
lines.append("export const sceneDurationFrames = (sc: SceneConfig): number =>")
lines.append("  Math.round(sc.audioDuration * FPS) + HOLD_FRAMES;")
lines.append("")
lines.append("export const totalDurationFrames = (): number => {")
lines.append("  return scenes.reduce((acc, sc) => acc + sceneDurationFrames(sc), 0);")
lines.append("};")
lines.append("")
lines.append("export const sceneStartFrame = (index: number): number => {")
lines.append("  return scenes.slice(0, index).reduce((acc, sc) => acc + sceneDurationFrames(sc), 0);")
lines.append("};")
lines.append("")
lines.append('export const TRILHA = "audio/trilha.mp3";')

out = Path(r"C:\Users\Admin\Desktop\Projetos\ss-seguros-video\src\scenes\config.ts")
out.write_text("\n".join(lines), encoding='utf-8')
print(f"Wrote {out} with {len(lines)} lines")
print(f"Scenes: 32, total duration ~{sum(durations.values()):.1f}s + holds = {(sum(durations.values())*30 + 32*14)/30:.1f}s ({(sum(durations.values())*30 + 32*14)} frames)")

