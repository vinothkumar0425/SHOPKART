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
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth } from "../firebase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  /* ================= AUTH STATE ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
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

    return () => unsub();
  }, []);

  /* ================= HANDLE GOOGLE REDIRECT ================= */
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser({
            uid: result.user.uid,
            email: result.user.email,
          });
        }
      })
      .catch(() => {});
  }, []);

  /* ================= EMAIL LOGIN ================= */
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  /* ================= REGISTER ================= */
  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  /* ================= GOOGLE LOGIN ================= */
  const loginWithGoogle = () => {
    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      return signInWithRedirect(auth, googleProvider); // ✅ MOBILE
    }
    return signInWithPopup(auth, googleProvider); // ✅ DESKTOP
  };

  /* ================= LOGOUT ================= */
  const logout = () => signOut(auth);

  /* ================= RESET PASSWORD ================= */
  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email);

  const value = {
    user,
    authLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
  };

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

export const useAuth = () => useContext(AuthContext);
