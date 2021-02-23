import { O_DIRECT } from "node:constants";
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

    firebase
      .database()
      .ref(rtdbKey)
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

    firebase
      ?.database()
      .ref(rtdbKey)
      .on("value", (snapshot) => {
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

    firebase
      ?.database()
      .ref(".info/serverTimeOffset")
      .on("value", function (snap) {
        const offset = snap.val();
        setRealtimeSyncMetaState((old) => ({
          ...old,
          lastGotPingMs: -offset,
        }));
      });
  }, [
    firebase,
    setAppState,
    realtimeSyncMeta.synchronizationState,
    setRealtimeSyncMetaState,
    rtdbKey,
  ]);

  return <></>;
};
