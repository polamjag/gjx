import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  activeSwitchingStrategyNameState,
  imagesState,
  selectedImageState,
  switchingStrategyState,
} from "../atoms";
import { SwitchingStrategies } from "../types";

export const Switcher: React.FC<{}> = () => {
  const switchingStrategyName = useRecoilValue(
    activeSwitchingStrategyNameState
  );

  switch (switchingStrategyName) {
    case "intervalSwitching":
      return <IntervalSwitcher />;
    case "manualSwitching":
      return <></>;
  }
};

const IntervalSwitcher: React.FC<{}> = () => {
  const [switchingStrategy, setSwitchingStrategy] = useRecoilState(
    switchingStrategyState
  );
  const images = useRecoilValue(imagesState);
  const [, setSelectedImage] = useRecoilState(selectedImageState);

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSwitchingStrategy((oldState: SwitchingStrategies) => {
      const newState: SwitchingStrategies = {
        ...oldState,
        intervalSwitching: {
          name: 'intervalSwitching',
          state: {
            intervalMs: Number(value),
          },
        },
      };
      return newState;
    });
  };

  const imageArr = Object.entries(images);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSelectedImage(
        imageArr[Math.floor(Math.random() * imageArr.length)][1]
      );
    }, switchingStrategy.intervalSwitching.state.intervalMs);
    return () => {
      window.clearInterval(timer);
    };
  }, [
    imageArr,
    switchingStrategy.intervalSwitching.state.intervalMs,
    setSelectedImage,
  ]);

  return (
    <div className="switcher switcher__interval">
      <div>Interval Random Switcher</div>
      <input
        type="range"
        value={switchingStrategy.intervalSwitching.state.intervalMs}
        max={2000}
        min={30}
        onChange={onChange}
      />
      {switchingStrategy.intervalSwitching.state.intervalMs}ms
    </div>
  );
};
