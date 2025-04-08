import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

interface AuthContextType{
    user:User | null ;
    logout:()=>void
}

const AuthContext=createContext<AuthContextType | null>(null)

export const AuthProvider:React.FC<{children:React.ReactNode}>=({children})=>{
        const [user,setUser]=useState<User | null>(null)

        useEffect(()=>{
            const unsubscribe=onAuthStateChanged(auth,(currentUser)=>{
                setUser(currentUser);
                if(currentUser){
                    localStorage.setItem('user',JSON.stringify(currentUser))
                }else{
                    localStorage.removeItem('user')
                }
            })
            return ()=>unsubscribe();
        },[])

        const logout=()=>{
                signOut(auth)
                setUser(null)
                localStorage.removeItem('user')
        }

        return (
            <AuthContext.Provider value={{user,logout}}>
                {children}
            </AuthContext.Provider>
        )
}

export const useAuth=()=>useContext(AuthContext)