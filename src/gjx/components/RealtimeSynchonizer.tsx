import React, { useContext, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import { syncedAppState, realtimeSyncMetaState, defaultState } from "../atoms";
import { FirebaseContext } from "../firebaseContext";

export const RealtimeSynchronizer: React.FC<{}> = () => {
  const [appState, setAppState] = useRecoilState(syncedAppState);
  const setRealtimeSyncMetaState = useSetRecoilState(realtimeSyncMetaState);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    firebase?.database().ref("sessions/").set({
      appState,
    });
  }, [firebase, appState]);

  useEffect(() => {
    firebase
      ?.database()
      .ref("sessions/")
      .on("value", (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          return;
        }

        setAppState(() => ({ ...defaultState, ...data.appState }));
        setRealtimeSyncMetaState({
          lastGotEpoch: Date.now(),
        });
      });
  }, [firebase, setAppState, setRealtimeSyncMetaState]);

  return <></>;
};
