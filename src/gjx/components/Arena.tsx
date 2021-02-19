import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { imagesState, switchingStrategyState } from "../atoms";

export const Arena: React.FC<{}> = () => {
  const images = useRecoilValue(imagesState);
  const switchingStrategy = useRecoilValue(switchingStrategyState);
  const [image, setImage] = useState<string>();

  const imageArr = Object.entries(images);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setImage(imageArr[Math.floor(Math.random() * imageArr.length)][1]);
    }, switchingStrategy.state.intervalMs);
    return () => {
      window.clearInterval(timer);
    };
  }, [imageArr, switchingStrategy.state.intervalMs]);

  return (
    <img
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: -1,
        top: 0,
        left: 0,
        objectFit: 'cover',
      }}
      src={image}
      alt=""
    />
  );
};
