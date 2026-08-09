import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";
import { Glow } from "../components/Background";

const pulse = (frame: number) => 0.6 + 0.4 * Math.sin(frame / 3);

export const SceneVeiculo: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [4, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mapOpacity = interpolate(frame, [8, 18], [0, 1], {
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
      <Glow color={colors.ciano} size={700} opacity={0.15} />
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
        E para o seu carro,
        <br />
        <span style={{ color: colors.ciano }}>rastreamento em tempo real</span>
      </div>
      <div
        style={{
          opacity: mapOpacity,
          width: "100%",
          borderRadius: 32,
          border: `2px solid ${colors.ciano}55`,
          backgroundColor: "rgba(2,38,54,0.78)",
          position: "relative",
          overflow: "hidden",
          aspectRatio: "1.25",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.25,
            backgroundImage:
              "linear-gradient(rgba(0,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
        <svg
          viewBox="0 0 500 400"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <path
            d="M40 320 C 120 300, 150 220, 220 210 S 340 240, 420 150"
            fill="none"
            stroke={colors.ciano}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="14 14"
            opacity={pulse(frame)}
          />
          <circle cx="40" cy="320" r="14" fill={colors.vermelho} />
          <circle cx="420" cy="150" r="16" fill={colors.ciano}>
            <animate attributeName="r" values="12;22;12" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </svg>
        <div
          style={{
            position: "absolute",
            right: 34,
            top: 34,
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 44,
            color: colors.ciano,
            letterSpacing: 2,
          }}
        >
          GPS ●
        </div>
      </div>
    </AbsoluteFill>
  );
};
