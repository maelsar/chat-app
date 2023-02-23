import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";

export const Authentication = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <Authentication.Provider value={{ currentUser }}>
      {children}
    </Authentication.Provider>
  );
};
