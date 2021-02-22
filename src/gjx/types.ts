//#region switching
export type SwitchingStrategyName = "intervalSwitching" | "manualSwitching";
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

//#endregion

//#region overlay

export type OverlayStrategyName = "empty" | "youtubeEmbed";

interface OverlayStrategy {
  name: OverlayStrategyName;
  state: {};
}

export interface EmptyOverlayStrategy extends OverlayStrategy {
  name: "empty";
}

export interface YouTubeEmbedOverlayStrategy extends OverlayStrategy {
  name: "youtubeEmbed";
  state: {
    videoId?: string;
  };
}

export interface OverlayStrategies {
  empty: EmptyOverlayStrategy;
  youtubeEmbed: YouTubeEmbedOverlayStrategy;
}

//#endregion
