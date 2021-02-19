import React from "react";
import { useRecoilValue } from "recoil";

import { selectedImageState } from "../atoms";

export const Arena: React.FC<{}> = () => {
  const image = useRecoilValue(selectedImageState);

  if (!image) {
    return <div className="arena--content"></div>;
  }

  return <img className="arena--content" src={image} alt="" />;
};
