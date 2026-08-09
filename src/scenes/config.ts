export const FPS = 30;

export type SceneConfig = {
  id: string;
  title: string;
  audio: string;
  audioDuration: number;
  image: string;
  imagePosition?: "center" | "cover";
};

export const HOLD_FRAMES = 14;

const scene = (
  id: string,
  title: string,
  audio: string,
  audioDuration: number,
  image: string,
): SceneConfig => {
  return { id, title, audio, audioDuration, image };
};

export const scenes: SceneConfig[] = [
  scene("s01", "HOOK", "audio/s01.mp3", 3.26, "images/camera1.jpg"),
  scene("s02", "MARCA", "audio/s02.mp3", 6.17, "brand/slide1-home.webp"),
  scene("s03", "MONITORAMENTO", "audio/s03.mp3", 6.41, "images/central-ops.jpg"),
  scene("s04", "NÚMEROS", "audio/s04.mp3", 8.11, "images/control-room.jpg"),
  scene("s05", "SERVIÇOS", "audio/s05.mp3", 6.26, "images/cctv1.jpg"),
  scene("s06", "CONDOMÍNIOS", "audio/s06.mp3", 7.06, "images/condo.jpg"),
  scene("s07", "VEÍCULO", "audio/s07.mp3", 4.46, "images/estrada-noite.jpg"),
  scene("s08", "PROCESSO", "audio/s08.mp3", 5.06, "images/control-room2.jpg"),
  scene("s09", "CASES", "audio/s09.mp3", 7.61, "images/casa-noite1.jpg"),
  scene("s10", "CTA", "audio/s10.mp3", 5.69, "brand/slide1-home.webp"),
];

export const sceneDurationFrames = (sc: SceneConfig): number =>
  Math.round(sc.audioDuration * FPS) + HOLD_FRAMES;

export const totalDurationFrames = (): number => {
  return scenes.reduce((acc, sc) => acc + sceneDurationFrames(sc), 0);
};

export const sceneStartFrame = (index: number): number => {
  return scenes.slice(0, index).reduce((acc, sc) => acc + sceneDurationFrames(sc), 0);
};

export const TRILHA = "audio/trilha.mp3";
