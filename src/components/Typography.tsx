import { useCurrentFrame, interpolate } from "remotion";
import { colors, fontWeights, FONT_FAMILY } from "../theme";

interface KineticWord {
  word: string;
  isHighlight: boolean;
  startFrame: number;
  endFrame: number;
}

interface KineticTypographyProps {
  words: KineticWord[];
  baseSize?: number;
  lineHeight?: number;
  maxWidth?: number;
  yPosition?: number;
  centerHorizontal?: boolean;
}

const POP_IN_DURATION = 8;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  words,
  baseSize = 60,
  lineHeight = 1.15,
  maxWidth = 940,
  yPosition = 1400,
  centerHorizontal = true,
}) => {
  const frame = useCurrentFrame();

  const renderedWords = words.map(({ word, isHighlight, startFrame, endFrame }) => {
    const localProgress = interpolate(
      frame,
      [startFrame, startFrame + POP_IN_DURATION],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const eased = easeOutCubic(localProgress);
    const scale = 0.92 + 0.08 * eased;
    const opacity = eased;

    if (frame < startFrame) return null;
    if (frame >= endFrame) return null;

    const fontWeight = isHighlight ? fontWeights.extraBold : fontWeights.medium;
    const fontSize = isHighlight ? baseSize * 1.03 : baseSize;
    const tracking = isHighlight ? "-0.03em" : "-0.01em";

    return (
      <span
        key={`${word}-${startFrame}`}
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight,
          fontSize,
          letterSpacing: tracking,
          color: colors.branco,
          lineHeight,
          textShadow: `
            0 0 ${isHighlight ? 18 : 8}px rgba(255,255,255,${isHighlight ? 0.45 : 0.25}),
            0 ${isHighlight ? 3 : 2}px ${isHighlight ? 10 : 6}px rgba(0,0,0,${isHighlight ? 0.55 : 0.35}),
            0 0 ${isHighlight ? 30 : 12}px rgba(255,255,255,${isHighlight ? 0.35 : 0.15})
          `,
          transform: `scale(${scale})`,
          opacity,
          display: "inline-block",
          marginRight: "0.12em",
          willChange: "transform, opacity",
        }}
      >
        {word}
      </span>
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        left: centerHorizontal ? "50%" : "7%",
        top: yPosition,
        transform: centerHorizontal ? "translateX(-50%)" : "none",
        maxWidth,
        textAlign: "center",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {renderedWords}
    </div>
  );
};

export const SectionTitle: React.FC<{
  text: string;
  highlightWords: string[];
  size?: number;
  yPosition?: number;
  startFrame?: number;
  duration?: number;
}> = ({
  text,
  highlightWords,
  size = 68,
  yPosition = 1300,
  startFrame = 0,
  duration = 90,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const words = text.split(" ").map((w, i) => ({
    word: w + (i < text.split(" ").length - 1 ? " " : ""),
    isHighlight: highlightWords.some(h => w.toLowerCase().includes(h.toLowerCase())),
    startFrame: startFrame + Math.floor(i * (duration / text.split(" ").length)),
    endFrame: startFrame + duration,
  }));

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: yPosition,
        transform: "translateX(-50%)",
        opacity: progress,
        maxWidth: 940,
        textAlign: "center",
        zIndex: 20,
      }}
    >
      <KineticTypography
        words={words}
        baseSize={size}
        yPosition={0}
        centerHorizontal={false}
      />
    </div>
  );
};

export const AnimatedCounter: React.FC<{
  value: number;
  suffix?: string;
  style?: React.CSSProperties;
  start?: number;
  duration?: number;
}> = ({ value, suffix = "", style, start = 0, duration = 45 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [start, start + duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const eased = 1 - Math.pow(1 - progress, 3);
  const display = Math.round(value * eased).toLocaleString("pt-BR");
  return (
    <span style={{ fontFamily: FONT_FAMILY, fontWeight: fontWeights.extraBold, color: colors.branco, ...style }}>
      {display}
      {suffix}
    </span>
  );
};

export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
}> = ({ children, color = colors.prata, size = 36 }) => (
  <div
    style={{
      fontFamily: FONT_FAMILY,
      fontSize: size,
      fontWeight: fontWeights.medium,
      color,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
}> = ({ children, size = 72, color = colors.branco }) => (
  <div
    style={{
      fontFamily: FONT_FAMILY,
      fontSize: size,
      fontWeight: fontWeights.extraBold,
      color,
      lineHeight: 1.15,
    }}
  >
    {children}
  </div>
);