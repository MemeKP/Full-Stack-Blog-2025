import { auth } from "./firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, s } from "firebase/auth";

export const doCreateUserWithEmailPassword =  async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}; 

export const dosignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth,email,password);
}

export const 