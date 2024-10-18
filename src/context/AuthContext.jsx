import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import {
  fetchDocument
} from '../utils/utils';

import { auth } from '../firebase';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState({});
  const [userDocuments, setUserDocuments] = useState({});

  const signIn = (email, password) =>  {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("SFF: currentUser", auth.currentUser);
      setUser(auth.currentUser);

      if (!currentUser) return;

      fetchDocument("users", currentUser.uid, (data) => {
        setUserDocuments(data);
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userDocuments, logout, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);