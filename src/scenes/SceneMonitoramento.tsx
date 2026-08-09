import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";
import { Glow } from "../components/Background";

const pad = (n: number) => String(n).padStart(2, "0");

export const SceneMonitoramento: React.FC = () => {
  const frame = useCurrentFrame();
  const seconds = Math.floor(interpolate(frame, [10, 30], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const titleOpacity = interpolate(frame, [30, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity = interpolate(frame, [5, 15], [0, 1], {
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
      <Glow color={colors.ciano} size={700} opacity={0.16} />
      <div
        style={{
          opacity: labelOpacity,
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 4,
          color: colors.ciano,
          border: `2px solid ${colors.ciano}88`,
          borderRadius: 999,
          padding: "16px 52px",
          backgroundColor: `${colors.azul}55`,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            backgroundColor: colors.vermelho,
            boxShadow: `0 0 24px ${colors.vermelho}`,
            display: "inline-block",
            animation: "none",
          }}
        />
        MONITORAMENTO 24H
      </div>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 190,
          color: colors.branco,
          letterSpacing: 4,
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          textShadow: "0 0 50px rgba(0,255,255,0.5)",
        }}
      >
        <span style={{ color: colors.ciano }}>00:</span>
        {pad(seconds)}
      </div>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 500,
          fontSize: 40,
          color: colors.grafite,
          letterSpacing: 2,
          marginTop: -24,
        }}
      >
        TEMPO MÉDIO DE RESPOSTA
      </div>
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 52,
          color: colors.branco,
          textAlign: "center",
          lineHeight: 1.25,
          marginTop: 10,
        }}
      >
        Alarme e imagem, 24 horas por dia,
        <br />
        com <span style={{ color: colors.ciano }}>resposta imediata</span>
      </div>
    </AbsoluteFill>
  );
};
