import "./App.css";

import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";

import { defaultState, syncedAppState } from "./atoms";
import { AddImageForm } from "./components/AddImageForm";
import { Arena } from "./components/Arena";
import { ImagesList } from "./components/ImagesList";
import { RealtimeSynchronizer } from "./components/RealtimeSynchonizer";
import { Switcher } from "./components/Switcher";
import { SwitchingStrategySelector } from "./components/SwitchingStrategySelector";
import { SyncIndicator } from "./components/SyncIndicator";
import { TenorAdder } from "./components/TenorAdder";
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
            <ImagesList />
            <AddImageForm />
            <SwitchingStrategySelector />
            <Switcher />

            <TenorAdder />
          </div>

          <Arena />
        </RecoilRoot>
      </FirebaseContext.Provider>
    </div>
  );
};

export default App;
