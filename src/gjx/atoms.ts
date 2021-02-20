import { atom, DefaultValue, selector } from "recoil";
import { SwitchingStrategies, SwitchingStrategyName } from "./types";

interface AppState {
  images: { [key: string]: string };
  selectedImage: string | undefined;

  activeSwitchingStrategyName: SwitchingStrategyName;
  switchingStrategy: SwitchingStrategies;
}

const defaultState: AppState = {
  images: {},
  selectedImage: undefined,

  activeSwitchingStrategyName: "intervalSwitching",
  switchingStrategy: {
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
};

export const appState = atom<AppState>({
  default: { ...defaultState },
  key: "gjxApp",
});

export const imagesState = selector<AppState["images"]>({
  key: "filteredImages",
  get: ({ get }) => {
    const app = get(appState);

    return app.images;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(appState, (prevValue) => ({ ...prevValue, images: newValue }));
    }
  },
});

export const selectedImageState = selector<AppState["selectedImage"]>({
  key: "filteredSelectedImage",
  get: ({ get }) => {
    const app = get(appState);

    return app.selectedImage;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(appState, (prevValue) => ({ ...prevValue, selectedImage: newValue }));
    }
  },
});

export const activeSwitchingStrategyNameState = selector<AppState["activeSwitchingStrategyName"]>({
  key: "filteredActiveSwitchingStrategyName",
  get: ({ get }) => {
    const app = get(appState);

    return app.activeSwitchingStrategyName;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(appState, (prevValue) => ({ ...prevValue, activeSwitchingStrategyName: newValue }));
    }
  },
});

export const switchingStrategyState = selector<AppState["switchingStrategy"]>({
  key: "filteredSwitchingStrategy",
  get: ({ get }) => {
    const app = get(appState);

    return app.switchingStrategy;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(appState, (prevValue) => ({ ...prevValue, switchingStrategy: newValue }));
    }
  },
});