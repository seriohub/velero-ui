import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

interface UIStatus {
  primaryColor: any;
  uiFontFamily: any;
  uiFontSize: any | undefined;
  navbarColored: boolean;
  mainColored: boolean;
  showBottomDebugBar: boolean;
  showDebugAside: boolean;
  openedUIDrawer: boolean;
  isMobile: boolean | undefined;
}

interface UIStatusContextProps extends UIStatus {
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
  setUiFontFamily: React.Dispatch<React.SetStateAction<any>>;
  setUiFontSize: React.Dispatch<React.SetStateAction<any>>;
  setNavbarColored: React.Dispatch<React.SetStateAction<any>>;
  setMainColored: React.Dispatch<React.SetStateAction<any>>;
  setShowDebugAside: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBottomDebugBar: React.Dispatch<React.SetStateAction<boolean>>;
  toggleUIDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const UIStateContext = createContext<UIStatusContextProps | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState('blue');

  const [uiFontFamily, setUiFontFamily] = useState({
    name: 'Open Sans',
    fontFamily: 'Open Sans',
  });
  const [uiFontSize, setUiFontSize] = useState(undefined);
  const [navbarColored, setNavbarColored] = useState(false);
  const [mainColored, setMainColored] = useState(false);

  const [showDebugAside, setShowDebugAside] = useState(false);
  const [showBottomDebugBar, setShowBottomDebugBar] = useState(false);
  const [openedUIDrawer, { toggle: toggleUIDrawer }] = useDisclosure();
  const [isMobile, setIsMobile] = useState(useMediaQuery('(max-width: 1024px)'));

  useEffect(() => {
    setShowDebugAside(localStorage.getItem('showDebugAside') === 'true' || false);

    setShowBottomDebugBar(localStorage.getItem('showBottomDebugBar') === 'true' || false);
  }, []);

  useEffect(() => {
    localStorage.setItem('showDebugAside', showDebugAside.toString());
  }, [showDebugAside]);

  useEffect(() => {
    localStorage.setItem('showBottomDebugBar', showBottomDebugBar.toString());
  }, [showBottomDebugBar]);

  return (
    <UIStateContext.Provider
      value={{
        primaryColor,

        uiFontFamily,
        uiFontSize,
        navbarColored,
        mainColored,

        showBottomDebugBar,
        showDebugAside,
        openedUIDrawer,
        isMobile,

        setPrimaryColor,

        setUiFontFamily,
        setUiFontSize,
        setNavbarColored,
        setMainColored,

        setShowDebugAside,
        setShowBottomDebugBar,

        toggleUIDrawer,

        setIsMobile,
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
};

export const useUIStatus = (): UIStatusContextProps => {
  const context = useContext(UIStateContext);
  if (context === undefined) {
    throw new Error('useUIStatus must be used within an AppStateProvider');
  }
  return context;
};
