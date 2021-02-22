import "./App.scss";

import React, { useEffect, useState } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";

import { Arena } from "./components/Arena";
import { AddImageForm } from "./components/controllers/AddImageForm";
import { ImagesList } from "./components/controllers/ImagesList";
import { Switcher } from "./components/controllers/Switcher";
import { SwitchingStrategySelector } from "./components/controllers/SwitchingStrategySelector";
import { TenorAdder } from "./components/controllers/TenorAdder";
import { ControllerSection } from "./components/molecures/ControllerSection";
import { RealtimeSynchronizer } from "./components/RealtimeSynchonizer";
import { SyncIndicator } from "./components/SyncIndicator";
import { FirebaseContext } from "./firebaseContext";

import firebase from "firebase";
import { realtimeSyncMetaState } from "./atoms";

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

          <Surface showControllers={showControllers} />
        </RecoilRoot>
      </WithFirebase>
    </div>
  );
};

const Surface: React.FC<{ showControllers: boolean }> = ({
  showControllers,
}) => {
  const realtimeSyncMeta = useRecoilValue(realtimeSyncMetaState);

  if (realtimeSyncMeta.initialStateSynced) {
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
        </div>

        <Arena />
      </>
    );
  } else {
    return <>syncing</>;
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
