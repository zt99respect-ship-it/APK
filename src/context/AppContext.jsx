import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, reload } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase.js';
import { DEFAULT_CONFIG, isAdminEmail } from '../lib/constants.js';
import { subscribeProfile, createProfile } from '../services/users.js';
import { subscribeAppConfig } from '../services/settings.js';
import { signOutUser } from '../services/auth.js';
import Toast from '../components/Toast.jsx';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [authUser, setAuthUser] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    return onAuthStateChanged(auth, (user) => setAuthUser(user));
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    return subscribeAppConfig(setConfig);
  }, []);

  const uid = authUser?.uid;
  const verified = Boolean(authUser?.emailVerified);

  useEffect(() => {
    if (!uid || !verified) {
      setProfile(undefined);
      return undefined;
    }
    const current = auth.currentUser;
    return subscribeProfile(
      uid,
      (data) => {
        if (data) {
          setProfile(data);
          return;
        }
        createProfile({
          uid,
          email: current.email,
          username: current.displayName || current.email.split('@')[0],
        }).catch(() => setProfile(null));
      },
      () => setProfile(null),
    );
  }, [uid, verified]);

  const notify = useCallback((message, tone = 'info') => {
    clearTimeout(toastTimer.current);
    setToast({ message, tone, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const refreshVerification = useCallback(async () => {
    await reload(auth.currentUser);
    setAuthUser(auth.currentUser);
  }, []);

  const signOut = useCallback(() => signOutUser(), []);

  const value = useMemo(() => {
    const isAdmin = Boolean(authUser?.emailVerified && isAdminEmail(authUser.email));
    const isModerator = profile?.role === 'moderator';
    return {
      authUser,
      profile,
      config,
      isAdmin,
      isModerator,
      isStaff: isAdmin || isModerator,
      notify,
      refreshVerification,
      signOut,
    };
  }, [authUser, profile, config, notify, refreshVerification, signOut]);

  return (
    <AppContext.Provider value={value}>
      {children}
      <Toast toast={toast} />
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
