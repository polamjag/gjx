import React from 'react';
import { useRecoilValue } from 'recoil';

import { activeOverlayStrategyNameState, overlayCompositionState, overlayStrategyState, selectedImageState } from '../atoms';
import { OverlayStrategyName } from '../types';
import { WithWindowSize } from './arena/WithWindowSize';
import { YouTubeIframeApi, YouTubePlayerContainer } from './arena/YouTubeEmbed';

export const Arena: React.FC<{}> = () => {
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