import { loadFont as loadSora } from "@remotion/google-fonts/Sora";

export const FONT_FAMILY = "Sora";

export const colors = {
  azul: "#04344C",
  ciano: "#00FFFF",
  grafite: "#506A76",
  vermelho: "#CB3033",
  branco: "#FFFFFF",
  fundo: "#022636",
  fundoEscuro: "#01151F",
};

export const loadFont = async (): Promise<void> => {
  await loadSora();
};
