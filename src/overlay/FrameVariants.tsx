import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, Img } from "remotion";
import { colors, fontWeights, FONT_FAMILY } from "../theme";
import { sceneStartFrame, sceneDurationFrames, scenes } from "../scenes/config";

const PUNCH_IN_DURATION = 12;
const MICROZOOM_MAX = 1.08;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export interface FrameVariantProps {
  videoSrc?: string;
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  kenBurns?: boolean;
  zoomStart?: number;
  zoomEnd?: number;
  punchInFrame?: number;
  punchInScale?: number;
  pipHeight?: number;
}

export const TalkingHeadFrame: React.FC<FrameVariantProps> = ({
  videoSrc,
  imageSrc,
  title,
  subtitle,
  kenBurns = true,
  zoomStart = 1.0,
  zoomEnd = 1.05,
  punchInFrame,
  punchInScale = 1.12,
}) => {
  const frame = useCurrentFrame();

  const scale = kenBurns
    ? interpolate(
        frame,
        [0, 1800],
        [zoomStart, zoomEnd],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic },
      )
    : 1;

  let punchScale = 1;
  if (punchInFrame !== undefined) {
    const local = frame - punchInFrame;
    if (local >= 0 && local <= 12) {
      const p = local / 12;
      punchScale = 1 + (punchInScale - 1) * (t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)(p / 12);
    }
  }

  const finalScale = scale * punchScale;

  const bgStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    transform: `scale(${finalScale})`,
    transformOrigin: "center center",
    willChange: "transform",
    zIndex: 0,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A1C2E" }}>
      <AbsoluteFill style={bgStyle}>
        {imageSrc ? (
          <img
            src={imageSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : videoSrc ? (
          <video
            src={videoSrc}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <AbsoluteFill style={{ backgroundColor: "#0A1C2E" }} />
        )}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: `linear-gradient(to top, #0A1C2E 0%, transparent 50%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {title && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 280,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: 940,
              textAlign: "center",
              padding: "0 60px",
            }}
          >
            {subtitle && (
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 32,
                  fontWeight: 600,
                  color: "#C0C0C0",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                  textShadow: "0 2px 16px rgba(0,0,0,0.5)",
                }}
              >
                {subtitle}
              </div>
            )}
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 72,
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                textShadow: "0 4px 32px rgba(0,0,0,0.6), 0 0 24px rgba(255,255,255,0.3)",
              }}
            >
              {title}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const BRollPiPFrame: React.FC<{
  videoSrc?: string;
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  pipHeight?: number;
  kenBurns?: boolean;
  zoomStart?: number;
  zoomEnd?: number;
}> = ({
  videoSrc,
  imageSrc,
  title,
  subtitle,
  pipHeight = 0.55,
  kenBurns = true,
  zoomStart = 1.0,
  zoomEnd = 1.06,
}) => {
  const frame = useCurrentFrame();

  const mainScale = interpolate(frame, [0, 1800], [1.0, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });

  const pipScale = interpolate(frame, [0, 1800], [1.0, 1.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#0A1C2E" }}>
      <div
        style={{
          transform: `scale(${1.0})`,
          transformOrigin: "center center",
          willChange: "transform",
          zIndex: 0,
        }}
      >
        <img src={"/images/lito_real_03.jpg"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div
        style={{
          top: "45%",
          height: "55%",
          zIndex: 5,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
        }}
      >
        <div
          style={{
            transform: `scale(${1.0})`,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <img src="/images/lito_real_01.webp" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      <div
        style={{
          top: "45%",
          height: "55%",
          background: "linear-gradient(to top, #0A1C2E 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 6,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 200,
          pointerEvents: "none",
          zIndex: 15,
        }}
      >
        <div style={{ maxWidth: 940, textAlign: "center", padding: "0 60px" }}>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 28,
              fontWeight: 600,
              color: "#C0C0C0",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 12,
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            Subtitle
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 64,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              textShadow: "0 4px 32px rgba(0,0,0,0.6), 0 0 24px rgba(255,255,255,0.3)",
            }}
          >
            Title
          </div>
        </div>
      </div>
    </div>
  );
};

export const KenBurnsOnlyFrame: React.FC<{
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  zoomStart?: number;
  zoomEnd?: number;
}> = ({
  imageSrc,
  title,
  subtitle,
  zoomStart = 1.0,
  zoomEnd = 1.1,
}) => {
  const frame = useCurrentFrame();

  const scale = (frame / 1800) * (1.1 - 1.0) + 1.0;

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#0A1C2E" }}>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
          zIndex: 0,
        }}
      >
        <img src="/images/lito_real_03.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, #0A1C2E 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 940, textAlign: "center", padding: "0 60px" }}>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 30,
              fontWeight: 600,
              color: "#C0C0C0",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 16,
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            Subtitle
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 68,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              textShadow: "0 4px 32px rgba(0,0,0,0.6), 0 0 24px rgba(255,255,255,0.3)",
            }}
          >
            Title
          </div>
        </div>
      </div>
    </div>
  );
};

export const CTAFinalFrame: React.FC<{
  imageSrc?: string;
  title?: string;
  subtitle?: string;
}> = ({
  imageSrc,
  title = "S&S SEGUROS",
  subtitle = "Proteção real. Presença local.",
}) => {
  const frame = useCurrentFrame();

  const pulseScale = 1 + 0.02 * Math.sin(frame * 0.05);

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#0A1C2E" }}>
      <div
        style={{
          opacity: 0.15,
          transform: `scale(${1 + 0.02 * Math.sin(frame * 0.05)})`,
          transformOrigin: "center center",
        }}
      >
        <img src="/images/lito_real_04.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, #0A1C2E 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 10,
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 80,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            textShadow: "0 6px 40px rgba(0,0,0,0.7), 0 0 30px rgba(255,255,255,0.25)",
            marginBottom: 24,
          }}
      >
        S&S SEGUROS
      </div>

      <div
        style={{
          width: 120,
          height: 3,
          background: "linear-gradient(90deg, #C0C0C0, #FFFFFF, #C0C0C0)",
          borderRadius: 2,
          marginBottom: 32,
          boxShadow: "0 0 24px #C0C0C0",
        }}
      />

      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 40,
          fontWeight: 600,
          color: "#E8E8E8",
          letterSpacing: "0.02em",
          lineHeight: 1.3,
          textShadow: "0 2px 16px rgba(0,0,0,0.4)",
        }}
      >
        Proteção real. Presença local.
      </div>
    </div>
  );
};

export const LowerThird: React.FC<{
  text: string;
  highlightWords: string[];
  startFrame: number;
  duration: number;
  yPosition?: number;
  size?: number;
}> = ({
  text,
  highlightWords,
  startFrame,
  duration,
  yPosition = 1420,
  size = 48,
}) => {
  const frame = useCurrentFrame();

  const progress = (frame - startFrame) / 10;
  if (frame < startFrame || frame > startFrame + duration) return null;

  const words = text.split(" ").map((w, i) => ({
    word: w + (i < text.split(" ").length - 1 ? " " : ""),
    isHighlight: highlightWords.some(h => w.toLowerCase().includes(h.toLowerCase())),
    startFrame: startFrame + Math.floor(i * (duration / text.split(" ").length * 0.6)),
    endFrame: startFrame + duration,
  }));

  const progress = Math.max(0, Math.min(1, (frame - startFrame) / 10));
  const eased = 1 - Math.pow(1 - Math.min(1, Math.max(0, progress)), 3);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "1420px",
        transform: "translateX(-50%)",
        opacity: Math.max(0, Math.min(1, (frame - startFrame) / 10)),
        maxWidth: 940,
        textAlign: "center",
        zIndex: 25,
      }}
    >
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 48, lineHeight: 1.15, textAlign: "center" }}>
        {text.split(" ").map((w, i) => {
          const isHighlight = highlightWords.some(h => w.toLowerCase().includes(h.toLowerCase()));
          return (
            <span
              key={i}
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: highlightWords.some(h => w.toLowerCase().includes(h.toLowerCase())) ? 800 : 500,
                fontSize: highlightWords.some(h => w.toLowerCase().includes(h.toLowerCase())) ? 48 * 1.04 : 48,
                letterSpacing: highlightWords.some(h => w.toLowerCase().includes(h.toLowerCase())) ? "-0.03em" : "-0.01em",
                color: "#FFFFFF",
                lineHeight: 1.15,
                textShadow: "0 0 14px rgba(255,255,255,0.45), 0 3px 10px rgba(0,0,0,0.55)",
                transform: "scale(1)",
                opacity: 1,
                display: "inline-block",
                marginRight: "0.13em",
                willChange: "transform, opacity",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const GenericScene = ({ scene }: { scene: any }) => {
  return <div style={{ position: "absolute", inset: 0, backgroundColor: "#0A1C2E" }}>
    <img src={`/images/${scene.image}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0A1C2E 0%, transparent 60%)" }} />
    <div style={{ position: "absolute", left: "50%", top: "1420px", transform: "translateX(-50%)", maxWidth: 940, textAlign: "center", zIndex: 10 }}>
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 48, lineHeight: 1.15, textAlign: "center" }}>
        {text.split(" ").map((w, i) => (
          <span key={i} style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 48,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            lineHeight: 1.15,
            textShadow: "0 0 14px rgba(255,255,255,0.45), 0 3px 10px rgba(0,0,0,0.55)",
            display: "inline-block",
            marginRight: "0.13em",
          }}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );