export const FONT_FAMILY = "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const colors = {
  // S&S Seguros - identidade principal
  azulMarinho: "#0A1C2E",
  prata: "#C0C0C0",
  branco: "#FFFFFF",
  fundo: "#0A1C2E",
  fundoEscuro: "#06101A",
  prataClaro: "#E8E8E8",
  prataEscuro: "#A0A0A0",
  // aliases para compatibilidade com FrameVariants do Guardian (não usado no principal, mas evita erro de compilação)
  azul: "#0A1C2E",
  ciano: "#C0C0C0",
  grafite: "#8A9BA8",
  vermelho: "#B0B8C0",
};

export const fontWeights = {
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

export const loadFont = async (): Promise<void> => {
  // Inter via system fallback - sem download externo
};