import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";
import { Glow } from "../components/Background";

const items = [
  { icon: "🏢", label: "Portaria Remota 24h" },
  { icon: "📟", label: "Vídeo Porteiro" },
  { icon: "🛰️", label: "Monitoramento Colaborativo" },
];

export const SceneCondominios: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [4, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        gap: 44,
      }}
    >
      <Glow color={colors.ciano} size={750} opacity={0.15} />
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 76,
          color: colors.branco,
          textAlign: "center",
        }}
      >
        Para condomínios,
        <br />
        <span style={{ color: colors.ciano }}>proteção completa</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          width: "100%",
        }}
      >
        {items.map((it, i) => {
          const opacity = interpolate(frame, [14 + i * 10, 24 + i * 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(frame, [14 + i * 10, 24 + i * 10], [-50, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={it.label}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                width: "92%",
                borderRadius: 26,
                border: `1.5px solid ${colors.ciano}44`,
                backgroundColor: "rgba(2,38,54,0.72)",
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "26px 34px",
              }}
            >
              <div style={{ fontSize: 62, lineHeight: 1 }}>{it.icon}</div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: 46,
                  color: colors.branco,
                }}
              >
                {it.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
