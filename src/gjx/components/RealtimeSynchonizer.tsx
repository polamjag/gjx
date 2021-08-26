import {
  getDatabase,
  ref,
  get,
  off,
  set,
  onValue,
} from "firebase/database";
import React, { useContext, useEffect } from "react";
import { useRecoilState } from "recoil";

import { defaultState, realtimeSyncMetaState, syncedAppState } from "../atoms";
import { FirebaseContext } from "./WithFirebase";

export const RealtimeSynchronizer: React.FC<{ rtdbKey: string }> = ({
  rtdbKey,
}) => {
  const [appState, setAppState] = useRecoilState(syncedAppState);
  const [realtimeSyncMeta, setRealtimeSyncMetaState] = useRecoilState(
    realtimeSyncMetaState
  );
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    if (!firebase) {
      return;
    }

    const db = getDatabase(firebase);
    const fbRef = ref(db, rtdbKey);

    get(fbRef)
      .then((snapshot) => {
        const data = snapshot.exportVal() || {};

        setRealtimeSyncMetaState((old) => ({
          ...old,
          canSendStateToRemote: false,
        }));
        setAppState(() => ({ ...defaultState, ...data.appState }));
        setRealtimeSyncMetaState({
          canSendStateToRemote: true,
          lastGotEpoch: Date.now(),
          synchronizationState: "gotInitialState",
        });
      })
      .catch((err) => {
        setRealtimeSyncMetaState((prevState) => ({
          ...prevState,
          synchronizationState: "fresh",
          initializationError: err,
        }));
      });

    return () => {
      off(fbRef);
    };
  }, [firebase, setAppState, setRealtimeSyncMetaState, rtdbKey]);

  useEffect(() => {
    if (realtimeSyncMeta.synchronizationState === "fresh") {
      return;
    }

    const db = getDatabase(firebase);

    if (realtimeSyncMeta.canSendStateToRemote) {
      set(ref(db, rtdbKey), { appState });
    }
  }, [firebase, appState, realtimeSyncMeta, rtdbKey]);

  useEffect(() => {
    if (realtimeSyncMeta.synchronizationState === "fresh") {
      return;
    }

    const db = getDatabase(firebase);

    const unsubSync = onValue(ref(db, rtdbKey), (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        return;
      }

      setRealtimeSyncMetaState((old) => ({
        ...old,
        canSendStateToRemote: false,
      }));
      setAppState(() => ({ ...defaultState, ...data.appState }));
      setRealtimeSyncMetaState((prevState) => ({
        ...prevState,
        canSendStateToRemote: true,
        lastGotEpoch: Date.now(),
      }));
    });

    const unsubInfo = onValue(ref(db, ".info/"), (snap) => {
      const {
        serverTimeOffset,
        connected,
      }: {
        serverTimeOffset: number;
        connected: boolean;
      } = snap.val();

      setRealtimeSyncMetaState((old) => ({
        ...old,
        lastGotPingMs: -serverTimeOffset,
        synchronizationState: connected ? "connected" : "disconnected",
      }));
    });

    return () => {
      unsubSync();
      unsubInfo();
    };
  }, [
    firebase,
    setAppState,
    realtimeSyncMeta.synchronizationState,
    setRealtimeSyncMetaState,
    rtdbKey,
  ]);

  return <></>;
};
