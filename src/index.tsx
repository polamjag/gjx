import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";

import App from "./gjx/App";
import reportWebVitals from "./reportWebVitals";

const firebaseConfig = {
  apiKey: "AIzaSyB2jJu7vUNztDiVbaDTvjKAFjRZQzDCDfo",
  databaseURL: "https://gjxgjx-35640-default-rtdb.firebaseio.com",
  projectId: "gjxgjx-35640",
};

(async () => {
  ReactDOM.render(
    <React.StrictMode>
      <App firebaseConfig={firebaseConfig} />
    </React.StrictMode>,
    document.getElementById("root")
  );
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
