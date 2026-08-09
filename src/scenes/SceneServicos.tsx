import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";
import { Glow } from "../components/Background";

const services = [
  { icon: "🚨", label: "Alarme de\nIntrusão" },
  { icon: "📹", label: "Câmeras de\nSegurança" },
  { icon: "🚪", label: "Controle de\nAcesso" },
  { icon: "🔥", label: "Alarme de\nIncêndio" },
];

const ServiceCard: React.FC<{
  icon: string;
  label: string;
  start: number;
}> = ({ icon, label, start }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [start, start + 10], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        width: "46%",
        aspectRatio: "1.05",
        borderRadius: 28,
        border: `1.5px solid ${colors.ciano}44`,
        backgroundColor: "rgba(2,38,54,0.72)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: 20,
      }}
    >
      <div style={{ fontSize: 84, lineHeight: 1 }}>{icon}</div>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 40,
          color: colors.branco,
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

export const SceneServicos: React.FC = () => {
  const frame = useCurrentFrame();
  const headOpacity = interpolate(frame, [4, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        gap: 40,
      }}
    >
      <Glow color={colors.ciano} size={700} opacity={0.14} />
      <div
        style={{
          opacity: headOpacity,
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 66,
          color: colors.branco,
          textAlign: "center",
        }}
      >
        Soluções completas
        <br />
        <span style={{ color: colors.ciano }}>para o seu patrimônio</span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
          width: "100%",
        }}
      >
        {services.map((s, i) => (
          <ServiceCard key={s.label} {...s} start={12 + i * 8} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
