import { useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";

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
    <span style={{ fontFamily: FONT_FAMILY, fontWeight: 800, color: colors.branco, ...style }}>
      {display}
      {suffix}
    </span>
  );
};

export const CounterLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: FONT_FAMILY,
      fontSize: 34,
      fontWeight: 600,
      color: colors.ciano,
      letterSpacing: 1,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
}> = ({ children, color = colors.ciano, size = 36 }) => (
  <div
    style={{
      fontFamily: FONT_FAMILY,
      fontSize: size,
      fontWeight: 600,
      color,
      letterSpacing: 2,
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
      fontWeight: 800,
      color,
      lineHeight: 1.15,
    }}
  >
    {children}
  </div>
);
