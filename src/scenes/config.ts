export const FPS = 30;
export const HOLD_FRAMES = 14;
export const HOLD_SECONDS = HOLD_FRAMES / FPS;

export type Shot = {
  image: string;
  broll?: string;
  brollVideo?: string;
  type: "talking-head" | "broll-pip" | "kenburns" | "cta" | "stock";
  punchInFrame?: number;
  punchInScale?: number;
  zoomStart?: number;
  zoomEnd?: number;
  pipHeight?: number;
  duration: number;
  transition?: string;
  effect?: string;
};

export type LowerThird = {
  text: string;
  highlightWords: string[];
  startFrame: number;
  duration: number;
  yPosition?: number;
  size?: number;
};

export type SceneConfig = {
  id: string;
  title: string;
  audio: string;
  audioDuration: number;
  shots: Shot[];
  lowerThirds?: LowerThird[];
};

export const scenes = [
  // 1. HOOK - Lito talking head (good image)
  {
    id: "s01",
    title: "HOOK",
    audio: "audio/s01.mp3",
    audioDuration: 5.16,
    shots: [
      { image: "images/lito_real_03.jpg", type: "talking-head", duration: 5.16, zoomStart: 1.0, zoomEnd: 1.05, transition: "corte seco", effect: "impact hit" },
    ],
    lowerThirds: [
      { text: "Você provavelmente viu as notícias sobre o Lito nas últimas semanas", highlightWords: ["notícias", "Lito"], startFrame: 10, duration: 120, yPosition: 1450, size: 58 },
    ],
  },
  // 2. VIDA NORMAL - Aviation B-roll (Pexels vertical)
  {
    id: "s02",
    title: "VIDA NORMAL",
    audio: "audio/s02.mp3",
    audioDuration: 4.32,
    shots: [
      { image: "images/pexels/pexels_aviation_02.jpg", type: "broll-pip", duration: 4.32, pipHeight: 0.5, zoomStart: 1.0, zoomEnd: 1.04, transition: "match cut", effect: "whoosh curto" },
    ],
    lowerThirds: [
      { text: "Um homem ativo, trabalhando, fazendo planos...", highlightWords: ["ativo", "trabalhando", "planos"], startFrame: 10, duration: 100, yPosition: 1450, size: 56 },
    ],
  },
  // 3. VIRADA - Lito close (good image)
  {
    id: "s03",
    title: "VIRADA",
    audio: "audio/s03.mp3",
    audioDuration: 3.456,
    shots: [
      { image: "images/lito_real_11.png", type: "talking-head", duration: 3.456, zoomStart: 1.0, zoomEnd: 1.06, transition: "hard cut", effect: "low boom" },
    ],
    lowerThirds: [
      { text: "Até que a vida dele mudou completamente", highlightWords: ["mudou", "completamente"], startFrame: 10, duration: 90, yPosition: 1450, size: 56 },
    ],
  },
  // 4. REFLEXÃO - Pilot portrait (Pexels vertical)
  {
    id: "s04",
    title: "REFLEXÃO",
    audio: "audio/s04.mp3",
    audioDuration: 3.912,
    shots: [
      { image: "images/pexels/pexels_pilot_01.jpg", type: "talking-head", duration: 3.912, zoomStart: 1.0, zoomEnd: 1.04, transition: "punch in 104%", effect: "hit + pausa" },
    ],
    lowerThirds: [
      { text: "E é aqui que muita gente confunde seguro de vida", highlightWords: ["confunde", "seguro de vida"], startFrame: 10, duration: 100, yPosition: 1450, size: 54 },
    ],
  },
  // 5. FRASE-CHAVE - Lito (good image)
  {
    id: "s05",
    title: "FRASE-CHAVE",
    audio: "audio/s05.mp3",
    audioDuration: 3.384,
    shots: [
      { image: "images/lito_real_05.png", type: "talking-head", duration: 3.384, zoomStart: 1.0, zoomEnd: 1.03, transition: "corte para preto", effect: "bass hit" },
    ],
    lowerThirds: [
      { text: "Seguro de vida não é só para o fim", highlightWords: ["não é só", "para o fim"], startFrame: 10, duration: 90, yPosition: 1450, size: 56 },
    ],
  },
  // 6. EXPLICAÇÃO - Aviation mechanic (Pexels vertical)
  {
    id: "s06",
    title: "EXPLICAÇÃO",
    audio: "audio/s06.mp3",
    audioDuration: 5.568,
    shots: [
      { image: "images/pexels/pexels_aviation_05.jpg", type: "broll-pip", duration: 5.568, pipHeight: 0.5, zoomStart: 1.0, zoomEnd: 1.05, transition: "dissolve curto", effect: "soft pulse" },
    ],
    lowerThirds: [
      { text: "Dependendo da apólice, existe também cobertura para doenças graves", highlightWords: ["apólice", "cobertura", "doenças graves"], startFrame: 10, duration: 140, yPosition: 1450, size: 52 },
    ],
  },
  // 7. CONSEQUÊNCIA - Lito hospital (good image)
  {
    id: "s07",
    title: "CONSEQUÊNCIA",
    audio: "audio/s07.mp3",
    audioDuration: 3.36,
    shots: [
      { image: "images/lito_real_09.jpg", type: "talking-head", duration: 3.36, zoomStart: 1.0, zoomEnd: 1.05, transition: "cut", effect: "sub hit" },
    ],
    lowerThirds: [
      { text: "E isso pode fazer uma diferença enorme", highlightWords: ["diferença", "enorme"], startFrame: 10, duration: 90, yPosition: 1450, size: 56 },
    ],
  },
  // 8. PROBLEMA - Hospital (Pexels vertical)
  {
    id: "s08",
    title: "PROBLEMA",
    audio: "audio/s08.mp3",
    audioDuration: 3.816,
    shots: [
      { image: "images/pexels/pexels_hospital_01.jpg", type: "broll-pip", duration: 3.816, pipHeight: 0.55, zoomStart: 1.0, zoomEnd: 1.04, transition: "hard cut", effect: "heartbeat baixo" },
    ],
    lowerThirds: [
      { text: "Porque uma doença grave não traz só o tratamento", highlightWords: ["doença grave", "não traz só", "tratamento"], startFrame: 10, duration: 100, yPosition: 1450, size: 54 },
    ],
  },
  // 9. RENDA - Family (Pexels vertical)
  {
    id: "s09",
    title: "RENDA",
    audio: "audio/s09.mp3",
    audioDuration: 3.192,
    shots: [
      { image: "images/pexels/pexels_family_02.jpg", type: "broll-pip", duration: 3.192, pipHeight: 0.5, zoomStart: 1.0, zoomEnd: 1.03, transition: "cut no beat", effect: "tick" },
    ],
    lowerThirds: [
      { text: "Pode trazer afastamento do trabalho", highlightWords: ["afastamento", "trabalho"], startFrame: 10, duration: 80, yPosition: 1450, size: 56 },
    ],
  },
  // 10. FAMÍLIA - Family dinner (Pexels vertical)
  {
    id: "s10",
    title: "FAMÍLIA",
    audio: "audio/s10.mp3",
    audioDuration: 3.12,
    shots: [
      { image: "images/pexels/pexels_family_03.jpg", type: "broll-pip", duration: 3.12, pipHeight: 0.5, zoomStart: 1.0, zoomEnd: 1.04, transition: "dissolve", effect: "soft impact" },
    ],
    lowerThirds: [
      { text: "Pode mudar toda a rotina da família", highlightWords: ["mudar", "rotina", "família"], startFrame: 10, duration: 80, yPosition: 1450, size: 54 },
    ],
  },
  // 11. CUSTOS - Lito (good image)
  {
    id: "s11",
    title: "CUSTOS",
    audio: "audio/s11.mp3",
    audioDuration: 4.272,
    shots: [
      { image: "images/lito_real_06.jpg", type: "talking-head", duration: 4.272, zoomStart: 1.0, zoomEnd: 1.05, transition: "push in", effect: "low boom" },
    ],
    lowerThirds: [
      { text: "Pode exigir cuidador, adaptações e muito mais", highlightWords: ["cuidador", "adaptações", "muito mais"], startFrame: 10, duration: 110, yPosition: 1450, size: 52 },
    ],
  },
  // 12. VIRADA 2 - Pilot uniform (Pexels vertical)
  {
    id: "s12",
    title: "VIRADA 2",
    audio: "audio/s12.mp3",
    audioDuration: 4.08,
    shots: [
      { image: "images/pexels/pexels_pilot_02.jpg", type: "broll-pip", duration: 4.08, pipHeight: 0.5, zoomStart: 1.0, zoomEnd: 1.04, transition: "match cut", effect: "riser curto" },
    ],
    lowerThirds: [
      { text: "E é justamente aí que entra a proteção financeira", highlightWords: ["proteção financeira"], startFrame: 10, duration: 100, yPosition: 1450, size: 56 },
    ],
  },
  // 13. EDUCAÇÃO - Aviation (Pexels vertical)
  {
    id: "s13",
    title: "EDUCAÇÃO",
    audio: "audio/s13.mp3",
    audioDuration: 6.216,
    shots: [
      { image: "images/pexels/pexels_aviation_02.jpg", type: "broll-pip", duration: 6.216, pipHeight: 0.48, zoomStart: 1.0, zoomEnd: 1.06, transition: "digital zoom", effect: "soft hit" },
    ],
    lowerThirds: [
      { text: "A cobertura de doenças graves pode pagar uma indenização em vida, conforme o contrato", highlightWords: ["cobertura", "indenização em vida", "contrato"], startFrame: 10, duration: 160, yPosition: 1450, size: 50 },
    ],
  },
  // 14. BENEFÍCIO - Lito (good image)
  {
    id: "s14",
    title: "BENEFÍCIO",
    audio: "audio/s14.mp3",
    audioDuration: 3.816,
    shots: [
      { image: "images/lito_real_07.jpg", type: "talking-head", duration: 3.816, zoomStart: 1.0, zoomEnd: 1.04, transition: "slow push", effect: "warm hit" },
    ],
    lowerThirds: [
      { text: "Um recurso para ajudar você a reorganizar a vida", highlightWords: ["recurso", "reorganizar", "vida"], startFrame: 10, duration: 100, yPosition: 1450, size: 54 },
    ],
  },
  // 15. EMOÇÃO - Family (Pexels vertical)
  {
    id: "s15",
    title: "EMOÇÃO",
    audio: "audio/s15.mp3",
    audioDuration: 4.056,
    shots: [
      { image: "images/pexels/pexels_family_04.jpg", type: "broll-pip", duration: 4.056, pipHeight: 0.52, zoomStart: 1.0, zoomEnd: 1.04, transition: "dissolve", effect: "heartbeat + breath" },
    ],
    lowerThirds: [
      { text: "Quando sua prioridade deveria ser cuidar da saúde", highlightWords: ["prioridade", "cuidar da saúde"], startFrame: 10, duration: 100, yPosition: 1450, size: 56 },
    ],
  },
  // 16. CLÍMAX - Lito (good image)
  {
    id: "s16",
    title: "CLÍMAX",
    audio: "audio/s16.mp3",
    audioDuration: 3.288,
    shots: [
      { image: "images/lito_real_08.jpg", type: "talking-head", duration: 3.288, zoomStart: 1.0, zoomEnd: 1.05, transition: "hard cut", effect: "impact + silêncio" },
    ],
    lowerThirds: [
      { text: "Não descobrir como pagar as contas", highlightWords: ["não descobrir", "pagar as contas"], startFrame: 10, duration: 90, yPosition: 1450, size: 58 },
    ],
  },
  // 17. FRASE DE IMPACTO - Hospital (Pexels vertical)
  {
    id: "s17",
    title: "FRASE DE IMPACTO",
    audio: "audio/s17.mp3",
    audioDuration: 3.984,
    shots: [
      { image: "images/pexels/pexels_hospital_01.jpg", type: "talking-head", duration: 3.984, zoomStart: 1.0, zoomEnd: 1.04, transition: "slow zoom", effect: "low boom" },
    ],
    lowerThirds: [
      { text: "Ninguém escolhe quando uma doença grave vai aparecer", highlightWords: ["ninguém escolhe", "doença grave", "aparecer"], startFrame: 10, duration: 100, yPosition: 1450, size: 56 },
    ],
  },
  // 18. RESPOSTA - Family walking (Pexels vertical)
  {
    id: "s18",
    title: "RESPOSTA",
    audio: "audio/s18.mp3",
    audioDuration: 4.848,
    shots: [
      { image: "images/pexels/pexels_family_05.jpg", type: "broll-pip", duration: 4.848, pipHeight: 0.5, zoomStart: 1.0, zoomEnd: 1.04, transition: "dissolve", effect: "riser" },
    ],
    lowerThirds: [
      { text: "Mas você pode escolher estar financeiramente preparado para ela", highlightWords: ["escolher", "financeiramente preparado"], startFrame: 10, duration: 120, yPosition: 1450, size: 54 },
    ],
  },
  // 19. MENSAGEM - Lito (good image)
  {
    id: "s19",
    title: "MENSAGEM",
    audio: "audio/s19.mp3",
    audioDuration: 3.336,
    shots: [
      { image: "images/lito_real_14.png", type: "talking-head", duration: 3.336, zoomStart: 1.0, zoomEnd: 1.03, transition: "match cut", effect: "soft hit" },
    ],
    lowerThirds: [
      { text: "Seguro de vida é se antecipar ao imprevisto", highlightWords: ["se antecipar", "imprevisto"], startFrame: 10, duration: 90, yPosition: 1450, size: 56 },
    ],
  },
  // 20. FECHAMENTO - Family hug (Pexels vertical)
  {
    id: "s20",
    title: "FECHAMENTO",
    audio: "audio/s20.mp3",
    audioDuration: 4.536,
    shots: [
      { image: "images/pexels/pexels_family_06.jpg", type: "broll-pip", duration: 4.536, pipHeight: 0.5, zoomStart: 1.0, zoomEnd: 1.03, transition: "slow dissolve", effect: "music swell" },
    ],
    lowerThirds: [
      { text: "É proteger o que importa enquanto você ainda pode cuidar de tudo", highlightWords: ["proteger", "importa", "cuidar de tudo"], startFrame: 10, duration: 120, yPosition: 1450, size: 54 },
    ],
  },
  // 21. CTA - S&S Seguros brand (Lito final)
  {
    id: "s21",
    title: "CTA",
    audio: "audio/s21.mp3",
    audioDuration: 5.184,
    shots: [
      { image: "images/lito_real_04.png", type: "cta", duration: 5.184, zoomStart: 1.0, zoomEnd: 1.02, transition: "fade", effect: "chime final" },
    ],
    lowerThirds: [
      { text: "S&S Seguros. Seguro de vida. Seguro doenças graves.", highlightWords: ["S&S Seguros", "Seguro de vida", "doenças graves"], startFrame: 10, duration: 100, yPosition: 1250, size: 58 },
      { text: "Converse com um especialista sobre seguro de vida e doenças graves", highlightWords: ["especialista", "seguro de vida", "doenças graves"], startFrame: 110, duration: 100, yPosition: 1400, size: 52 },
    ],
  },
];

export const sceneDurationFrames = (sc: any): number =>
  Math.round(sc.shots.reduce((a, s) => a + s.duration, 0) * 30) + 14;

export const totalDurationFrames = (): number =>
  scenes.reduce((acc, sc) => acc + sceneDurationFrames(sc), 0);

export const sceneStartFrame = (index: number): number =>
  scenes.slice(0, index).reduce((acc, sc) => acc + sceneDurationFrames(sc), 0);

export const TRILHA = "audio/trilha.mp3";