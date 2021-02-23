import firebase from "firebase/app";
import "firebase/database";

import React, { createContext, useEffect, useState } from "react";

export const WithFirebase: React.FC<{ firebaseConfig: Object }> = ({
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

export const FirebaseContext = createContext<
  ReturnType<typeof firebase.initializeApp> | undefined
>(undefined);
