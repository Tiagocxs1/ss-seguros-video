import { Composition } from "remotion";
import { GuardianPromo } from "./GuardianPromo";
import { FPS, totalDurationFrames } from "./scenes/config";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GuardianPromo"
      component={GuardianPromo}
      durationInFrames={totalDurationFrames()}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
