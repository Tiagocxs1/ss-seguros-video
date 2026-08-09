import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";
import { Glow } from "../components/Background";

const steps = [
  { icon: "⚠️", label: "Alarme\ndisparado" },
  { icon: "🎛️", label: "Central\nanalisa" },
  { icon: "👮", label: "Polícia\nacionada" },
  { icon: "✅", label: "Tudo\nresolvido" },
];

const Step: React.FC<{
  icon: string;
  label: string;
  index: number;
  active: boolean;
}> = ({ icon, label, index, active }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [index * 10, index * 10 + 8], [0.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: active ? 1 : opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        width: "20%",
      }}
    >
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          border: `3px solid ${active ? colors.ciano : colors.grafite}`,
          backgroundColor: active ? `${colors.ciano}22` : "rgba(2,38,54,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          boxShadow: active ? `0 0 40px ${colors.ciano}55` : "none",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 32,
          color: active ? colors.branco : colors.grafite,
          textAlign: "center",
          lineHeight: 1.2,
          whiteSpace: "pre-line",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const SceneProcesso: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [4, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const activeIndex = Math.min(
    3,
    Math.floor((frame - 20) / 18),
  );
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        gap: 60,
      }}
    >
      <Glow color={colors.ciano} size={750} opacity={0.15} />
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 68,
          color: colors.branco,
          textAlign: "center",
        }}
      >
        Ao menor sinal,
        <br />
        <span style={{ color: colors.ciano }}>ação em segundos</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {steps.map((s, i) => (
          <Step key={s.label} {...s} index={i} active={i === activeIndex && frame > 20} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
