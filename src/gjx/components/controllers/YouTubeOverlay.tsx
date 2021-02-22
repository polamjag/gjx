import React, { useEffect, useState } from "react";
import { DefaultValue, selector, useRecoilState } from "recoil";
import { overlayStrategyState, SyncedAppState } from "../../atoms";

const youtubeVideoIdRegex = [
  /youtube\.com\/watch\?v=([\w-]+)/,
  /youtu\.be\/([\w-]+)/,
];

const extractVideoIdFromYouTubeUrl = (url: string): string | null => {
  let foundVideoId: string | null = null;

  youtubeVideoIdRegex.some((regex) => {
    const res = url.match(regex);
    foundVideoId = res && res[1];
    return foundVideoId;
  });

  return foundVideoId;
};

const youtubeEmbedStrategyState = selector<
  SyncedAppState["overlayStrategy"]["youtubeEmbed"]["state"]
>({
  key: "youtubeEmbedState",
  get: ({ get }) => {
    const state = get(overlayStrategyState);
    return state.youtubeEmbed.state;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(overlayStrategyState, (prevValue) => ({
        ...prevValue,
        youtubeEmbed: {
          name: "youtubeEmbed" as const,
          state: newValue,
        },
      }));
    }
  },
});
export const YouTubeOverlay: React.FC<{}> = () => {
  const [urlValue, setUrlValue] = useState<string>("");
  const [ytState, setYtState] = useRecoilState(youtubeEmbedStrategyState);

  const handleUrlChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setUrlValue(value);
  };

  useEffect(() => {
    if (urlValue === "") {
      setYtState({ videoId: "" });
    }
    const videoId = extractVideoIdFromYouTubeUrl(urlValue);
    if (videoId) {
      setYtState({ videoId });
    }
  }, [urlValue, setYtState]);

  return (
    <div className="youtube-overlay">
      <input
        type="text"
        placeholder="youtube.com/watch?v=hoge"
        value={urlValue}
        onChange={handleUrlChange}
        size={33}
      />
      {ytState.videoId && (
      <div className="youtube-overlay__thumbnail-preview">
        <img
          src={`https://img.youtube.com/vi/${ytState.videoId}/default.jpg`}
          alt=""
        />
        <img
          src={`https://img.youtube.com/vi/${ytState.videoId}/1.jpg`}
          alt=""
        />
        <img
          src={`https://img.youtube.com/vi/${ytState.videoId}/2.jpg`}
          alt=""
        />
        <img
          src={`https://img.youtube.com/vi/${ytState.videoId}/3.jpg`}
          alt=""
        />
      </div>
      )}
    </div>
  );
};
