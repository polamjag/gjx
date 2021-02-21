import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

import { imagesState } from "../../atoms";

export const AddImageForm: React.FC<{}> = () => {
  const setImages = useSetRecoilState(imagesState);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(value);
  };

  const add = () => {
    if (!imageUrl) {
      return;
    }

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

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({
    key,
  }) => {
    if (key === "Enter") {
      add();
    }
  };

  return (
    <div className="add-image-form">
      <input
        type="text"
        value={imageUrl}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="example.com/anime.gif"
        maxLength={1024}
        size={21}
      />
      <button onClick={add} disabled={!imageUrl}>
        Add
      </button>
      <button onClick={reset}>Remove All Images</button>
    </div>
  );
};
