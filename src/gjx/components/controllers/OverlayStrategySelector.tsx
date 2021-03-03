import React from "react";
import { useRecoilState } from "recoil";

import { activeOverlayStrategyNameState } from "../../atoms";
import { OverlayStrategyName } from "../../types";

const strategies: Array<{ name: OverlayStrategyName; label: string }> = [
  { name: "empty", label: "No Overlay" },
  {
    name: "youtubeEmbed",
    label: "📺 YouTube Embed",
  },
  {
    name: "arbitaryIframe",
    label: "🌏 <iframe>",
  },
];

export const OverlayStrategySelector: React.FC<{}> = () => {
  const [
    activeOverlayStrategyName,
    setActiveOverlayStrategyName,
  ] = useRecoilState(activeOverlayStrategyNameState);

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setActiveOverlayStrategyName(value as OverlayStrategyName);
  };

  return (
    <div className="switching-strategy-selector">
      {strategies.map((strategy) => (
        <span
          key={strategy.name}
          className="switching-strategy-selector__strategy"
        >
          <input
            type="radio"
            name="switchingStrategy"
            checked={activeOverlayStrategyName === strategy.name}
            id={strategy.name}
            onChange={handleChange}
            value={strategy.name}
            className={
              activeOverlayStrategyName === strategy.name ? "is-selected" : ""
            }
          />
          <label htmlFor={strategy.name}>{strategy.label}</label>
        </span>
      ))}
    </div>
  );
};
