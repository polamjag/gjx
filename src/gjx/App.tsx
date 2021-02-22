import "./App.scss";

import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";

import { defaultState, syncedAppState } from "./atoms";
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

import type firebase from "firebase";

const App: React.FC<{
  firebase: ReturnType<typeof firebase.initializeApp>;
  initialState: any;
}> = ({ firebase, initialState }) => {
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
      <FirebaseContext.Provider value={firebase}>
        <RecoilRoot
          initializeState={({ set }) => {
            set(syncedAppState, { ...defaultState, ...initialState?.appState });
          }}
        >
          <RealtimeSynchronizer />
          <SyncIndicator />

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
        </RecoilRoot>
      </FirebaseContext.Provider>
    </div>
  );
};

export default App;
