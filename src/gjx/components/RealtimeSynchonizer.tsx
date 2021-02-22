import React, { useContext, useEffect } from "react";
import { useRecoilState } from "recoil";

import { defaultState, realtimeSyncMetaState, syncedAppState } from "../atoms";
import { FirebaseContext } from "./WithFirebase";

export const RealtimeSynchronizer: React.FC<{}> = () => {
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
      .ref("sessions/")
      .get()
      .then((snapshot) => {
        const data = snapshot.exportVal();
        if (!data) {
          return;
        }

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
          synchronizationState: 'fresh',
          initializationError: err,
        }));
      });
  }, [firebase, setAppState, setRealtimeSyncMetaState]);

  useEffect(() => {
    if (realtimeSyncMeta.synchronizationState === "fresh") {
      return;
    }

    if (realtimeSyncMeta.canSendStateToRemote) {
      firebase?.database().ref("sessions/").set({
        appState,
      });
    }
  }, [firebase, appState, realtimeSyncMeta]);

  useEffect(() => {
    if (realtimeSyncMeta.synchronizationState === "fresh") {
      return;
    }

    firebase
      ?.database()
      .ref("sessions/")
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
  }, [
    firebase,
    setAppState,
    realtimeSyncMeta.synchronizationState,
    setRealtimeSyncMetaState,
  ]);

  return <></>;
};
