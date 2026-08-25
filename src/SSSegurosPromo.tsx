import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  delayRender,
  continueRender,
  Easing,
} from "remotion";
import { scenes, sceneStartFrame, sceneDurationFrames, totalDurationFrames, FPS, Shot } from "./scenes/config";
import { colors, loadFont, FONT_FAMILY, fontWeights } from "./theme";

const FADE = 8;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// ─── SFX mapping ─────────────────────────────────────────────────────────────
const SFX_MAP: Record<string, { file: string; volume: number }> = {
  "impact hit": { file: "audio/sfx/impact_hit.mp3", volume: 0.8 },
  "whoosh curto": { file: "audio/sfx/whoosh_short.mp3", volume: 0.6 },
  "low boom": { file: "audio/sfx/low_boom.mp3", volume: 0.9 },
  "hit + pausa": { file: "audio/sfx/hit_pause.mp3", volume: 0.7 },
  "bass hit": { file: "audio/sfx/bass_hit.mp3", volume: 0.8 },
  "soft pulse": { file: "audio/sfx/soft_pulse.mp3", volume: 0.5 },
  "sub hit": { file: "audio/sfx/sub_hit.mp3", volume: 0.6 },
  "heartbeat baixo": { file: "audio/sfx/heartbeat_low.mp3", volume: 0.4 },
  "tick": { file: "audio/sfx/tick.mp3", volume: 0.5 },
  "soft impact": { file: "audio/sfx/soft_impact.mp3", volume: 0.5 },
  "riser curto": { file: "audio/sfx/riser_short.mp3", volume: 0.6 },
  "digital zoom": { file: "audio/sfx/digital_zoom.mp3", volume: 0.5 },
  "soft hit": { file: "audio/sfx/soft_hit.mp3", volume: 0.5 },
  "warm hit": { file: "audio/sfx/warm_hit.mp3", volume: 0.5 },
  "heartbeat + breath": { file: "audio/sfx/heartbeat_breath.mp3", volume: 0.4 },
  "impact + silêncio": { file: "audio/sfx/impact_silence.mp3", volume: 0.8 },
  "riser": { file: "audio/sfx/riser.mp3", volume: 0.6 },
  "music swell": { file: "audio/sfx/music_swell.mp3", volume: 0.7 },
  "chime final": { file: "audio/sfx/chime_final.mp3", volume: 0.7 },
};

// Pre-compute all SFX triggers at module level
const sfxTriggers: { frame: number; file: string; volume: number }[] = [];
scenes.forEach((scene, sceneIdx) => {
  const sceneStart = sceneStartFrame(sceneIdx);
  for (const shot of scene.shots) {
    if (shot.effect) {
      const sfx = SFX_MAP[shot.effect.toLowerCase()];
      if (sfx) {
        sfxTriggers.push({ frame: sceneStart, file: sfx.file, volume: sfx.volume });
      }
    }
  }
});

