import React, { useState, createContext, useContext } from 'react';

// Create the context
const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExploded, setIsExploded] = useState(false);

  return (
    <AppContext.Provider value={{
      isLoading,
      setIsLoading,
      isExpanded,
      setIsExpanded,
      isExploded,
      setIsExploded,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);