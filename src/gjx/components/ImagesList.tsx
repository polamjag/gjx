import React from "react";
import { useRecoilState } from "recoil";
import { imagesState } from "../atoms";

export const ImagesList: React.FC<{}> = () => {
  const [images] = useRecoilState(imagesState);

  return (
    <>
      <ul className="images-list">
        {Object.entries(images).map(([id, image]) => (
          <li key={id}>
            <img src={image} alt="" />
          </li>
        ))}
      </ul>
    </>
  );
};
