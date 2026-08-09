import { AbsoluteFill, staticFile, Img } from "remotion";
import { colors } from "../theme";

export const TechBackground: React.FC<{
  children: React.ReactNode;
  image?: string;
  overlay?: number;
}> = ({ children, image, overlay = 0.72 }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.fundoEscuro,
        overflow: "hidden",
      }}
    >
      {image ? (
        <AbsoluteFill>
          <Img
            src={staticFile(image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, rgba(2,38,54,${overlay + 0.1}) 0%, rgba(2,38,54,${overlay}) 45%, rgba(1,21,31,0.96) 100%)`,
            }}
          />
        </AbsoluteFill>
      ) : null}
      <TechGrid />
      {children}
    </AbsoluteFill>
  );
};

export const TechGrid: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        opacity: 0.08,
        backgroundImage:
          "linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "90px 90px",
      }}
    />
  );
};

export const Glow: React.FC<{
  color?: string;
  size?: number;
  opacity?: number;
  top?: number;
  left?: number;
}> = ({ color = colors.ciano, size = 500, opacity = 0.18, top = 0, left = 0 }) => {
  return (
    <AbsoluteFill
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        opacity,
        top,
        left,
        filter: "blur(30px)",
      }}
    />
  );
};
