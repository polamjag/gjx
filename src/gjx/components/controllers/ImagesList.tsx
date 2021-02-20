import React from "react";
import { useRecoilState } from "recoil";

import { imagesState } from "../../atoms";
import { ThumbnailWithAction } from "../molecures/ThumbnailWithAction";

export const ImagesList: React.FC<{}> = () => {
  const [images, setImagesState] = useRecoilState(imagesState);

  const deleteImageByKey = (key: string): void => {
    const newImages = { ...images };
    delete newImages[key];
    setImagesState(
      Object.fromEntries(
        Object.values(newImages).map((url, index) => [index.toString(), url])
      )
    );
  };

  return (
    <>
      <ul className="images-list">
        {Object.entries(images).map(([id, image]) => (
          <li key={id}>
            <ThumbnailWithAction
              thumbnailUrl={image}
              buttonLabel="x"
              onClickButton={() => {
                deleteImageByKey(id);
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
};
