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

const isLitoImage = (src: string) => src.includes("lito_real_");

// ─── SimpleCaption: word-by-word, stays visible full scene ───────────────────
const SimpleCaption: React.FC<{
  text: string;
  keywords: string[];
  sceneFrame: number;
  sceneDurationSec: number;
  size?: number;
}> = ({ text, keywords, sceneFrame, sceneDurationSec, size = 56 }) => {
  const t = sceneFrame / FPS;
  const WORD_DELAY = 0.5;
  const FADE_IN_DUR = 0.12;
  const FADE_OUT_DUR = 0.5;

  const rawWords = text.split(" ").filter(Boolean);
  const isKw = (w: string) =>
    keywords.some(k => w.toLowerCase().replace(/[.,!?;:()]/g, "") === k.toLowerCase().replace(/[.,!?;:()]/g, ""));

  // Group 2-3 words per chunk
  const chunks: { text: string; isKw: boolean }[] = [];
  let i = 0;
  while (i < rawWords.length) {
    const kwHere = isKw(rawWords[i]);
    if (kwHere && i + 1 < rawWords.length) {
      chunks.push({ text: rawWords[i] + " " + rawWords[i + 1], isKw: true });
      i += 2;
    } else if (i + 2 < rawWords.length) {
      chunks.push({ text: rawWords[i] + " " + rawWords[i + 1] + " " + rawWords[i + 2], isKw: false });
      i += 3;
    } else {
      chunks.push({ text: rawWords[i], isKw: kwHere });
      i += 1;
    }
  }

  const chunkStart = (ci: number) => ci * WORD_DELAY;
  const fadeOutStart = sceneDurationSec - FADE_OUT_DUR;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.3em",
          maxWidth: "85%",
          flexWrap: "wrap",
        }}
      >
        {chunks.map((chunk, ci) => {
          const cs = chunkStart(ci);
          if (t < cs) return null;

          let opacity = 1;
          let scale = 1;

          if (t >= fadeOutStart) {
            const p = Math.min(1, (t - fadeOutStart) / FADE_OUT_DUR);
            opacity = 1 - p;
            scale = 1 - 0.04 * p;
          } else if (t < cs + FADE_IN_DUR) {
            const p = (t - cs) / FADE_IN_DUR;
            opacity = p;
            scale = 0.88 + 0.12 * Easing.bezier(0.34, 1.56, 0.64, 1)(Math.min(p, 1));
          }

          if (opacity < 0.02) return null;

          return (
            <span
              key={ci}
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: chunk.isKw ? fontWeights.black : fontWeights.bold,
                fontSize: size,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: chunk.isKw ? "#ffffff" : "rgba(255,255,255,0.85)",
                textShadow: chunk.isKw
                  ? "0 0 18px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.8)"
                  : "0 0 10px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.7)",
                opacity,
                transform: `scale(${scale})`,
                display: "inline-block",
                willChange: "opacity, transform",
              }}
            >
              {chunk.text}
            </span>
          );
        })}
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
  const sceneDurSec = meta.durationFrames / FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.fundo }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {isLito ? (
          <>
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

      {/* Captions: show for the ENTIRE scene — no outer time guard */}
      {meta.lowerThirds.map((lt, i) => (
        <SimpleCaption
          key={i}
          text={lt.text}
          keywords={lt.keywords}
          sceneFrame={localFrame}
          sceneDurationSec={sceneDurSec}
          size={lt.size}
        />
      ))}
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
      <Audio src={staticFile("audio/trilha.mp3")} volume={0.07} />
      <Audio src={staticFile("audio/narracao_merged.mp3")} volume={1} />

      {sfxTriggers.map((sfx, idx) => (
        <Audio key={idx} src={staticFile(sfx.file)} startFrom={sfx.frame} volume={sfx.volume} />
      ))}

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
