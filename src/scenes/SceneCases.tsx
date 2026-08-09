import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";
import { Glow } from "../components/Background";

const cases = [
  { name: "Smart Fit", detail: "Academias" },
  { name: "Posto Galo", detail: "Rede de Postos" },
  { name: "Ponta dos Ganchos", detail: "Resort" },
];

export const SceneCases: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [4, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        gap: 46,
      }}
    >
      <Glow color={colors.ciano} size={750} opacity={0.16} />
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 70,
          color: colors.branco,
          textAlign: "center",
        }}
      >
        Grandes operações
        <br />
        <span style={{ color: colors.ciano }}>confiam na Guardian</span>
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
        {cases.map((c, i) => {
          const opacity = interpolate(frame, [14 + i * 10, 24 + i * 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(frame, [14 + i * 10, 24 + i * 10], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={c.name}
              style={{
                opacity,
                transform: `scale(${scale})`,
                width: "94%",
                borderRadius: 26,
                border: `1.5px solid ${colors.ciano}44`,
                backgroundColor: "rgba(2,38,54,0.72)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "28px 40px",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 48,
                  color: colors.branco,
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 32,
                  color: colors.ciano,
                }}
              >
                {c.detail}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
