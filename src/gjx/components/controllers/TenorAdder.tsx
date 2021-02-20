import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

import { imagesState } from "../../atoms";
import { ThumbnailWithAction } from "../molecures/ThumbnailWithAction";

interface TenorImage {
  id: string;
  title: string;
  h1_title: string;
  media: Array<{
    [mediaType: string]: {
      dims: [number, number];
      url: string;
      preview: string;
      size: number;
    };
  }>;
}
interface TenorSearchResponse {
  results: TenorImage[];
  next: string;
}

interface SearchTenorParams {
  query: string;
  limit?: number;
  random?: boolean;
  pos?: string;
}

const searchTenor = async ({
  query,
  limit = 5,
  random = false,
  pos,
}: SearchTenorParams): Promise<TenorSearchResponse> => {
  const path = random ? "random" : "search";
  return (
    await fetch(
      `https://g.tenor.com/v1/${path}?q=${encodeURIComponent(
        query
      )}&key=LIVDSRZULELA&limit=${limit}&contentfilter=medium&pos=${pos}`
    )
  ).json();
};

export const TenorAdder: React.FC<{}> = () => {
  const [query, setQuery] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<
    Array<{ thumbnailUrl: string; realImageUrl: string }>
  >([]);

  const [currentSearchCursor, setCurrentSearchCursor] = useState<string>("");

  const handleUpdateQuery = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(value);
    setCurrentSearchCursor("");
  };

  const handleSearch = async () => {
    const res = await searchTenor({
      query,
      random: true,
      pos: currentSearchCursor,
    });
    setCurrentSearchCursor(res.next);
    setImageUrls(
      res.results.map((im) => ({
        realImageUrl: im.media[0]["mediumgif"].url,
        thumbnailUrl: im.media[0]["nanogif"].url,
      }))
    );
  };

  return (
    <div className="tenor-adder">
      <h3>Tenor</h3>
      <input type="text" value={query} onChange={handleUpdateQuery} />
      <button onClick={handleSearch}>Search</button>
      <Images imageUrls={imageUrls} />
    </div>
  );
};

const Images: React.FC<{
  imageUrls: Array<{ thumbnailUrl: string; realImageUrl: string }>;
}> = ({ imageUrls }) => {
  const setImages = useSetRecoilState(imagesState);

  const addImage = (imageUrl: string) => {
    setImages((oldImages) => {
      const newImages = { ...oldImages };
      newImages[(oldImages.length || 0).toString()] = imageUrl;
      return newImages;
    });
  };

  return (
    <div className="tenor-search-results">
      {imageUrls.map(({ thumbnailUrl, realImageUrl }) => (
        <ThumbnailWithAction
          thumbnailUrl={thumbnailUrl}
          onClickButton={() => addImage(realImageUrl)}
          buttonLabel="+"
          key={thumbnailUrl}
        />
      ))}
    </div>
  );
};
