import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { imagesState, selectedImageState, switchingStrategyState } from '../atoms';

export const Switcher: React.FC<{}> = () => {
  const switchingStrategy = useRecoilValue(switchingStrategyState);

  switch (switchingStrategy.name) {
    case "intervalSwitching":
      return <IntervalSwitcher />;
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
    setSwitchingStrategy((oldState) => {
      const newState = {
        ...oldState,
        state: {
          intervalMs: Number(value),
        },
      };
      return newState;
    });
  };

  const imageArr = Object.entries(images);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSelectedImage(imageArr[Math.floor(Math.random() * imageArr.length)][1]);
    }, switchingStrategy.state.intervalMs);
    return () => {
      window.clearInterval(timer);
    };
  }, [imageArr, switchingStrategy.state.intervalMs, setSelectedImage]);

  return (
    <div className="switcher switcher__interval">
      <div>Interval Random Switcher</div>
      <input
        type="range"
        value={switchingStrategy.state.intervalMs}
        max={2000}
        min={30}
        onChange={onChange}
      />
      {switchingStrategy.state.intervalMs}ms
    </div>
  );
};
