'use client';

import React, { createContext, useContext, useState } from 'react';

interface UserStatus {
  refreshUser: number;
  user: any;
  notificationHistory: Array<any>;
}

interface UserStatusContextProps extends UserStatus {
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setRefreshUser: React.Dispatch<React.SetStateAction<any>>;
  addNotificationHistory: React.Dispatch<React.SetStateAction<Array<any>>>;
}

const UserContext = createContext<UserStatusContextProps | undefined>(undefined);

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<any>(undefined);
  const [refreshUser, setRefreshUser] = useState(0);
  const [notificationHistory, addNotificationHistory] = useState<Array<any>>([]);

  return (
    <UserContext.Provider
      value={{
        user,
        refreshUser,
        notificationHistory,
        setUser,
        setRefreshUser,
        addNotificationHistory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserStatus = (): UserStatusContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserStatus must be used within a UserProvider');
  }
  return context;
};
