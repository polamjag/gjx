import React, { useEffect, useState } from "react";
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
  locale: "ja_JP" | "en_US";
}

const searchTenor = async ({
  query,
  limit = 5,
  random = false,
  pos,
  locale = "ja_JP",
}: SearchTenorParams): Promise<TenorSearchResponse> => {
  const path = random ? "random" : "search";
  return (
    await fetch(
      `https://g.tenor.com/v1/${path}?q=${encodeURIComponent(
        query
      )}&key=LIVDSRZULELA&limit=${limit}&contentfilter=medium&pos=${pos}&locale=${locale}`
    )
  ).json();
};

const omakaseQueries = [
  "psychedelic",
  "space",
  "vaporwave",
  "idolmaster",
  "d4dj",
  "anime dance",
  "tokyo night",
  "taiko",
  "drum",
  "keion",
  "vtuber",
  "laser",
  "skrillex",
  "scratch dj",
  "among us",
  "hip hop",
  "dubstep",
  "nightclub",
  "ultra miami",
  "ultra",
  "sky",
  "wave",
  "glitch",
  "lofi hiphop",
  "pixelart",
  "initial d",
  "wangan midnight",
  "beatmania",
  "hexeosis",
];

export const TenorPicker: React.FC<{}> = () => {
  const [query, setQuery] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<
    Array<{ thumbnailUrl: string; realImageUrl: string }>
  >([]);
  const [gotError, setGotError] = useState<boolean>(false);

  const [currentSearchCursor, setCurrentSearchCursor] = useState<string>("");

  const [tenorSearchParamsState, setTenorSearchParamsState] = useState<{
    query: string;
    random: boolean;
    pos: string;
    locale: "ja_JP" | "en_US";
  }>({
    query: "",
    random: true,
    pos: "",
    locale: "ja_JP",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!tenorSearchParamsState) {
      return;
    }
    if (!tenorSearchParamsState.query) {
      return;
    }

    setGotError(false);
    setIsLoading(true);

    searchTenor(tenorSearchParamsState)
      .then((res) => {
        setCurrentSearchCursor(res.next);
        setImageUrls(
          res.results.map((im) => ({
            realImageUrl: im.media[0]["mediumgif"].url,
            thumbnailUrl: im.media[0]["nanogif"].url,
          }))
        );
      })
      .catch(() => setGotError(true))
      .finally(() => setIsLoading(false));
  }, [tenorSearchParamsState]);

  const performSearch = () => {
    setTenorSearchParamsState((prevState) => ({
      ...prevState,
      query,
      pos: currentSearchCursor,
    }));
  };

  const handleUpdateQuery = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(value);
    setCurrentSearchCursor("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({
    key,
  }) => {
    if (key === "Enter") {
      performSearch();
    }
  };

  const handleOmakase = async () => {
    const osusume =
      omakaseQueries[Math.floor(omakaseQueries.length * Math.random())];
    setCurrentSearchCursor("");
    setQuery(osusume);
    setTenorSearchParamsState((prevState) => ({
      ...prevState,
      query: osusume,
      random: true,
      pos: "",
    }));
  };

  const handleIsRandomChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { checked },
  }) => {
    setTenorSearchParamsState((prevState) => ({
      ...prevState,
      query,
      pos: currentSearchCursor,
      random: checked,
    }));
  };
  const handleLocaleChange: React.ChangeEventHandler<HTMLSelectElement> = ({
    target: { value },
  }) => {
    setTenorSearchParamsState((prevState) => ({
      ...prevState,
      query,
      pos: currentSearchCursor,
      locale: value as "ja_JP" | "en_US",
    }));
  };

  return (
    <div className="tenor-adder">
      <input
        type="text"
        value={query}
        onChange={handleUpdateQuery}
        onKeyDown={handleKeyDown}
        placeholder="Search GIFs"
      />
      <button
        onClick={performSearch}
        disabled={isLoading || !query}
        style={isLoading ? { cursor: "wait" } : {}}
      >
        {isLoading
          ? "Loading..."
          : currentSearchCursor && imageUrls.length
          ? "Next Page"
          : "Search"}
      </button>
      <button onClick={handleOmakase} title="Omakase">
        💡
      </button>
      <details>
        <summary>More Options</summary>
        <span>
          <input
            type="checkbox"
            name="isRandom"
            id="tenor-moreoptions-israndom"
            checked={tenorSearchParamsState.random}
            onChange={handleIsRandomChange}
          />
          <label htmlFor="tenor-moreoptions-israndom">Random?</label>
        </span>
        <span>
          Locale
          <select
            name="locale"
            onChange={handleLocaleChange}
            defaultValue={tenorSearchParamsState.locale}
          >
            <option value="ja_JP">ja_JP</option>
            <option value="en_US">en_US</option>
          </select>
        </span>
      </details>
      <Images imageUrls={imageUrls} />
      {gotError && <div>Got Error</div>}
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
