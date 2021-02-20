import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  imagesState,
  selectedImageState,
  switchingStrategyState,
} from "../../../atoms";
import { SwitchingStrategies } from "../../../types";
import { calculateBPM, calculateBPMFromBeatInterval } from "../../../utils/calculateBPM";

export const IntervalSwitcher: React.FC<{}> = () => {
  const [switchingStrategy, setSwitchingStrategy] = useRecoilState(
    switchingStrategyState
  );
  const images = useRecoilValue(imagesState);
  const [, setSelectedImage] = useRecoilState(selectedImageState);

  const setIntervalMs = (val: number) => {
    setSwitchingStrategy((oldState: SwitchingStrategies) => {
      const newState: SwitchingStrategies = {
        ...oldState,
        intervalSwitching: {
          name: "intervalSwitching",
          state: {
            intervalMs: val,
          },
        },
      };
      return newState;
    });
  };

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setIntervalMs(Number(value));
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

  const onClick2x = () => {
    setIntervalMs(switchingStrategy.intervalSwitching.state.intervalMs / 2);
  };

  const onClick1_2x = () => {
    setIntervalMs(switchingStrategy.intervalSwitching.state.intervalMs * 2);
  };

  return (
    <div className="switcher switcher__interval">
      <div>Interval Random Switcher</div>
      <input
        type="range"
        value={switchingStrategy.intervalSwitching.state.intervalMs}
        max={2000}
        min={30}
        step={1}
        onChange={onChange}
      />
      {switchingStrategy.intervalSwitching.state.intervalMs.toFixed(2)}ms
      (≈ BPM {calculateBPMFromBeatInterval(switchingStrategy.intervalSwitching.state.intervalMs).toFixed(2)})
        <button onClick={onClick2x}>x 2</button>
        <button onClick={onClick1_2x}>/ 2</button>
      <div>
        <TapToBPM setIntervalMs={setIntervalMs} />
      </div>
    </div>
  );
};

const TapToBPM: React.FC<{ setIntervalMs: (interval: number) => void }> = ({
  setIntervalMs,
}) => {
  const [tappedTimestamps, setTappedTimestamps] = useState<number[]>([]);

  const detectedBPM =
    tappedTimestamps.length > 1 ? calculateBPM(tappedTimestamps) : 0;

  const handleTap = () => {
    const now = Date.now();
    if (tappedTimestamps.length === 0) {
      setTappedTimestamps([now]);
      return;
    }
    if (now - tappedTimestamps[tappedTimestamps.length - 1] > 2000) {
      setTappedTimestamps([now]);
      return;
    }

    setTappedTimestamps([...tappedTimestamps.slice(-15), Date.now()]);

    if (tappedTimestamps.length > 4) {
      setIntervalMs((60 / detectedBPM) * 1000);
    }
  };

  return (
    <>
      <button onClick={handleTap}>Tap BPM</button>
      {detectedBPM ? detectedBPM.toFixed(2) : "-"}
    </>
  );
};
