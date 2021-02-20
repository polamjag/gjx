import React from "react";
import { useRecoilState } from "recoil";

import { activeSwitchingStrategyNameState } from "../../atoms";
import { SwitchingStrategyName } from "../../types";

const strategies: Array<{ name: SwitchingStrategyName; label: string }> = [
  {
    name: "intervalSwitching",
    label: "Interval",
  },
  {
    name: "manualSwitching",
    label: "Manual",
  },
];

export const SwitchingStrategySelector: React.FC<{}> = () => {
  const [
    activeSwitchingStrategyName,
    setActiveSwitchingStrategyName,
  ] = useRecoilState(activeSwitchingStrategyNameState);

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setActiveSwitchingStrategyName(value as SwitchingStrategyName);
  };

  return (
    <div className="switching-strategy-selector">
      {strategies.map((strategy) => (
        <span key={strategy.name}>
          <input
            type="radio"
            name="switchingStrategy"
            checked={activeSwitchingStrategyName === strategy.name}
            id={strategy.name}
            onChange={handleChange}
            value={strategy.name}
            className={
              activeSwitchingStrategyName === strategy.name ? "is-selected" : ""
            }
          />
          <label htmlFor={strategy.name}>{strategy.label}</label>
        </span>
      ))}
    </div>
  );
};
