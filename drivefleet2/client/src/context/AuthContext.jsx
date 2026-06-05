import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axios";

const AuthContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// This context supports BOTH Firebase (when configured) and a localStorage-
// based demo mode so the app always renders, even without a .env file.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "drivefleet_user";

function saveLocal(user) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}
function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fbAuth, setFbAuth] = useState(null);

  const hasFirebase = !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_API_KEY.length > 10 &&
    !["your_firebase_api_key_here", "fake"].includes(import.meta.env.VITE_FIREBASE_API_KEY)
  );

  // Try to load Firebase lazily
  useEffect(() => {
    if (!hasFirebase) {
      // Demo mode: restore from localStorage
      const saved = loadLocal();
      if (saved) setUser(saved);
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};
    (async () => {
      try {
        const [{ initializeApp, getApps }, { getAuth, onAuthStateChanged }] = await Promise.all([
          import("firebase/app"),
          import("firebase/auth"),
        ]);
        const cfg = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
        };
        const app = getApps().length ? getApps()[0] : initializeApp(cfg);
        const auth = getAuth(app);
        setFbAuth(auth);
        unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            const u = { email: fbUser.email, displayName: fbUser.displayName, photoURL: fbUser.photoURL, uid: fbUser.uid };
            setUser(u);
            try {
              await axiosInstance.post("/jwt", { email: fbUser.email });
              await axiosInstance.post("/users", { email: fbUser.email, name: fbUser.displayName, photoURL: fbUser.photoURL });
            } catch (_) {}
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } catch (err) {
        console.error("Firebase init error:", err.message);
        const saved = loadLocal();
        if (saved) setUser(saved);
        setLoading(false);
      }
    })();
    return () => unsubscribe();
  }, []);

  // ── Auth actions ────────────────────────────────────────────────────────
  const login = async (email, password) => {
    if (!hasFirebase) {
      // Demo login: any email+password works
      const u = { email, displayName: email.split("@")[0], photoURL: null, uid: "demo_" + Date.now() };
      saveLocal(u);
      setUser(u);
      try { await axiosInstance.post("/jwt", { email }); } catch (_) {}
      return u;
    }
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    return signInWithEmailAndPassword(fbAuth, email, password);
  };

  const register = async (email, password) => {
    if (!hasFirebase) {
      return { user: { email } };
    }
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    return createUserWithEmailAndPassword(fbAuth, email, password);
  };

  const updateUserProfile = async (name, photoURL) => {
    if (!hasFirebase) {
      const updated = { ...loadLocal(), displayName: name, photoURL };
      saveLocal(updated);
      setUser(updated);
      return;
    }
    const { updateProfile } = await import("firebase/auth");
    await updateProfile(fbAuth.currentUser, { displayName: name, photoURL });
  };

  const googleLogin = async () => {
    if (!hasFirebase) {
      const u = { email: "demo@drivefleet.com", displayName: "Demo User", photoURL: null, uid: "google_demo" };
      saveLocal(u);
      setUser(u);
      try { await axiosInstance.post("/jwt", { email: u.email }); } catch (_) {}
      return u;
    }
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    return signInWithPopup(fbAuth, new GoogleAuthProvider());
  };

  const logout = async () => {
    try { await axiosInstance.post("/logout"); } catch (_) {}
    if (!hasFirebase) {
      saveLocal(null);
      setUser(null);
      return;
    }
    const { signOut } = await import("firebase/auth");
    return signOut(fbAuth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUserProfile, googleLogin, logout, hasFirebase }}>
      {loading
        ? <div className="global-loading"><div className="global-spinner" /></div>
        : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
