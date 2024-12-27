import React, { createContext, useContext, useState } from 'react';

interface UserStatus {
  refreshUser: number;
  user: any;
  notificationHistory: Array<any>;
  // socketHistory: Array<string>;
}

interface UserStatusContextProps extends UserStatus {
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setRefreshUser: React.Dispatch<React.SetStateAction<any>>;
  addNotificationHistory: React.Dispatch<React.SetStateAction<Array<any>>>;
  // addSocketHistory: React.Dispatch<React.SetStateAction<Array<string>>>;
}

const UserContext = createContext<UserStatusContextProps | undefined>(undefined);

export const UserProvider: React.FC<{
  children: React.ReactNode;
  initialUser: any;
}> = ({ children, initialUser }) => {
  const [user, setUser] = useState<any>(initialUser);
  const [refreshUser, setRefreshUser] = useState(0);
  const [notificationHistory, addNotificationHistory] = useState<Array<any>>([]);
  // const [socketHistory, addSocketHistory] = useState<Array<string>>([]);
  return (
    <UserContext.Provider
      value={{
        user,
        refreshUser,
        notificationHistory,
        // socketHistory,
        setUser,
        setRefreshUser,
        addNotificationHistory,
        // addSocketHistory,
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
