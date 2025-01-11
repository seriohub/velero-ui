import React, { createContext, useContext, useState } from 'react';

interface LoggerStatus {
  apiRequest: Array<any>;
  apiResponse: Array<any>;
}

interface LoggerStatusContextProps extends LoggerStatus {
  addApiRequestHistory: React.Dispatch<React.SetStateAction<Array<any>>>;
  addApiResponseHistory: React.Dispatch<React.SetStateAction<Array<any>>>;
}

const LoggerStatusContext = createContext<LoggerStatusContextProps | undefined>(undefined);

export const LoggerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiRequest, addApiRequestHistory] = useState<Array<any>>([]);
  const [apiResponse, addApiResponseHistory] = useState<Array<any>>([]);

  return (
    <LoggerStatusContext.Provider
      value={{
        apiRequest,
        apiResponse,

        addApiRequestHistory,
        addApiResponseHistory,
      }}
    >
      {children}
    </LoggerStatusContext.Provider>
  );
};

export const useLoggerStatus = (): LoggerStatusContextProps => {
  const context = useContext(LoggerStatusContext);
  if (context === undefined) {
    throw new Error('useLoggerStatus must be used within an LoggerProvider');
  }
  return context;
};
