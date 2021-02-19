import { atom } from "recoil";
import { SwitchingStrategies, SwitchingStrategyName } from "./types";

export const imagesState = atom<{ [key: string]: string }>({
  default: {},
  key: "images",
});

export const selectedImageState = atom<string | undefined>({
  default: undefined,
  key: "selectedImage",
});

export const activeSwitchingStrategyNameState = atom<SwitchingStrategyName>({
  default: "intervalSwitching",
  key: "activeSwitchingStrategy",
});

export const switchingStrategyState = atom<SwitchingStrategies>({
  default: {
    intervalSwitching: {
      name: "intervalSwitching",
      state: {
        intervalMs: 500,
      },
    },
    manualSwitching: {
      name: "manualSwitching",
      state: {
        index: 0,
      },
    },
  },
  key: "switchingStrategy",
});
