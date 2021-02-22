import React from "react";
import { useRecoilValue } from "recoil";

import { overlayStrategyState, selectedImageState } from "../atoms";

export const Arena: React.FC<{}> = () => {
  const image = useRecoilValue(selectedImageState);

  if (!image) {
    return <div className="arena--content"></div>;
  }

  return (
    <>
      <img className="arena--content" src={image} alt="" />
      <Overlay />
    </>
  );
};

const Overlay: React.FC<{}> = () => {
  const overlayState = useRecoilValue(overlayStrategyState);

  if (overlayState?.youtubeEmbed?.state.videoId) {
    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${overlayState.youtubeEmbed.state.videoId}?autoplay=1&loop=1&disablekb=1&enablejsapi=1&controls=0`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={false}
        title="youtube embed"
        style={{pointerEvents: 'none'}}
      ></iframe>
    );
  } else {
    return <></>;
  }
};
