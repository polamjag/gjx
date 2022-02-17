import "./Home.scss";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "./GJXLogo.svg";

export const Home: React.FC<{}> = () => {
  const [projectId, setProjectId] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");

  const handleChangeProjectId: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setProjectId(value);
  };
  const handleChangeApiKey: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setApiKey(value);
  };

  const navigate = useNavigate();

  const handleStartSession = () => {
    navigate(`/sessions/${projectId}/${apiKey}`);
  };

  return (
    <div className="page__home">
      <img src={logo} alt="" className="logo" />
      <h1>GJX: GIF JOCKEY X</h1>
      <div className="session-info-form">
        <input
          type="text"
          value={projectId}
          onChange={handleChangeProjectId}
          placeholder="projectId-123ab"
          size={15}
        />
        <input
          type="text"
          value={apiKey}
          onChange={handleChangeApiKey}
          placeholder="superiorApiKey"
          size={15}
        />
        <button
          className="start-session"
          onClick={handleStartSession}
          disabled={!(projectId && apiKey)}
        >
          Start Session
        </button>
      </div>
      <p>
        Please prepare your own Firebase project (with Realtime Database
        enabled) and it's API key
      </p>
      <p>
        Respect{" "}
        <a
          href="https://github.com/kosendj/gj"
          target="_blank"
          rel="noreferrer noopenner"
        >
          kosendj/gj
        </a>
      </p>
    </div>
  );
};
