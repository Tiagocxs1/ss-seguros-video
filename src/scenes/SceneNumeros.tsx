import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, FONT_FAMILY } from "../theme";
import { AnimatedCounter, CounterLabel } from "../components/Typography";
import { Glow } from "../components/Background";

const Stat: React.FC<{
  value: number;
  suffix?: string;
  label: string;
  start: number;
}> = ({ value, suffix, label, start }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        border: `1px solid ${colors.ciano}33`,
        borderRadius: 24,
        padding: "34px 40px",
        backgroundColor: "rgba(2,38,54,0.6)",
        width: "88%",
      }}
    >
      <AnimatedCounter
        value={value}
        suffix={suffix}
        start={start}
        duration={55}
        style={{ fontSize: 120 }}
      />
      <CounterLabel>{label}</CounterLabel>
    </div>
  );
};

export const SceneNumeros: React.FC = () => {
  const frame = useCurrentFrame();
  const headOpacity = interpolate(frame, [4, 14], [0, 1], {
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
      <Glow color={colors.ciano} size={800} opacity={0.14} />
      <div
        style={{
          opacity: headOpacity,
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 60,
          color: colors.branco,
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        Protegendo a
        <br />
        <span style={{ color: colors.ciano }}>Grande Florianópolis</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          width: "100%",
        }}
      >
        <Stat value={24} suffix=" mil" label="CLIENTES" start={8} />
        <Stat value={27} suffix=" mil" label="CÂMERAS" start={22} />
        <Stat value={41} suffix=" mil" label="SENSORES" start={36} />
      </div>
    </AbsoluteFill>
  );
};
