// Configuracao central do Remotion Lambda para o projeto Guardian.
// Preencha as variaveis de ambiente abaixo (ou .env) quando tiver as chaves AWS.

export const region = process.env.AWS_REGION ?? "us-east-1";
export const serveUrl = process.env.REMOTION_SERVE_URL;
export const functionName = process.env.REMOTION_FUNCTION_NAME ?? "guardian-video-4-0-506";
export const compositionId = "GuardianPromo";
export const outDir = "out";

export const renderSettings = {
  codec: "h264",
  crf: 18,
  maxRetries: 1,
  timeoutInMilliseconds: 120000,
};
