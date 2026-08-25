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
} from "remotion";
import { scenes, sceneStartFrame, sceneDurationFrames, totalDurationFrames, FPS, Shot } from "./scenes/config";
import { colors, loadFont, FONT_FAMILY, fontWeights } from "./theme";

const FADE = 8;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// SFX mapping
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
        sfxTriggers.push({
          frame: sceneStart,
          file: sfx.file,
          volume: sfx.volume,
        });
      }
    }
  }
});

// Pre-compute scene metadata for bulletproof rendering
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

// Helper: detect Lito images (horizontal, need fit-content)
const isLitoImage = (src: string) => src.includes("lito_real_");

// SceneComponent with fit-content for Lito images
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
          // LITO IMAGES: fit-content with blurred background
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
            {/* Foreground: fit-content (contain) - shows full horizontal image */}
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
          // PEXELS VERTICAL IMAGES: normal cover
          <Img src={staticFile(shot.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </AbsoluteFill>

      {/* B-roll PiP */}
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

      {/* Lower thirds - kinetic */}
      {meta.lowerThirds.map((lt, i) => {
        if (localFrame < lt.startFrame || localFrame > lt.startFrame + lt.duration) return null;
        const p = interpolate(localFrame, [lt.startFrame, lt.startFrame + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (p <= 0) return null;
        const eased = 1 - Math.pow(1 - p, 3);
        const words = lt.text.split(" ");
        return (
          <AbsoluteFill
            key={i}
            style={{
              left: "50%",
              top: lt.yPosition ?? 1420,
              transform: "translateX(-50%)",
              maxWidth: 940,
              textAlign: "center",
              opacity: eased,
              zIndex: 10,
            }}
          >
            <div style={{ fontFamily: FONT_FAMILY, fontSize: lt.size ?? 48, lineHeight: 1.15, textAlign: "center" }}>
              {words.map((w, wi) => {
                const isH = lt.highlightWords.some((h) => w.toLowerCase().includes(h.toLowerCase().replace(/"/g, "")));
                const wStart = lt.startFrame + Math.floor((wi / words.length) * lt.duration * 0.6);
                const wp = interpolate(localFrame, [wStart, wStart + 8], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                if (wp <= 0) return null;
                const we = 1 - Math.pow(1 - wp, 3);
                return (
                  <span
                    key={wi}
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontWeight: isH ? fontWeights.extraBold : fontWeights.medium,
                      fontSize: isH ? (lt.size ?? 48) * 1.05 : lt.size ?? 48,
                      letterSpacing: isH ? "-0.03em" : "-0.01em",
                      color: colors.branco,
                      textShadow: isH
                        ? "0 0 14px rgba(255,255,255,0.45), 0 3px 10px rgba(0,0,0,0.6)"
                        : "0 2px 8px rgba(0,0,0,0.5)",
                      opacity: we,
                      transform: `scale(${0.92 + 0.08 * we})`,
                      display: "inline-block",
                      marginRight: "0.13em",
                    }}
                  >
                    {w}
                  </span>
                );
              })}
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

export const SSSegurosPromo: React.FC = () => {
  const [handle] = React.useState(() => delayRender());
  React.useEffect(() => {
    loadFont().then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.fundo }}>
      {/* Background music */}
      <Audio src={staticFile("audio/trilha.mp3")} volume={0.07} />

      {/* SFX - one per scene at scene start */}
      {sfxTriggers.map((sfx, idx) => (
        <Audio key={idx} src={staticFile(sfx.file)} startFrom={sfx.frame} volume={sfx.volume} />
      ))}

      {/* Scenes - each in its own Sequence */}
      {sceneMetas.map((meta) => (
        <Sequence
          key={meta.id}
          from={meta.startFrame}
          durationInFrames={meta.durationFrames}
          name={meta.id}
        >
          <SceneComponent meta={meta} />
          <Audio src={staticFile(meta.audio)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export { totalDurationFrames } from "./scenes/config";