import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";
import { Glow } from "../components/Background";

const pulse = (frame: number) => 0.5 + 0.5 * Math.sin(frame / 4);

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [20, 32], [0, 1], {
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
      <Glow color={colors.vermelho} size={700} opacity={0.22} />
      <Glow color={colors.ciano} size={450} opacity={0.14} top={800} left={300} />
      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: 30,
          border: `4px solid ${colors.vermelho}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: pulse(frame),
          boxShadow: `0 0 60px ${colors.vermelho}66`,
        }}
      >
        <div style={{ fontSize: 110, lineHeight: 1 }}>📹</div>
      </div>
      <div
        style={{
          marginTop: 70,
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 92,
          color: colors.branco,
          textAlign: "center",
          lineHeight: 1.12,
          opacity: titleOpacity,
          textShadow: "0 4px 40px rgba(0,0,0,0.6)",
        }}
      >
        Sua casa está
        <br />
        <span style={{ color: colors.vermelho }}>realmente</span> protegida?
      </div>
    </AbsoluteFill>
  );
};
