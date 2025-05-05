import { auth } from "./firebase";
import { updatePassword,sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const doCreateUserWithEmailPassword =  async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}; 

export const dosignInWithEmailAndPassword = (email, password) => {
    try {
        return signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
        console.error("Login failed: ", error);
        throw error;
    }
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
  //  result.user
  return result;
};

export const doSignOut = () => {
    return auth.signOut();
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email)
};
export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, {
        url: `${window.location.origin}/home` ,
    });
};