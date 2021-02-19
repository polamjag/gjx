import React from "react";
import { useRecoilState } from "recoil";
import { activeSwitchingStrategyNameState } from "../atoms";
import { SwitchingStrategyName } from "../types";

const strategies: Array<{ name: SwitchingStrategyName }> = [
  {
    name: "intervalSwitching",
  },
  {
    name: "manualSwitching",
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
    <>
      {strategies.map((strategy) => (
        <input
          type="radio"
          key={strategy.name}
          name="switchingStrategy"
          checked={activeSwitchingStrategyName === strategy.name}
          onChange={handleChange}
          value={strategy.name}
        />
      ))}
    </>
  );
};
