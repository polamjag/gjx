export type SwitchingStrategyName = 'intervalSwitching' | 'manualSwitching';
interface SwitchingStrategy {
  name: SwitchingStrategyName;
  state: {};
}

export interface IntervalSwitchingStrategy extends SwitchingStrategy {
  name: "intervalSwitching";
  state: {
    intervalMs: number;
  };
}

export interface ManualSwitchingStrategy extends SwitchingStrategy {
  name: "manualSwitching";
  state: {
    index: number;
  };
}

export interface SwitchingStrategies {
  intervalSwitching: IntervalSwitchingStrategy;
  manualSwitching: ManualSwitchingStrategy;
}
