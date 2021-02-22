import { atom, DefaultValue, selector } from "recoil";

import { SwitchingStrategies, SwitchingStrategyName } from "./types";

export interface SyncedAppState {
  images: { [key: string]: string };

  activeSwitchingStrategyName: SwitchingStrategyName;
  switchingStrategy: SwitchingStrategies;
}

export const defaultState: SyncedAppState = {
  images: {},

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

export const syncedAppState = atom<SyncedAppState>({
  default: { ...defaultState },
  key: "gjxApp",
});

export const imagesState = selector<SyncedAppState["images"]>({
  key: "filteredImages",
  get: ({ get }) => {
    const app = get(syncedAppState);

    return app.images;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(syncedAppState, (prevValue) => ({
        ...prevValue,
        images: newValue,
      }));
    }
  },
});

export const activeSwitchingStrategyNameState = selector<
  SyncedAppState["activeSwitchingStrategyName"]
>({
  key: "filteredActiveSwitchingStrategyName",
  get: ({ get }) => {
    const app = get(syncedAppState);

    return app.activeSwitchingStrategyName;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(syncedAppState, (prevValue) => ({
        ...prevValue,
        activeSwitchingStrategyName: newValue,
      }));
    }
  },
});

export const switchingStrategyState = selector<
  SyncedAppState["switchingStrategy"]
>({
  key: "filteredSwitchingStrategy",
  get: ({ get }) => {
    const app = get(syncedAppState);

    return app.switchingStrategy;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(syncedAppState, (prevValue) => ({
        ...prevValue,
        switchingStrategy: newValue,
      }));
    }
  },
});

// local states

export const selectedImageState = atom<string | undefined>({
  key: "selectedImage",
  default: undefined,
});

export const realtimeSyncMetaState = atom<{
  synchronizationState: "fresh" | "gotInitialState";
  initializationError?: any;
  lastGotEpoch: number;
  canSendStateToRemote: boolean;
}>({
  key: "syncMeta",
  default: {
    synchronizationState: "fresh",
    initializationError: undefined,
    lastGotEpoch: -1,
    canSendStateToRemote: true,
  },
});
