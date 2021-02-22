import "./Home.scss";

import React, { useState } from "react";
import { Link } from "react-router-dom";

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

  return (
    <div className="page__home">
      <h1>GJX: GIF JOCKEY X</h1>
      <div className="session-info-form">
        <input
          type="text"
          value={projectId}
          onChange={handleChangeProjectId}
          placeholder="ultraProject-123ab"
          size={15}
        />
        <input
          type="text"
          value={apiKey}
          onChange={handleChangeApiKey}
          placeholder="marvellousApiKey"
          size={15}
        />
        <Link
          to={`/sessions/${projectId}/${apiKey}`}
          className="start-session button-like"
        >
          Start Session
        </Link>
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
