import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }){
    const [currentUser, setCurrentUser ] = useState(null);
    const [userLoggedIn, setUserLoggedIn ] = useState(false);
    const [loading, setLoading ] = useState(true);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(users) {
        //First check if the user is the valid value.
        if (users) {
            setCurrentUser({...users});
            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false); // ✅ ต้องใส่ตรงนี้ ไม่งั้น context จะไม่เคย render

    }

    //Expose the curent user and if the user is logged in or not
    const value = {
        currentUser,
        userLoggedIn,
        loading 
    }

    return (
       <AuthContext.Provider value={value}> 
            {!loading && children}
       </AuthContext.Provider>
    )
}