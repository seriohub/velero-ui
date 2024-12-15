import React, { createContext, useContext, useEffect, useState } from 'react';
import { env } from 'next-runtime-env';
import { useDisclosure } from '@mantine/hooks';
import { Open_Sans } from 'next/font/google';
const open_sans = Open_Sans({ subsets: ['latin'] });

interface UIState {
  primaryColor: any;
  uiFontFamily: any;
  uiFontSize: any | undefined;
  navbarColored: boolean;
  mainColored: boolean;
}

interface UIStateContextProps extends UIState {
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
  setUiFontFamily: React.Dispatch<React.SetStateAction<any>>;
  setUiFontSize: React.Dispatch<React.SetStateAction<any>>;
  setNavbarColored: React.Dispatch<React.SetStateAction<any>>;
  setMainColored: React.Dispatch<React.SetStateAction<any>>;
}

const UIStateContext = createContext<UIStateContextProps | undefined>(undefined);

export const UIStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState('blue');

  const [uiFontFamily, setUiFontFamily] = useState({ name: 'open sans', fontFamily: open_sans });
  const [uiFontSize, setUiFontSize] = useState(undefined);
  const [navbarColored, setNavbarColored] = useState(false);
  const [mainColored, setMainColored] = useState(false);

  return (
    <UIStateContext.Provider
      value={{
        primaryColor,

        uiFontFamily,
        uiFontSize,
        navbarColored,
        mainColored,

        setPrimaryColor,
        setUiFontFamily,
        setUiFontSize,
        setNavbarColored,
        setMainColored
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
};

export const useUIState = (): UIStateContextProps => {
  const context = useContext(UIStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
