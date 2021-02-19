import React, { useContext, useEffect } from "react";
import { useRecoilState } from "recoil";
import { imagesState } from "../atoms";
import { FirebaseContext } from "../firebaseContext";

export const RealtimeSynchronizer: React.FC<{}> = () => {
  const [images, setImages] = useRecoilState(imagesState);
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
        console.log(data);
        if (!data) {
          return;
        }

        setImages(() => data.images);
      });
  }, [firebase, setImages]);

  return <></>;
};
