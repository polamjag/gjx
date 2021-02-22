import "./App.scss";

import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";

import { realtimeSyncMetaState } from "./atoms";
import { Arena } from "./components/Arena";
import { AddImageForm } from "./components/controllers/AddImageForm";
import { ImagesList } from "./components/controllers/ImagesList";
import { OverlayStrategySelector } from "./components/controllers/OverlayStrategySelector";
import { Switcher } from "./components/controllers/Switcher";
import { SwitchingStrategySelector } from "./components/controllers/SwitchingStrategySelector";
import { TenorAdder } from "./components/controllers/TenorAdder";
import { YouTubeOverlay } from "./components/controllers/YouTubeOverlay";
import { ControllerSection } from "./components/molecures/ControllerSection";
import { RealtimeSynchronizer } from "./components/RealtimeSynchonizer";
import { SyncIndicator } from "./components/SyncIndicator";
import { FirebaseContext } from "./firebaseContext";

const App: React.FC<{
  firebaseConfig: Object;
}> = ({ firebaseConfig }) => {
  const [showControllers, setShowControllers] = useState<boolean>(true);
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
          <RealtimeSynchronizer />
          <SyncIndicator />

          <Workspace showControllers={showControllers} />
        </RecoilRoot>
      </WithFirebase>
    </div>
  );
};

const Workspace: React.FC<{ showControllers: boolean }> = ({
  showControllers,
}) => {
  const realtimeSyncMeta = useRecoilValue(realtimeSyncMetaState);

  if (realtimeSyncMeta.synchronizationState !== "fresh") {
    return (
      <>
        <div className={showControllers ? "controllers" : "no-controllers"}>
          <ControllerSection title="Image Bin">
            <ImagesList />
            <AddImageForm />
          </ControllerSection>

          <ControllerSection title="Switcher">
            <SwitchingStrategySelector />
            <Switcher />
          </ControllerSection>

          <ControllerSection title="Tenor">
            <TenorAdder />
          </ControllerSection>

          <ControllerSection title="Takeoverlay™">
            <OverlayStrategySelector />
            <ControllerSection title="YouTube">
              <YouTubeOverlay />
            </ControllerSection>
          </ControllerSection>
        </div>

        <Arena />
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

const WithFirebase: React.FC<{ firebaseConfig: Object }> = ({
  firebaseConfig,
  children,
}) => {
  const [firebaseApp, setFirebaseApp] = useState<undefined | firebase.app.App>(
    undefined
  );
  useEffect(() => {
    setFirebaseApp(firebase.initializeApp(firebaseConfig));
  }, [firebaseConfig]);

  return (
    <FirebaseContext.Provider value={firebaseApp}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default App;
