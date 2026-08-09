import { Img, staticFile } from "remotion";

export const GuardianLogo: React.FC<{
  style?: React.CSSProperties;
  variant?: "branco" | "colorido";
}> = ({ style, variant = "colorido" }) => {
  return (
    <Img
      src={staticFile(
        variant === "colorido"
          ? "logo/logo-branco-vermelho.png"
          : "logo/logo-branco.png",
      )}
      style={{
        maxWidth: "70%",
        objectFit: "contain",
        ...style,
      }}
    />
  );
};
