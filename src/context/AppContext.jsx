import React, { useState, createContext, useContext } from 'react';

// Create the context
const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {

  const [config, setConfig] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isShowingSearch, setIsShowingSearch] = useState(false);
  const [mapLocations, setMapLocations] = useState([]);
  const [mapSearchText, setMapSearchText] = useState("");
  const [focusMapPin, setFocusMapPin] = useState("");
  const [adminDialogTitle, setAdminDialogTitle] = useState("");

  return (
    <AppContext.Provider value={{
      isLoading,
      setIsLoading,
      isLoadingAdmin,
      setIsLoadingAdmin,
      isExpanded,
      setIsExpanded,
      mapLocations,
      setMapLocations,
      focusMapPin,
      setFocusMapPin,
      isShowingSearch,
      setIsShowingSearch,
      mapSearchText,
      setMapSearchText,
      config,
      setConfig,
      adminDialogTitle,
      setAdminDialogTitle,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);