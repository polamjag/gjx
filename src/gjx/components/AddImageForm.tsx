import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { imagesState } from "../atoms";

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
      const newImages = {...oldImages};
      newImages[oldImages.length] = imageUrl;
      return newImages;
    });
    setImageUrl("");
  };
  const reset = () => {
    setImages(() => ({}));
  };

  return (
    <>
      <input type="text" value={imageUrl} onChange={handleChange} />
      <button onClick={add} disabled={!imageUrl}>
        Add
      </button>
      <button onClick={reset}>Reset</button>
    </>
  );
};
