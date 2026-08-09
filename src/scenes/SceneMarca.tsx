import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";
import { GuardianLogo } from "../components/Logo";
import { Glow } from "../components/Background";

export const SceneMarca: React.FC = () => {
  const frame = useCurrentFrame();
  const logoOpacity = interpolate(frame, [4, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      <Glow color={colors.ciano} size={800} opacity={0.16} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 70,
        }}
      >
        <div style={{ opacity: logoOpacity, display: "flex", justifyContent: "center" }}>
          <GuardianLogo />
        </div>
        <div
          style={{
            opacity: textOpacity,
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 52,
            color: colors.branco,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Mais de{" "}
          <span style={{ color: colors.ciano, fontWeight: 800 }}>20 anos</span> protegendo
          <br />
          patrimônio e família
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 6,
            color: colors.ciano,
            border: `2px solid ${colors.ciano}55`,
            borderRadius: 999,
            padding: "14px 40px",
          }}
        >
          DESDE 2005
        </div>
      </div>
    </AbsoluteFill>
  );
};
