import { Composition } from "remotion";
import { SSSegurosPromo } from "./SSSegurosPromo";
import { FPS, totalDurationFrames } from "./scenes/config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SSSegurosPromo"
        component={SSSegurosPromo}
        durationInFrames={totalDurationFrames()}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
