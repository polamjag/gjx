import React from "react";
import { useRecoilValue } from "recoil";

import { activeSwitchingStrategyNameState } from "../../atoms";
import { IntervalSwitcher } from "./switchers/IntervalSwitcher";
import { ManualSwitcher } from "./switchers/ManualSwitcher";

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
