import React, { createContext, useContext, useState } from 'react'

interface UserState {
    // apiRequest: Array<any>
    // apiResponse: Array<any>
    // socketStatus: string
    // notificationHistory: Array<any>
    // messagesHistory: Array<string>
    refreshUser: number
    user: any
    // organizations: any
    // projects: any
    // currentOrganization: any
    // currentOrganizationPermissions: any
    // currentProject: any
    // currentProjectPermissions: any
    // hasWbsLock: boolean;
}

interface UserContextProps extends UserState {
    // setApiRequest: React.Dispatch<React.SetStateAction<Array<any>>>
    // setApiResponse: React.Dispatch<React.SetStateAction<Array<any>>>
    // setSocketStatus: React.Dispatch<React.SetStateAction<string>>
    // setNotificationHistory: React.Dispatch<React.SetStateAction<Array<any>>>
    // setMessageHistory: React.Dispatch<React.SetStateAction<Array<string>>>
    setUser: React.Dispatch<React.SetStateAction<any>>
    // setOrganizations: React.Dispatch<React.SetStateAction<any>>
    // setProjects: React.Dispatch<React.SetStateAction<any>>
    // setCurrentOrganization: React.Dispatch<React.SetStateAction<any>>
    // setCurrentProject: React.Dispatch<React.SetStateAction<any>>
    // setRefreshCurrentProject: React.Dispatch<React.SetStateAction<any>>
    setRefreshUser: React.Dispatch<React.SetStateAction<any>>
    // setHasWesLock: React.Dispatch<React.SetStateAction<any>>
    // setCurrentProjectPermissions: React.Dispatch<React.SetStateAction<any>>
    // setCurrentOrganizationPermissions: React.Dispatch<React.SetStateAction<any>>
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider: React.FC<{
    children: React.ReactNode
    initialUser: any
}> = ({ children, initialUser }) => {
    // const [apiRequest, setApiRequest] = useState<Array<any>>([])
    // const [apiResponse, setApiResponse] = useState<Array<any>>([])
    // const [socketStatus, setSocketStatus] = useState<string>('')
    // const [notificationHistory, setNotificationHistory] = useState<Array<any>>(
    //    [],
    //)
    const [user, setUser] = useState<any>(initialUser)
    // const [organizations, setOrganizations] = useState<any>(null) // Puoi inizializzare diversamente se necessario
    // const [projects, setProjects] = useState<any>(null) // Puoi inizializzare diversamente se necessario
    // const [currentProject, setCurrentProject] = useState<any>(null)
    // const [currentOrganization, setCurrentOrganization] = useState<any>(null)
    // const [currentOrganizationPermissions, setCurrentOrganizationPermissions] =
    //     useState<any>(null)
    // const [currentProjectPermissions, setCurrentProjectPermissions] =
    //     useState<any>(null)
    // const [messagesHistory, setMessageHistory] = useState<Array<string>>([])
    const [refreshUser, setRefreshUser] = useState(0)
    // const [refreshCurrentProject, setRefreshCurrentProject] = useState(0)
    // const [hasWbsLock, setHasWesLock] = useState(false);
    return (
        <UserContext.Provider
            value={{
                // apiRequest,
                // apiResponse,
                // socketStatus,
                // notificationHistory,
                // messagesHistory,
                user,
                // organizations,
                // projects,
                // currentOrganization,
                // currentProject,
                // currentProjectPermissions,
                // currentOrganizationPermissions,
                refreshUser,
                // refreshCurrentProject,
                // hasWbsLock,
                // setApiRequest,
                // setApiResponse,
                // setSocketStatus,
                // setNotificationHistory,
                // setMessageHistory,
                setUser,
                // setOrganizations,
                // setProjects,
                // setCurrentOrganization,
                // setCurrentProject,
                // setCurrentOrganizationPermissions,
                // setCurrentProjectPermissions,
                setRefreshUser,
                // setRefreshCurrentProject,
                // setHasWesLock
            }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserCtx = (): UserContextProps => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUserCtx must be used within a UserProvider')
    }
    return context
}
