import React, { useState, createContext, useContext } from 'react';

// Create the context
const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {

  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider value={{
      isLoading,
      setIsLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Finally creating the custom hook
export const useApp = () => useContext(AppContext);