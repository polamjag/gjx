import React from "react";
import firebase from "firebase";
import "./App.css";

const firebaseConfig = {
  apiKey: "AIzaSyB2jJu7vUNztDiVbaDTvjKAFjRZQzDCDfo",
  authDomain: "gjxgjx-35640.firebaseapp.com",
  databaseURL: "https://gjxgjx-35640-default-rtdb.firebaseio.com",
  projectId: "gjxgjx-35640",
  storageBucket: "gjxgjx-35640.appspot.com",
  messagingSenderId: "192829888990",
  appId: "1:192829888990:web:75b160ac76dae99555654f",
};

const fb = firebase.initializeApp(firebaseConfig);
const database = fb.database();

function App() {
  const [gomi, setGomi] = React.useState<string>("");
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setGomi(ev.target.value);

    database.ref("gomi/").set({
      contents: ev.target.value,
    });
  };

  return (
    <div className="App">
      <input value={gomi} onChange={handleChange} autoCorrect='off' />
    </div>
  );
}

export default App;
