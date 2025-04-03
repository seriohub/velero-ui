'use client';

import React, { createContext, useContext, useState } from 'react';
import { useAppWebSocket } from '@/hooks/context/useAppWebSocket';

interface SocketStatus {
  socketHistory: Array<string>;
}

interface SocketStatusContextProps extends SocketStatus {
  addSocketHistory: React.Dispatch<React.SetStateAction<Array<string>>>;
  sendMessageToSocket: (message: string) => void;
}

const SocketContext = createContext<SocketStatusContextProps | undefined>(undefined);

export const SocketProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [socketHistory, addSocketHistory] = useState<Array<string>>([]);
  const { sendMessage } = useAppWebSocket({ addSocketHistory });

  const sendMessageToSocket = (message: string) => {
    if (sendMessage) {
      sendMessage(message);
    } else {
      console.warn('WebSocket not ready.');
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socketHistory,
        sendMessageToSocket,
        addSocketHistory,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketStatus = (): SocketStatusContextProps => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocketStatus must be used within a SocketProvider');
  }
  return context;
};
