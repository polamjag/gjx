interface SwitchingStrategy {
  name: string;
  state: {};
}

interface IntervalSwitchingStrategy extends SwitchingStrategy {
  name: 'intervalSwitching';
  state: {
    intervalMs: number;
  };
}

export type SwitchingStrategies = IntervalSwitchingStrategy;