import { atom } from "recoil";
import { SwitchingStrategies } from "./types";

export const imagesState = atom<{ [key: string]: string }>({
  default: {},
  key: 'images',
});

export const selectedImageState = atom<string | undefined>({
  default: undefined,
  key: 'selectedImage',
})

export const switchingStrategyState = atom<SwitchingStrategies>({
  default: {
    name: 'intervalSwitching',
    state: {
      intervalMs: 500,
    },
  },
  key: 'switchingStrategy',
})