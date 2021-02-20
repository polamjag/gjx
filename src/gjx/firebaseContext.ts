import { createContext } from "react";

import type firebase from "firebase";

export const FirebaseContext = createContext<
  ReturnType<typeof firebase.initializeApp> | undefined
>(undefined);
