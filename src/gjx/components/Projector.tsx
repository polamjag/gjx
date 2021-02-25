import React from "react";
import { useRecoilValue } from "recoil";

import {
  activeOverlayStrategyNameState,
  overlayCompositionState,
  overlayStrategyState,
  selectedImageState,
} from "../atoms";
import { OverlayStrategies, OverlayStrategyName } from "../types";
import { WithWindowSize } from "./projectors/WithWindowSize";
import {
  YouTubeIframeApi,
  YouTubePlayerContainer,
} from "./projectors/YouTubeEmbed";

export const Projector: React.FC<{}> = () => {
  return (
    <WithWindowSize>
      <YouTubeIframeApi />
      <Overlay />
      <GIF />
    </WithWindowSize>
  );
};

const GIF: React.FC<{}> = () => {
  const image = useRecoilValue(selectedImageState);

  return image ? <img className="arena__content" src={image} alt="" /> : <></>;
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
    case "arbitaryIframe":
      return (
        <ArbitaryIframeOverlay state={overlayState.arbitaryIframe.state} />
      );
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
      className="arena__content__overlay-wrapper"
    >
      <OverlayForStrategyName overlayStrategyName={activeOverlayStrategyName} />
    </div>
  );
};

const ArbitaryIframeOverlay: React.FC<{
  state: OverlayStrategies["arbitaryIframe"]["state"];
}> = ({ state: { iframeSrc } }) => {
  return iframeSrc ? (
    <iframe
      src={iframeSrc}
      title="arbitary embedded iframe"
      className="arena__overlay__arbitary-iframe"
      sandbox="allow-scripts"
    ></iframe>
  ) : null;
};
