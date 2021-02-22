import React from "react";
import { useRecoilState } from "recoil";

import { overlayCompositionState } from "../../atoms";
import { BlendMode, blendModes } from "../../types";

export const OverlayMixer: React.FC<{}> = () => {
  const [compositionInfo, setCompositionInfo] = useRecoilState(
    overlayCompositionState
  );

  const handleOnChangeBlendMode: React.ChangeEventHandler<HTMLSelectElement> = ({
    target: { value },
  }) => {
    setCompositionInfo((prevState) => ({
      ...prevState,
      blendMode: value as BlendMode,
    }));
  };

  return (
    <div>
      <select
        value={compositionInfo.blendMode}
        onChange={handleOnChangeBlendMode}
      >
        {blendModes.map((blendMode) => (
          <option value={blendMode} key={blendMode}>{blendMode}</option>
        ))}
      </select>
    </div>
  );
};
