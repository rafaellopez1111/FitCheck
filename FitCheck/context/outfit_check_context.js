import { router } from '../services/router';
import {
    onAuthStateChanged,
    signInAnonymously,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    EmailAuthProvider,
    linkWithCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase'
import { createContext, useContext, useState, useEffect } from 'react';

const OutfitCheckContext = createContext();

function toAuthInfo(user) {
    if (!user) return null;
    return { uid: user.uid, isAnonymous: user.isAnonymous, email: user.email };
}

export function OutfitCheckProvider({ children }) {
    const [authInfo, setAuthInfo] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const stopListening = onAuthStateChanged(auth, (user) => {
            setAuthInfo(toAuthInfo(user));
            setAuthLoading(false);
        });

        return stopListening;
    }, []);

    const userId = authInfo ? authInfo.uid : null;

    async function send(entity, action, data) {
        const request = {
            entity,
            action,
            data,
            user_id: userId,
        };
        const response = await router(request);
        return response;
    }

    async function signIn(email, password) {
        await signInWithEmailAndPassword(auth, email, password);
    }

    async function signUp(email, password) {
        await createUserWithEmailAndPassword(auth, email, password);
    }

    async function continueAsGuest() {
        await signInAnonymously(auth);
    }

    async function linkAccount(email, password) {
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(auth.currentUser, credential);
        setAuthInfo(toAuthInfo(auth.currentUser));
    }

    async function signOutUser() {
        await signOut(auth);
    }

    return (
        <OutfitCheckContext.Provider
            value={{
                send,
                userId,
                ready: userId !== null,
                authLoading,
                isAnonymous: authInfo ? authInfo.isAnonymous : false,
                email: authInfo ? authInfo.email : null,
                signIn,
                signUp,
                continueAsGuest,
                linkAccount,
                signOutUser,
            }}
        >
            {children}
        </OutfitCheckContext.Provider>
    );
}

export function useOutfitCheck() {
    return useContext(OutfitCheckContext);
}
