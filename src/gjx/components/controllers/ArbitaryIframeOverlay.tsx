import React, { useState } from "react";
import { DefaultValue, selector, useRecoilState } from "recoil";
import { overlayStrategyState, SyncedAppState } from "../../atoms";

const arbitaryIframeState = selector<
  SyncedAppState["overlayStrategy"]["arbitaryIframe"]["state"]
>({
  key: "arbitaryIframeSelector",
  get: ({ get }) => {
    const state = get(overlayStrategyState);
    return state.arbitaryIframe.state;
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(overlayStrategyState, (prevValue) => ({
        ...prevValue,
        arbitaryIframe: {
          name: "arbitaryIframe" as const,
          state: newValue,
        },
      }));
    }
  },
});

export const IframeSetter: React.FC<{}> = () => {
  const [state, setState] = useRecoilState(arbitaryIframeState);
  const [srcValue, setSrcValue] = useState<string>("");

  const handleUrlChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setSrcValue(value);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({
    key,
  }) => {
    if (key === "Enter") {
      handleSetUrl();
    }
  };

  const handleSetUrl = () => {
    setState({ iframeSrc: srcValue });
  };

  const handleRemoveCurrentIframeSrc = () => {
    setState({});
  };

  return (
    <div className="arbitary-iframe-overlay">
      <input
        type="text"
        placeholder="https://example.com/embeddable"
        value={srcValue}
        onChange={handleUrlChange}
        onKeyDown={handleKeyDown}
        size={33}
      />
      <button onClick={handleSetUrl} disabled={!srcValue}>
        Load
      </button>
      {state?.iframeSrc && (
        <div className="arbitary-iframe-overlay__getset">
          Ready:
          <a href={state.iframeSrc} target="_blank" rel="noopener noreferrer">
            {state.iframeSrc}
          </a>{" "}
          <button onClick={handleRemoveCurrentIframeSrc}>Unload</button>
        </div>
      )}
    </div>
  );
};