// ─── Scene metadata (pre-computed) ───────────────────────────────────────────
interface SceneMeta {
  id: string;
  index: number;
  startFrame: number;
  durationFrames: number;
  shot: Shot;
  lowerThirds: NonNullable<(typeof scenes)[number]["lowerThirds"]>;
  audio: string;
}
const sceneMetas: SceneMeta[] = scenes.map((scene, i) => ({
  id: scene.id,
  index: i,
  startFrame: sceneStartFrame(i),
  durationFrames: sceneDurationFrames(scene),
  shot: scene.shots[0],
  lowerThirds: scene.lowerThirds || [],
  audio: scene.audio,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isLitoImage = (src: string) => src.includes("lito_real_");

// Split text into chunks of 2-3 words, keeping words of same kw together
function chunkWords(words: string[], keywords: string[]): string[][] {
  const chunks: string[][] = [];
  let i = 0;
  while (i < words.length) {
    const w = words[i];
    const isKw = keywords.some(k => k.toLowerCase() === w.toLowerCase());
    if (isKw && i + 1 < words.length) {
      chunks.push([w, words[i + 1]]);
      i += 2;
    } else if (i + 2 < words.length) {
      chunks.push([words[i], words[i + 1], words[i + 2]]);
      i += 3;
    } else {
      chunks.push([words[i]]);
      i += 1;
    }
  }
  return chunks.filter(c => c.length > 0);
}

// ─── DynamicCaption component ─────────────────────────────────────────────────
// Word-by-word captions: 2–3 words/chunk, fade-in with scale, keyword glow
const DynamicCaption: React.FC<{
  lt: {
    text: string;
    highlightWords: string[];
    keywords: string[];
    startFrame: number;
    duration: number;
    yPosition?: number;
    size?: number;
  };
  sceneFrame: number;
  sceneDurationFrames: number;
}> = ({ lt, sceneFrame, sceneDurationFrames }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const wordRectsRef = React.useRef<{ left: number; width: number }[]>([]);
  const [containerWidth, setContainerWidth] = React.useState(900);
  const rightsRef = React.useRef<number[]>([]);

  const words = lt.text.split(" ").filter(Boolean);
  const chunks = chunkWords(words, lt.keywords);

  // Timing: fixed 0.75s per chunk → all words fit within scene duration
  const chunkTime = 0.75; // seconds per chunk
  const totalDisplayTime = chunks.length * chunkTime;

  type WordTiming = { text: string; start: number; end: number; isKw: boolean };
  const timings: WordTiming[] = chunks.map((chunk, ci) => {
    const chunkWords_lower = chunk.map(w => w.toLowerCase().replace(/[.,!?;:]/g, ""));
    const isKw = lt.keywords.some(k =>
      chunkWords_lower.some(w => w === k.toLowerCase().replace(/[.,!?;:]/g, ""))
    );
    return {
      text: chunk.join(" "),
      start: ci * chunkTime,
      end: (ci + 1) * chunkTime,
      isKw,
    };
  });

  // Track caption mentions
  const mentionsRef = React.useRef(0);
  if (sceneFrame === lt.startFrame + FADE) mentionsRef.current += 1;

  // Measure container on mount
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const allSpans = el.querySelectorAll("[data-word]");
      wordRectsRef.current = Array.from(allSpans).map(s => {
        const r = (s as HTMLElement).getBoundingClientRect();
        const pr = el.parentElement?.getBoundingClientRect();
        return { left: r.left - (pr?.left ?? 0), width: r.width };
      });
      if (el.parentElement) setContainerWidth(el.parentElement.getBoundingClientRect().width);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [lt.text]);

  // Current time relative to scene
  const t = Math.max(0, sceneFrame / FPS);
  const progress = Math.min(t / totalDisplayTime, 1.2);

  // Build caption lines and track word positions
  const lines: { words: { text: string; isKw: boolean; right: number }[] }[] = [];
  let currentLine: { words: { text: string; isKw: boolean; right: number }[] } = { words: [] };
  const MAX_LINE_WIDTH_RATIO = 0.88;
  const LINE_GAP_PX = 12;

  timings.forEach((wt, i) => {
    const rect = wordRectsRef.current[i];
    const wordRight = rect ? rect.left + rect.width : 0;
    if (currentLine.words.length >= 2 && wordRight > currentLine.words[0].right + containerWidth * MAX_LINE_WIDTH_RATIO) {
      lines.push(currentLine);
      currentLine = { words: [] };
    }
    currentLine.words.push({ text: wt.text, isKw: wt.isKw, right: wordRight });
  });
  if (currentLine.words.length > 0) lines.push(currentLine);

  const lineMaxHeight = Math.max(...lines.map(l => l.words.length), 1);
  const captionBlockScale = Math.min(1, (containerWidth * 0.9) / (lines[0]?.words[0]?.right ?? containerWidth));

  const isKw = (w: string) => {
    const wl = w.toLowerCase().replace(/[.,!?;:()]/g, "");
    return lt.keywords.some(k => wl === k.toLowerCase().replace(/[.,!?;:()]/g, ""));
  };

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: LINE_GAP_PX,
          maxWidth: "88%",
        }}
      >
        {lines.map((line, li) => (
          <div
            key={li}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.22em",
              position: "relative",
              padding: "0.15em 0.35em",
            }}
          >
            {/* Text glow (blur layer) */}
            <AbsoluteFill style={{ zIndex: 0, pointerEvents: "none" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.22em",
                  filter: "blur(14px)",
                  opacity: 0.55,
                }}
              >
{/* Main text layer — glow via text-shadow only, no blur filter */}
            {line.words.map((w, wi) => {
              const wordGlobalIdx = lines.slice(0, li).reduce((a, l) => a + l.words.length, 0) + wi;
              const wt = timings[wordGlobalIdx];
              if (!wt) return null;
              const wtStart = wt.start;
              const lastChunkEnd = timings[timings.length - 1].end;
              const fadeInEnd = wtStart + 0.15;
              const wordFadeOutStart = lastChunkEnd + 0.1;
              const blockFadeOutStart = (sceneDurationFrames / FPS) - 0.35;

              let wordOpacity = 0;
              let wordScale = 0.88;

              if (t >= blockFadeOutStart) {
                const fadeP = Math.min(1, (t - blockFadeOutStart) / 0.35);
                wordOpacity = 1 - fadeP;
                wordScale = 1 - 0.06 * fadeP;
              } else if (t >= wordFadeOutStart) {
                wordOpacity = 1;
                wordScale = 1;
              } else if (t >= fadeInEnd) {
                wordOpacity = 1;
                wordScale = 1;
              } else if (t >= wtStart && t < fadeInEnd) {
                const p = (t - wtStart) / (fadeInEnd - wtStart);
                wordOpacity = Math.min(p, 1);
                wordScale = 0.88 + 0.12 * Easing.bezier(0.34, 1.56, 0.64, 1)(Math.min(p, 1));
              }

              if (wordOpacity <= 0.01) return null;

              return (
                <span
                  key={wi}
                  data-word="1"
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: w.isKw ? fontWeights.black : fontWeights.bold,
                    fontSize: lt.size ?? 56,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                    color: w.isKw ? colors.branco : "rgba(255,255,255,0.82)",
                    textShadow: w.isKw
                      ? `0 0 20px rgba(255,255,255,0.4), 0 0 50px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.7)`
                      : "0 0 12px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.7)",
                    opacity: wordOpacity,
                    transform: `scale(${wordScale})`,
                    display: "inline-block",
                    position: "relative",
                    zIndex: 1,
                    willChange: "transform, opacity",
                  }}
                >
                  {w.text}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── SceneComponent ───────────────────────────────────────────────────────────
const SceneComponent: React.FC<{ meta: SceneMeta }> = ({ meta }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - meta.startFrame;
  const progress = localFrame / meta.durationFrames;
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const easedProgress = 1 - Math.pow(1 - clampedProgress, 3);
  const scale = interpolate(easedProgress, [0, 1], [meta.shot.zoomStart ?? 1.0, meta.shot.zoomEnd ?? 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shot = meta.shot;
  const isLito = isLitoImage(shot.image);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.fundo }}>
      {/* Main image - ALWAYS renders for full scene duration */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {isLito ? (
          <>
            {/* Blurred background layer */}
            <AbsoluteFill style={{ zIndex: 0 }}>
              <Img
                src={staticFile(shot.image)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "blur(40px) brightness(0.3)",
                }}
              />
            </AbsoluteFill>
            {/* Foreground: fit-content (contain) */}
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Img
                src={staticFile(shot.image)}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </AbsoluteFill>
          </>
        ) : (
          <Img src={staticFile(shot.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </AbsoluteFill>

      {/* B-roll PiP - positioned in lower zone */}
      {shot.type === "broll-pip" && shot.broll && (
        <AbsoluteFill
          style={{
            top: "46%",
            height: "54%",
            zIndex: 5,
            maskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
          }}
        >
          <Img src={staticFile(shot.broll)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}

      {/* Vignette overlay */}
      <AbsoluteFill
        style={{
          background:
            shot.type === "broll-pip"
              ? `linear-gradient(to top, ${colors.fundo} 0%, transparent 55%)`
              : `linear-gradient(180deg, transparent 35%, ${colors.fundo} 85%)`,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Dynamic word-by-word captions */}
      {meta.lowerThirds.map((lt, i) => {
        const wordStart = lt.startFrame;
        const wordEnd = lt.startFrame + lt.duration;
        if (localFrame < wordStart || localFrame > wordEnd) return null;
        return (
          <DynamicCaption
            key={i}
            lt={lt}
            sceneFrame={localFrame}
            sceneDurationFrames={meta.durationFrames}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const SSSegurosPromo: React.FC = () => {
  const [handle] = React.useState(() => delayRender());
  React.useEffect(() => {
    loadFont().then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.fundo }}>
      {/* Background music */}
      <Audio src={staticFile("audio/trilha.mp3")} volume={0.07} />

      {/* Narração contínua (merged, no gaps) - plays full video */}
      <Audio src={staticFile("audio/narracao_merged.mp3")} volume={1} />

      {/* SFX - one per scene at scene start */}
      {sfxTriggers.map((sfx, idx) => (
        <Audio key={idx} src={staticFile(sfx.file)} startFrom={sfx.frame} volume={sfx.volume} />
      ))}

{/* Scenes - each in its own Sequence (NO per-scene audio, merged covers all) */}
      {sceneMetas.map((meta) => (
        <Sequence
          key={meta.id}
          from={meta.startFrame}
          durationInFrames={meta.durationFrames}
          name={meta.id}
        >
          <SceneComponent meta={meta} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export { totalDurationFrames } from "./scenes/config";