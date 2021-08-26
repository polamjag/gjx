import { initializeApp } from "firebase/app";

import React, { createContext, useEffect, useState } from "react";

export const WithFirebase: React.FC<{ firebaseConfig: Object }> = ({
  firebaseConfig,
  children,
}) => {
  const [firebaseApp, setFirebaseApp] = useState<undefined | ReturnType<typeof initializeApp>>(
    undefined
  );
  useEffect(() => {
    if (!firebaseApp) {
      setFirebaseApp(initializeApp(firebaseConfig));
    }
  }, [firebaseApp, firebaseConfig]);

  return (
    <FirebaseContext.Provider value={firebaseApp}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const FirebaseContext = createContext<
  ReturnType<typeof initializeApp> | undefined
>(undefined);
