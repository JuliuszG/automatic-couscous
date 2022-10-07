import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

type Props = {
    children: ReactNode,
    userValue?: Value
}

interface Value {
    id: string,
    role: string,
    token: string,
    username?: string
}

interface SharedValue extends Value {
    setNewUserData: (newUserData: Value) => void
}

const defaultValue = {
    id: '',
    role: '',
    token: '',
    username: '',
    setNewUserData: () => null
}

const Context = createContext<SharedValue>(defaultValue);

export const useUserData = () => {
    const userData = useContext<SharedValue>(Context)
    return userData
}

export const UserProvider = ({userValue, children }: Props) => {
    const [userData, setUserData] = useState<Value>(defaultValue)

    const setNewUserData = (newUserData: Value) => {
        setUserData(prev => {
            return {
                ...prev,
                ...newUserData
            }
        })
    }

    const value: SharedValue = {
        ...userData,
        setNewUserData
    }

    useEffect(()=>{
        userValue && setNewUserData(userValue)
    },[userValue])

    return <Context.Provider value={value}>{children}</Context.Provider>
}