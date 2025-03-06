import React,{useContext,useState,useEffect} from 'react'
import Cookies from "js-cookie";

const AuthContext= React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}){

    const [currentUser,setCurrentUser] = useState(false)

    const value ={
        currentUser,
        setCurrentUser
    }
    useEffect(()=>{
        let data = Cookies.get('sessionid')
        if(data != -1)
            setCurrentUser(true);
    })
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}