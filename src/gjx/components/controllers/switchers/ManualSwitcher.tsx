import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  imagesState,
  selectedImageState,
  switchingStrategyState,
} from "../../../atoms";
import { SwitchingStrategies } from "../../../types";

export const ManualSwitcher: React.FC<{}> = () => {
  const [switchingStrategy, setSwitchingStrategy] = useRecoilState(
    switchingStrategyState
  );
  const images = useRecoilValue(imagesState);
  const [, setSelectedImage] = useRecoilState(selectedImageState);

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(value);
    setSwitchingStrategy((oldState: SwitchingStrategies) => {
      const newState: SwitchingStrategies = {
        ...oldState,
        manualSwitching: {
          name: "manualSwitching",
          state: {
            index: val,
          },
        },
      };
      return newState;
    });
  };

  useEffect(() => {
    setSelectedImage(
      Object.values(images)[
        Math.floor(
          switchingStrategy.manualSwitching.state.index *
            Object.values(images).length
        )
      ]
    );
  }, [images, setSelectedImage, switchingStrategy.manualSwitching.state.index]);

  return (
    <div className="switcher switcher__interval">
      <div>Manual Switcher</div>
      <input
        type="range"
        value={switchingStrategy.manualSwitching.state.index}
        min={0}
        max={0.99}
        step={0.01}
        onChange={onChange}
      />
    </div>
  );
};
