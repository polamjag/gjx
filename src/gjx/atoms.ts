import { atom, DefaultValue, selector } from "recoil";

import {
  CompositionInfo,
  OverlayStrategies,
  OverlayStrategyName,
  SwitchingStrategies,
  SwitchingStrategyName,
} from "./types";

export interface SyncedAppState {
  images: { [key: string]: string };

  activeSwitchingStrategyName: SwitchingStrategyName;
  switchingStrategy: SwitchingStrategies;

  activeOverlayStrategyName: OverlayStrategyName;
  overlayStrategy: OverlayStrategies;
  overlayComposition: CompositionInfo;
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

  activeOverlayStrategyName: 'empty',
  overlayStrategy: {
    empty: {
      name: 'empty',
      state: {},
    },
    youtubeEmbed: {
      name: "youtubeEmbed",
      state: {},
    },
  },
  overlayComposition: {
    blendMode: 'overlay',
    opacity: 1,
  }
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

export const activeOverlayStrategyNameState = selector<
  SyncedAppState["activeOverlayStrategyName"]
>({
  key: "filteredActiveOverlayStrategy",
  get: ({ get }) => {
    const app = get(syncedAppState);

    return app.activeOverlayStrategyName;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(syncedAppState, (prevValue) => ({
        ...prevValue,
        activeOverlayStrategyName: newValue,
      }));
    }
  },
});

export const overlayStrategyState = selector<SyncedAppState["overlayStrategy"]>(
  {
    key: "filteredOverlayStrategy",
    get: ({ get }) => {
      const app = get(syncedAppState);

      return app.overlayStrategy;
    },
    set: ({ set }, newValue) => {
      if (!(newValue instanceof DefaultValue)) {
        return set(syncedAppState, (prevValue) => ({
          ...prevValue,
          overlayStrategy: newValue,
        }));
      }
    },
  }
);

export const overlayCompositionState = selector<SyncedAppState["overlayComposition"]>(
  {
    key: "filteredOverlayComposition",
    get: ({ get }) => {
      const app = get(syncedAppState);

      return app.overlayComposition;
    },
    set: ({ set }, newValue) => {
      if (!(newValue instanceof DefaultValue)) {
        return set(syncedAppState, (prevValue) => ({
          ...prevValue,
          overlayComposition: newValue,
        }));
      }
    },
  }
);

// local states

export const selectedImageState = atom<string | undefined>({
  key: "selectedImage",
  default: undefined,
});

export const realtimeSyncMetaState = atom<{
  synchronizationState: "fresh" | "gotInitialState" | "connected" | "disconnected";
  initializationError?: any;
  lastGotEpoch: number;
  canSendStateToRemote: boolean;
  lastGotPingMs?: number;
}>({
  key: "syncMeta",
  default: {
    synchronizationState: "fresh",
    initializationError: undefined,
    lastGotEpoch: -1,
    canSendStateToRemote: true,
    lastGotPingMs: undefined,
  },
});
