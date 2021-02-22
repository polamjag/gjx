import "./App.scss";

import React, { useEffect, useState } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";

import { realtimeSyncMetaState } from "./atoms";
import { AddImageForm } from "./components/controllers/AddImageForm";
import { ImagesList } from "./components/controllers/ImagesList";
import { OverlayMixer } from "./components/controllers/OverlayMixer";
import { OverlayStrategySelector } from "./components/controllers/OverlayStrategySelector";
import { Switcher } from "./components/controllers/Switcher";
import { SwitchingStrategySelector } from "./components/controllers/SwitchingStrategySelector";
import { TenorPicker } from "./components/controllers/TenorPicker";
import { YouTubeOverlay } from "./components/controllers/YouTubeOverlay";
import { ControllerSection } from "./components/molecures/ControllerSection";
import { Projector } from "./components/Projector";
import { RealtimeSynchronizer } from "./components/RealtimeSynchonizer";
import { SyncIndicator } from "./components/SyncIndicator";
import { WithFirebase } from "./components/WithFirebase";
import { useParams } from "react-router-dom";

const GJXApp: React.FC<{}> = () => {
  const [showControllers, setShowControllers] = useState<boolean>(true);
  const { projectId, apiKey, rtdbKey = 'gjxSession/' } = useParams<{
    projectId: string;
    apiKey: string;
    rtdbKey: string;
  }>();
  const firebaseConfig = {
    projectId,
    apiKey,
    databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
  };

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    const ops = location.hash.substring(1).split(",");
    if (ops.includes("nocontrollers")) {
      setShowControllers(false);
    }
  }, [setShowControllers]);

  return (
    <div className="App">
      <WithFirebase firebaseConfig={firebaseConfig}>
        <RecoilRoot>
          <Dancefloor showControllers={showControllers} />

          <RealtimeSynchronizer rtdbKey={rtdbKey} />
          <SyncIndicator />
        </RecoilRoot>
      </WithFirebase>
    </div>
  );
};

const Dancefloor: React.FC<{ showControllers: boolean }> = ({
  showControllers,
}) => {
  const realtimeSyncMeta = useRecoilValue(realtimeSyncMetaState);

  if (realtimeSyncMeta.synchronizationState !== "fresh") {
    return (
      <>
        <Projector />

        <div className={showControllers ? "controllers" : "no-controllers"}>
          <ControllerSection title="GIF">
            <ControllerSection title="Image Bin">
              <ImagesList />
              <AddImageForm />
            </ControllerSection>

            <ControllerSection title="Switcher">
              <SwitchingStrategySelector />
              <Switcher />
            </ControllerSection>

            <ControllerSection title="Tenor">
              <TenorPicker />
            </ControllerSection>
          </ControllerSection>

          <ControllerSection title="Overlay">
            <OverlayStrategySelector />
            <OverlayMixer />
            <ControllerSection title="YouTube">
              <YouTubeOverlay />
            </ControllerSection>
          </ControllerSection>
        </div>
      </>
    );
  } else {
    return (
      <div className="splash-screen">
        <div className="splash-screen__title">GIF JOCKEY X</div>
        {realtimeSyncMeta.initializationError && (
          <div className="splash-screen__error">
            Unexpected Error in Initialization Phase:
            <br />
            <code>{JSON.stringify(realtimeSyncMeta.initializationError)}</code>
          </div>
        )}
      </div>
    );
  }
};

export default GJXApp;
