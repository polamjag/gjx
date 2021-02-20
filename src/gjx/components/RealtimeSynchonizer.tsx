import React, { useContext, useEffect } from "react";
import { useRecoilState } from "recoil";

import { defaultState, realtimeSyncMetaState, syncedAppState } from "../atoms";
import { FirebaseContext } from "../firebaseContext";

export const RealtimeSynchronizer: React.FC<{}> = () => {
  const [appState, setAppState] = useRecoilState(syncedAppState);
  const [realtimeSyncMeta, setRealtimeSyncMetaState] = useRecoilState(
    realtimeSyncMetaState
  );
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    if (realtimeSyncMeta.needsToSync) {
      firebase?.database().ref("sessions/").set({
        appState,
      });
    }
  }, [firebase, appState, realtimeSyncMeta]);

  useEffect(() => {
    firebase
      ?.database()
      .ref("sessions/")
      .on("value", (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          return;
        }

        setRealtimeSyncMetaState((old) => ({ ...old, needsToSync: false }));
        setAppState(() => ({ ...defaultState, ...data.appState }));
        setRealtimeSyncMetaState({
          needsToSync: true,
          lastGotEpoch: Date.now(),
        });
      });
  }, [firebase, setAppState, setRealtimeSyncMetaState]);

  return <></>;
};
