import React, { useEffect, useState } from "react";
import "./App.css";
import type firebase from "firebase";
import { RecoilRoot } from "recoil";
import { FirebaseContext } from "./firebaseContext";

import { AddImageForm } from "./components/AddImageForm";
import { ImagesList } from "./components/ImagesList";
import { SwitchingStrategySelector } from "./components/SwitchingStrategySelector";
import { Switcher } from "./components/Switcher";
import { TenorAdder } from "./components/TenorAdder";
import { SyncIndicator } from "./components/SyncIndicator";
import { RealtimeSynchronizer } from "./components/RealtimeSynchonizer";
import { Arena } from "./components/Arena";

import { imagesState } from "./atoms";

const App: React.FC<{
  firebase: ReturnType<typeof firebase.initializeApp>;
  initialState: any;
}> = ({ firebase, initialState }) => {
  console.log("initial", initialState);
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
            set(imagesState, initialState?.images || []);
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
