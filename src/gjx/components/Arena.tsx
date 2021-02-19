import React from "react";
import { useRecoilValue } from "recoil";

import { selectedImageState } from "../atoms";

export const Arena: React.FC<{}> = () => {
  const image = useRecoilValue(selectedImageState);

  if (!image) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          background: "black",
        }}
      ></div>
    );
  }

  return (
    <img
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: -1,
        top: 0,
        left: 0,
        objectFit: "cover",
      }}
      src={image}
      alt=""
    />
  );
};
