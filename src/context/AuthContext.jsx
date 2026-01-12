import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "../firebase";

export const AuthContext = createContext();

/* =====================================================
   AUTH PROVIDER
===================================================== */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* ================= AUTH STATE LISTENER ================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ================= EMAIL LOGIN ================= */
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  /* ================= REGISTER ================= */
  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  /* ================= GOOGLE LOGIN ================= */
  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    return signOut(auth);
  };

  /* ================= FORGOT PASSWORD ================= */
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  /* ================= CONTEXT VALUE ================= */
  const value = {
    user,
    authLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
  };

  /* ================= LOADING STATE ================= */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-lg">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin" />
          <p className="font-medium">Checking authentication…</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* =====================================================
   CUSTOM HOOK (OPTIONAL BUT CLEAN)
===================================================== */
export const useAuth = () => useContext(AuthContext);
