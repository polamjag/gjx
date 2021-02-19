import React from "react";
import "./App.css";
import type firebase from "firebase";
import { RecoilRoot } from "recoil";
import { FirebaseContext } from "./firebaseContext";

import { AddImageForm } from "./components/AddImageForm";
import { ImagesList } from "./components/ImagesList";
import { SwitchingStrategySelector } from "./components/SwitchingStrategySelector";
import { Switcher } from "./components/Switcher";
import { RealtimeSynchronizer } from "./components/RealtimeSynchonizer";
import { Arena } from "./components/Arena";

import { imagesState } from "./atoms";

const App: React.FC<{
  firebase: ReturnType<typeof firebase.initializeApp>;
  initialState: any;
}> = ({ firebase, initialState }) => {
  console.log("initial", initialState);
  return (
    <div className="App">
      <FirebaseContext.Provider value={firebase}>
        <RecoilRoot
          initializeState={({ set }) => {
            set(imagesState, initialState?.images || []);
          }}
        >
          <RealtimeSynchronizer />

          <div className="controllers">
            <ImagesList />
            <AddImageForm />
            <SwitchingStrategySelector />
            <Switcher />
          </div>

          <Arena />
        </RecoilRoot>
      </FirebaseContext.Provider>
    </div>
  );
};

export default App;
