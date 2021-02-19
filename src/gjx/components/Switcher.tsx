import React from "react";
import { useRecoilState } from "recoil";
import { switchingStrategyState } from "../atoms";

export const Switcher: React.FC<{}> = () => {
  const [switchingStrategy, setSwitchingStrategy] = useRecoilState(
    switchingStrategyState
  );

  const onChange = ({ target: { value }}: React.ChangeEvent<HTMLInputElement>) => {
    setSwitchingStrategy((oldState) => {
      const newState = {
        ...oldState,
        state: {
          intervalMs: Number(value),
        }
      };
      return newState;
    });
  }

  return (
    <div className="switcher switcher__interval">
      <div>Interval Random Switcher</div>
      <input type="range" value={switchingStrategy.state.intervalMs} max={2000} min={16.6667} onChange={onChange} />
      {switchingStrategy.state.intervalMs}ms
    </div>
  );
};
