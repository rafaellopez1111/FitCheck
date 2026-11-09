import { router } from '../services/router';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../config/firebase'
import { createContext, useContext, useState, useEffect } from 'react';

const OutfitCheckContext = createContext();

export function OutfitCheckProvider({ children }) {
    const [userId, setUserId ] = useState(null);

    useEffect(() => {
    const findUser = onAuthStateChanged(auth, async (user) => {
        if (user) {
        setUserId(user.uid);
        } else {
        try {
        await signInAnonymously(auth);
        } catch (error) {
        console.error('Error signing in anonymously:', error);
        }
    }});

    return findUser;
    }, []);

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

    return (
        <OutfitCheckContext.Provider value={{ send, userId, ready: userId !== null }}>
            {children}
        </OutfitCheckContext.Provider>
    );
}

export function useOutfitCheck() {
    return useContext(OutfitCheckContext);
}