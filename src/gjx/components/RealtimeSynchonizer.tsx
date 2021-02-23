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

    const fbRef = firebase.database().ref(rtdbKey);
    fbRef
      .get()
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
      fbRef.off();
    };
  }, [firebase, setAppState, setRealtimeSyncMetaState, rtdbKey]);

  useEffect(() => {
    if (realtimeSyncMeta.synchronizationState === "fresh") {
      return;
    }

    if (realtimeSyncMeta.canSendStateToRemote) {
      firebase?.database().ref(rtdbKey).set({
        appState,
      });
    }
  }, [firebase, appState, realtimeSyncMeta, rtdbKey]);

  useEffect(() => {
    if (realtimeSyncMeta.synchronizationState === "fresh") {
      return;
    }

    const syncRef = firebase?.database().ref(rtdbKey);
    syncRef?.on("value", (snapshot) => {
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

    const pingRef = firebase?.database().ref(".info/serverTimeOffset");
    pingRef?.on("value", function (snap) {
      const offset = snap.val();
      setRealtimeSyncMetaState((old) => ({
        ...old,
        lastGotPingMs: -offset,
      }));
    });

    return () => {
      syncRef?.off();
      pingRef?.off();
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
