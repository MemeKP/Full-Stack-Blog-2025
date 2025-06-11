import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { sendUserToServer } from "../../utils/sendUserToServer";
const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

const getFirebaseToken = async () => {
    if (auth.currentUser) {
        return await auth.currentUser.getIdToken();
    }
    return null;
};

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(users) {
        //First check if the user is the valid value.
        if (users) {
            // const user = await sendUserToServer(users) //ดึง user จาก backend
            setCurrentUser({...users}); // ใช้ FirebaseUser
            // setCurrentUser(user) //แทนที่ FirebaseUser ด้วย MongoDB user ที่มี _id
            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false); //ต้องใส่ตรงนี้ ไม่งั้น context จะไม่เคย render

    }

    //Expose the curent user and if the user is logged in or not
    const value = {
        currentUser,
        userLoggedIn,
        // userLoggedIn: currentUser, // เปลี่ยนตรงนี้
        // isLoggedIn: userLoggedIn,  // เพิ่ม flag ไว้เช็กว่า login แล้วมั้ย
        loading,
        getFirebaseToken,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}