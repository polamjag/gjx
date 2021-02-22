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

  const handleRandomBlendMode = () => {
    const newBlendMode =
      blendModes[Math.floor(Math.random() * blendModes.length)];
    setCompositionInfo((prevState) => ({
      ...prevState,
      blendMode: newBlendMode,
    }));
  };

  return (
    <div className="overlay-mixer">
      <span>Blend Mode </span>
      <select
        value={compositionInfo.blendMode}
        onChange={handleOnChangeBlendMode}
      >
        {blendModes.map((blendMode) => (
          <option value={blendMode} key={blendMode}>
            {blendMode}
          </option>
        ))}
      </select>
      <button onClick={handleRandomBlendMode}>🔀</button>
    </div>
  );
};
