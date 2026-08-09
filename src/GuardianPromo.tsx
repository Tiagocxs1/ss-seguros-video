import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  delayRender,
  continueRender,
} from "remotion";
import { scenes, sceneStartFrame, sceneDurationFrames } from "./scenes/config";
import { colors, loadFont } from "./theme";
import { SceneHook } from "./scenes/SceneHook";
import { SceneMarca } from "./scenes/SceneMarca";
import { SceneMonitoramento } from "./scenes/SceneMonitoramento";
import { SceneNumeros } from "./scenes/SceneNumeros";
import { SceneServicos } from "./scenes/SceneServicos";
import { SceneCondominios } from "./scenes/SceneCondominios";
import { SceneVeiculo } from "./scenes/SceneVeiculo";
import { SceneProcesso } from "./scenes/SceneProcesso";
import { SceneCases } from "./scenes/SceneCases";
import { SceneCTA } from "./scenes/SceneCTA";

const FADE = 8;

export const SceneFade: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FADE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

export const SceneShell: React.FC<{
  scene: (typeof scenes)[number];
  children: React.ReactNode;
}> = ({ scene, children }) => {
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(scene.image)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(2,38,54,0.55) 0%, rgba(2,38,54,0.72) 50%, rgba(1,21,31,0.94) 100%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const GuardianPromo: React.FC = () => {
  const [handle] = React.useState(() => delayRender());
  React.useEffect(() => {
    loadFont().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.fundoEscuro }}>
      <Audio src={staticFile("audio/trilha.mp3")} volume={0.16} />
      {scenes.map((scene, i) => {
        return (
          <Sequence
            key={scene.id}
            from={sceneStartFrame(i)}
            durationInFrames={sceneDurationFrames(scene)}
            name={scene.title}
          >
            <SceneFade>
              <SceneShell scene={scene}>
                <SceneComponent scene={scene} />
              </SceneShell>
            </SceneFade>
            <Audio src={staticFile(scene.audio)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneComponent: React.FC<{ scene: (typeof scenes)[number] }> = ({ scene }) => {
  switch (scene.id) {
    case "s01":
      return <SceneHook />;
    case "s02":
      return <SceneMarca />;
    case "s03":
      return <SceneMonitoramento />;
    case "s04":
      return <SceneNumeros />;
    case "s05":
      return <SceneServicos />;
    case "s06":
      return <SceneCondominios />;
    case "s07":
      return <SceneVeiculo />;
    case "s08":
      return <SceneProcesso />;
    case "s09":
      return <SceneCases />;
    case "s10":
      return <SceneCTA />;
    default:
      return null;
  }
};
