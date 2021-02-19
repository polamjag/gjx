import React, { useContext } from "react";
import "./App.css";
import type firebase from "firebase";

const FirebaseContext = React.createContext<
  ReturnType<typeof firebase.initializeApp> | undefined
>(undefined);

const App: React.FC<{
  firebase: ReturnType<typeof firebase.initializeApp>;
}> = ({ firebase }) => {
  return (
    <div className="App">
      <FirebaseContext.Provider value={firebase}>
        <SyncedInput />
      </FirebaseContext.Provider>
    </div>
  );
};

const SyncedInput: React.FC<{}> = () => {
  const a = useContext(FirebaseContext);
  const [gomi, setGomi] = React.useState<string>("");

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setGomi(ev.target.value);

    a?.database()
      .ref("gomi/sessions/fuga")
      .set({
        images: ["https://example.com", "https://example.org"],
        activeLayerIndex: 0,
        overlay: "https://hoge.example",
      });
  };

  return <input value={gomi} onChange={handleChange} autoCorrect="off" />;
};

export default App;
