import React, { useContext, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { imagesState, realtimeSyncMetaState } from "../atoms";
import { FirebaseContext } from "../firebaseContext";

export const RealtimeSynchronizer: React.FC<{}> = () => {
  const [images, setImages] = useRecoilState(imagesState);
  const setRealtimeSyncMetaState = useSetRecoilState(realtimeSyncMetaState);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    firebase?.database().ref("sessions/").set({
      images,
    });
  }, [firebase, images]);

  useEffect(() => {
    firebase
      ?.database()
      .ref("sessions/")
      .on("value", (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          return;
        }

        setImages(() => data.images);
        setRealtimeSyncMetaState({
          lastGotEpoch: Date.now()
        })
      });
  }, [firebase, setImages, setRealtimeSyncMetaState]);

  return <></>;
};
