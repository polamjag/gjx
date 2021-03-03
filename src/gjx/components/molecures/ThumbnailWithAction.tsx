import React from "react";

interface Props {
  thumbnailUrl: string;
  buttonLabel: string;
  onClickButton: () => void;
}

export const ThumbnailWithAction: React.FC<Props> = ({
  thumbnailUrl,
  buttonLabel,
  onClickButton,
}) => {
  return (
    <div className="thumbnail-with-action">
      <img src={thumbnailUrl} alt="" />
      <button className="thumbnail-with-action__button" onClick={onClickButton}>
        {buttonLabel}
      </button>
    </div>
  );
};
