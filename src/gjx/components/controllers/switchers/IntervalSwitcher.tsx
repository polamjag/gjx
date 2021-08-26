import React, { useEffect, useState } from "react";
import { DefaultValue, selector, useRecoilState, useRecoilValue } from "recoil";

import {
  imagesState,
  selectedImageState,
  switchingStrategyState,
  SyncedAppState,
} from "../../../atoms";
import {
  calculateBeatIntervalMsFromBPM,
  calculateBPM,
  calculateBPMFromBeatInterval,
} from "../../../utils/calculateBPM";

const intervalSwitcherState = selector<
  SyncedAppState["switchingStrategy"]["intervalSwitching"]["state"]
>({
  key: "intervalSwitcherState",
  get: ({ get }) => {
    const swst = get(switchingStrategyState);
    return swst.intervalSwitching.state;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(switchingStrategyState, (prevValue) => ({
        ...prevValue,
        intervalSwitching: {
          name: "intervalSwitching" as const,
          state: newValue,
        },
      }));
    }
  },
});

export const IntervalSwitcher: React.FC<{}> = () => {
  const [state, setState] = useRecoilState(intervalSwitcherState);
  const images = useRecoilValue(imagesState);
  const [, setSelectedImage] = useRecoilState(selectedImageState);

  const setIntervalMs = (val: number) => {
    setState(() => {
      return {
        intervalMs: val,
      };
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
    }, state.intervalMs);
    return () => {
      window.clearInterval(timer);
    };
  }, [imageArr, state.intervalMs, setSelectedImage]);

  const onClick2x = () => {
    setState((currVal) => {
      return {
        intervalMs: currVal.intervalMs / 2,
      };
    });
  };

  const onClick1_2x = () => {
    setState((currVal) => {
      return {
        intervalMs: currVal.intervalMs * 2,
      };
    });
  };

  return (
    <div className="switcher switcher__interval">
      <div>Periodical Random Switcher</div>
      <input
        type="range"
        value={state.intervalMs}
        max={2000}
        min={30}
        step={1}
        onChange={onChange}
      />
      <span className="switcher__interval__value-label tabular-nums">
        {state.intervalMs.toFixed(0)}ms (≈ BPM{" "}
        {calculateBPMFromBeatInterval(state.intervalMs).toFixed(2)})
      </span>
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
  const [bpm, setBPM] = useState<number | undefined>(undefined);

  const handleTap = () => {
    const now = Date.now();
    if (tappedTimestamps.length === 0) {
      setTappedTimestamps([now]);
      return;
    }
    if (now - tappedTimestamps[tappedTimestamps.length - 1] > 2000) {
      setBPM(undefined);
      setTappedTimestamps([now]);
      return;
    }

    const timestamps = [...tappedTimestamps.slice(-15), Date.now()];
    setTappedTimestamps(timestamps);

    const bpm = calculateBPM(timestamps);
    if (tappedTimestamps.length > 0) {
      setBPM(bpm);
    }
    if (tappedTimestamps.length > 4) {
      setIntervalMs(calculateBeatIntervalMsFromBPM(bpm));
    }
  };

  return (
    <>
      <button onClick={handleTap} className="tap-clap-button">
        Tap BPM
      </button>
      {bpm ? bpm.toFixed(2) : "-"}
    </>
  );
};
