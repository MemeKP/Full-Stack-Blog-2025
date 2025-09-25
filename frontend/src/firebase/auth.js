import { auth } from "./firebase";
import {
    updatePassword,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";

export const doCreateUserWithEmailPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const dosignInWithEmailAndPassword = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        const token = await user.getIdToken();

        await fetch(`${import.meta.env.VITE_API_URL}/users/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                uid: user.uid,
                name: user.displayName || user.email.split('@')[0], 
                email: user.email,
                photoURL: user.photoURL,
            }),
        });

        return result;
    } catch (error) {
        console.error("Login failed: ", error);
        throw error;
    }
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // ดึง token
    const token = await user.getIdToken();

    // ส่งไป backend
    await fetch(`${import.meta.env.VITE_API_URL}/users/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            uid: user.uid,
            name: user.name,
            email: user.email,
            photoURL: user.photoURL,
        }),
    })
    //  result.user
    return result; // ส่งกลับให้ context ใช้ต่อได้
};

export const doSignOut = () => {
    return signOut(auth);
}

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email)
};
export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};