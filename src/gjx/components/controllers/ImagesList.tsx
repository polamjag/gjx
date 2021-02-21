import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { imagesState, selectedImageState } from "../../atoms";
import { ThumbnailWithAction } from "../molecures/ThumbnailWithAction";

export const ImagesList: React.FC<{}> = () => {
  const [images, setImagesState] = useRecoilState(imagesState);
  const selectedImage = useRecoilValue(selectedImageState);

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
          <li key={id} className={selectedImage === image ? 'selected' : ''}>
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
