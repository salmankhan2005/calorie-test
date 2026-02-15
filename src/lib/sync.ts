import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { doc, onSnapshot, setDoc, collection, query, orderBy, limit } from 'firebase/firestore';
import { signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { db, auth } from './firebase';
import { useAppStore } from '../store/useAppStore';

export const useFirebaseSync = () => {
    const { user: clerkUser } = useUser();
    const { getToken } = useAuth();
    const { setProfile, profile, todayLog, setTodayLog, setHistory, theme, units } = useAppStore();
    const [isAuthReady, setIsAuthReady] = useState(false);

    // 1. Background Auth (Non-blocking)
    useEffect(() => {
        const attemptAuth = async () => {
            if (!clerkUser) {
                setIsAuthReady(false);
                return;
            }
            try {
                const token = await getToken({ template: "integration_firebase" }).catch(() => null);
                if (token) {
                    await signInWithCustomToken(auth, token);
                    console.log("Firebase: Authenticated via Clerk");
                } else {
                    await signInAnonymously(auth);
                    console.log("Firebase: Authenticated Anonymously");
                }
                setIsAuthReady(true);
            } catch (err: any) {
                console.warn("Firebase Auth Notice:", err.message);
                setIsAuthReady(true);
            }
        };
        attemptAuth();
    }, [clerkUser, getToken]);

    // 2. Real-time Sync (WAIT FOR AUTH)
    useEffect(() => {
        if (!clerkUser || !isAuthReady) return;

        const userDocRef = doc(db, 'users', clerkUser.id);

        // 2a. Sync Profile & Settings
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.profile && JSON.stringify(profile) !== JSON.stringify(data.profile)) {
                    setProfile(data.profile);
                }
                if (data.theme && data.theme !== useAppStore.getState().theme) {
                    useAppStore.getState().setTheme(data.theme);
                }
                if (data.units && data.units !== useAppStore.getState().units) {
                    useAppStore.getState().setUnits(data.units);
                }
            }
        }, (err) => {
            console.error("Firestore Sync Blocked (Profile/Settings):", err.message);
        });

        // 2b. Sync Daily Log
        const today = new Date().toISOString().split('T')[0];
        const logDocRef = doc(db, 'users', clerkUser.id, 'dailyLogs', today);
        const unsubscribeLog = onSnapshot(logDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (JSON.stringify(todayLog) !== JSON.stringify(data)) {
                    setTodayLog(data as any);
                }
            }
        }, (err) => {
            console.error("Firestore Sync Blocked (Log):", err.message);
        });

        // 2c. Sync Weekly History
        const logsColRef = collection(db, 'users', clerkUser.id, 'dailyLogs');
        const q = query(logsColRef, orderBy('date', 'desc'), limit(7));
        const unsubscribeHistory = onSnapshot(q, (querySnap) => {
            const history = querySnap.docs.map(doc => ({
                ...doc.data(),
                date: doc.id
            })) as any;
            setHistory(history);
        }, (err) => {
            console.error("Firestore Sync Blocked (History):", err.message);
        });

        return () => {
            unsubscribeProfile();
            unsubscribeLog();
            unsubscribeHistory();
        };
    }, [clerkUser, isAuthReady, profile, setProfile, todayLog, setTodayLog, setHistory]);

    // 3. Auto-Save to Firebase
    useEffect(() => {
        if (!clerkUser || !profile || !isAuthReady) return;

        const saver = async () => {
            try {
                const userDocRef = doc(db, 'users', clerkUser.id);
                await setDoc(userDocRef, {
                    profile,
                    theme,
                    units,
                    lastSync: new Date().toISOString()
                }, { merge: true });

                if (todayLog) {
                    const today = new Date().toISOString().split('T')[0];
                    const logDocRef = doc(db, 'users', clerkUser.id, 'dailyLogs', today);
                    await setDoc(logDocRef, { ...todayLog, date: today }, { merge: true });
                }
            } catch (err: any) {
                console.warn("Persistence Error:", err.message);
            }
        };

        const timer = setTimeout(saver, 2000);
        return () => clearTimeout(timer);
    }, [clerkUser, profile, todayLog, theme, units, isAuthReady]);
};
