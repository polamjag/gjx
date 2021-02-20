import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  activeSwitchingStrategyNameState,
  imagesState,
  selectedImageState,
  switchingStrategyState,
} from "../../atoms";
import { SwitchingStrategies } from "../../types";

export const Switcher: React.FC<{}> = () => {
  const switchingStrategyName = useRecoilValue(
    activeSwitchingStrategyNameState
  );

  switch (switchingStrategyName) {
    case "intervalSwitching":
      return <IntervalSwitcher />;
    case "manualSwitching":
      return <ManualSwitcher />;
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
          name: "intervalSwitching",
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
      let image;
      try {
        image = imageArr[Math.floor(Math.random() * imageArr.length)][1];
      } catch {}

      setSelectedImage(image);
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

const ManualSwitcher: React.FC<{}> = () => {
  const [switchingStrategy, setSwitchingStrategy] = useRecoilState(
    switchingStrategyState
  );
  const images = useRecoilValue(imagesState);
  const [, setSelectedImage] = useRecoilState(selectedImageState);

  const [rangeValue, setRangeValue] = useState<number>(
    switchingStrategy.manualSwitching.state.index
  );

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(Number(value));
  };

  const change = () => {
    setSwitchingStrategy((oldState: SwitchingStrategies) => {
      const newState: SwitchingStrategies = {
        ...oldState,
        manualSwitching: {
          name: "manualSwitching",
          state: {
            index: rangeValue,
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
        value={rangeValue}
        min={0}
        max={0.99}
        step={0.01}
        onChange={onChange}
        onMouseUp={change}
      />
    </div>
  );
};
