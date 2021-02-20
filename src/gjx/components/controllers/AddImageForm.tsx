import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { imagesState } from '../../atoms';

export const AddImageForm: React.FC<{}> = () => {
  const setImages = useSetRecoilState(imagesState);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(value);
  };

  const add = () => {
    setImages((oldImages) => {
      const newImages = { ...oldImages };
      newImages[oldImages.length.toString()] = imageUrl;
      return newImages;
    });
    setImageUrl("");
  };
  const reset = () => {
    setImages(() => ({}));
  };

  return (
    <div className="add-image-form">
      <input
        type="text"
        value={imageUrl}
        onChange={handleChange}
        placeholder="https://example.com/anime.gif"
        maxLength={1024}
      />
      <button onClick={add} disabled={!imageUrl}>
        Add
      </button>
      <button onClick={reset}>Remove All Images</button>
    </div>
  );
};
