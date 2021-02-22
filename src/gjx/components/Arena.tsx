import React, { useContext, useEffect, useRef, useState } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";

import {
  activeOverlayStrategyNameState,
  overlayCompositionState,
  overlayStrategyState,
  selectedImageState,
  SyncedAppState,
} from "../atoms";
import { OverlayStrategyName } from "../types";

export const Arena: React.FC<{}> = () => {
  return (
    <WithWindowSize>
      <YouTubeIframeApi />
      <Overlay />
      <GIF />
    </WithWindowSize>
  );
};

interface WindowSize {
  width: number;
  height: number;
}

const WindowSizeContext = React.createContext<WindowSize>({
  height: window.top.innerHeight,
  width: window.top.innerWidth,
});

const WithWindowSize: React.FC<{}> = ({ children }) => {
  const [size, setSize] = useState<WindowSize>({
    height: window.top.innerHeight,
    width: window.top.innerWidth,
  });
  const updateWindowSizeInfo = () => {
    setSize({
      height: window.top.innerHeight,
      width: window.top.innerWidth,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowSizeInfo);

    return () => {
      window.removeEventListener("resize", updateWindowSizeInfo);
    };
  }, []);

  return (
    <WindowSizeContext.Provider value={size}>
      {children}
    </WindowSizeContext.Provider>
  );
};

const GIF: React.FC<{}> = () => {
  const image = useRecoilValue(selectedImageState);

  return image ? <img className="arena--content" src={image} alt="" /> : <></>;
};

const OverlayForStrategyName: React.FC<{
  overlayStrategyName: OverlayStrategyName;
}> = ({ overlayStrategyName }) => {
  const overlayState = useRecoilValue(overlayStrategyState);

  switch (overlayStrategyName) {
    case "empty":
      return null;
    case "youtubeEmbed":
      return <YouTubePlayerContainer state={overlayState.youtubeEmbed.state} />;
  }
};

const Overlay: React.FC<{}> = () => {
  const activeOverlayStrategyName = useRecoilValue(
    activeOverlayStrategyNameState
  );
  const overlayComposition = useRecoilValue(overlayCompositionState);

  return (
    <div
      style={{ mixBlendMode: overlayComposition.blendMode }}
      className="arena--content--overlay-wrapper"
    >
      <OverlayForStrategyName overlayStrategyName={activeOverlayStrategyName} />
    </div>
  );
};

const overlayYouTubePlayerId = "overlay-youtube-player";

interface YouTubeIframeApiState {
  isReady: boolean;
}
const youtubeIframeApiState = atom<YouTubeIframeApiState>({
  key: "youtubeIframeApi",
  default: {
    isReady: false,
  },
});

const YouTubePlayerContainer: React.FC<{
  state: SyncedAppState["overlayStrategy"]["youtubeEmbed"]["state"];
}> = ({ state }) => {
  if (!state?.videoId) {
    return null;
  }

  return <YouTubePlayer videoId={state.videoId} />;
};

const YouTubePlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
  // https://developers.google.com/youtube/iframe_api_reference

  const [overlayStrategy, setOverlayStrategy] = useRecoilState(
    overlayStrategyState
  );

  const yt = useRecoilValue(youtubeIframeApiState);
  const playerRef = useRef<YT.Player | undefined>(undefined);

  useEffect(() => {
    if (yt.isReady) {
      const player = new YT.Player(overlayYouTubePlayerId, {
        videoId,
        playerVars: {
          modestbranding: 1,
          enablejsapi: 1,
          loop: 1,
          disablekb: 1,
          controls: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.setLoop(true);
            event.target.mute();
            const duration = event.target.getDuration();
            const relativePos =
              overlayStrategy.youtubeEmbed.state?.relativeRoughSeekPosition;
            if (duration && relativePos) {
              event.target.seekTo(duration * relativePos, true);
            }
            event.target.playVideo();
          },
        },
      });
      playerRef.current = player;

      player.addEventListener("onStateChange", () => {
        player.playVideo && player.playVideo();
        playerRef.current?.playVideo && playerRef.current?.playVideo();
      });
    }
    // initentionally ignore overlayStrategy.youtubeEmbed.state?.relativeRoughSeekPosition as dependency
    // in order to avoid infinite-loop in sync
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, yt]);

  const windowSize = useContext(WindowSizeContext);
  let styleToSet: React.CSSProperties = {};
  if ((windowSize.height / 9) * 16 > windowSize.width) {
    styleToSet = {
      width: (windowSize.height / 9) * 16,
      height: windowSize.height,
      left: ((windowSize.height / 9) * 16 - windowSize.width) / -2,
    };
  } else {
    styleToSet = {
      width: windowSize.width,
      height: (windowSize.width / 16) * 9,
      top: ((windowSize.width / 16) * 9 - windowSize.height) / -2,
    };
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      const time = playerRef.current?.getCurrentTime();
      const duration = playerRef.current?.getDuration();

      if (!time || !duration) {
        return;
      }

      setOverlayStrategy((prevState) => ({
        ...prevState,
        youtubeEmbed: {
          name: "youtubeEmbed" as const,
          state: {
            videoId,
            relativeRoughSeekPosition: time / duration,
          },
        },
      }));
    }, 10000);
    return () => window.clearInterval(timer);
  }, [setOverlayStrategy, videoId]);

  return (
    <>
      <iframe
        src={`https://www.youtube.com/embed/${encodeURIComponent(
          videoId
        )}?autoplay=0&loop=1&disablekb=1&enablejsapi=1&controls=0&playsinline=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="youtube embed"
        style={styleToSet}
        id={overlayYouTubePlayerId}
        className="arena__overlay__youtubeEmbed"
      ></iframe>
    </>
  );
};

const YouTubeIframeApi: React.FC<{}> = () => {
  // https://developers.google.com/youtube/iframe_api_reference

  const [yt, setYt] = useRecoilState(youtubeIframeApiState);

  useEffect(() => {
    if (!yt.isReady) {
      var tag = document.createElement("script");

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      // @ts-ignore
      window.onYouTubeIframeAPIReady = () => {
        setYt((prev) => ({ ...prev, isReady: true }));
      };
    }
  }, [yt, setYt]);

  return <></>;
};
