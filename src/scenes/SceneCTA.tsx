import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";
import { GuardianLogo } from "../components/Logo";
import { Glow } from "../components/Background";

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const contentOpacity = interpolate(frame, [4, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        gap: 52,
      }}
    >
      <Glow color={colors.vermelho} size={700} opacity={0.14} />
      <Glow color={colors.ciano} size={500} opacity={0.13} top={900} left={250} />
      <div
        style={{
          opacity: contentOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 84,
            color: colors.branco,
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          Proteção real.
          <br />
          <span style={{ color: colors.ciano }}>Presença local.</span>
        </div>
        <GuardianLogo />
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 52,
            color: colors.branco,
            backgroundColor: `${colors.vermelho}`,
            borderRadius: 999,
            padding: "26px 58px",
            letterSpacing: 1,
            boxShadow: `0 0 50px ${colors.vermelho}88`,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <span style={{ fontSize: 52 }}>📞</span>
          (48) 3234-9001
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 34,
            color: colors.grafite,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Chame a Guardian agora
        </div>
      </div>
    </AbsoluteFill>
  );
};
