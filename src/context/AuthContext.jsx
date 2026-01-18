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

  /* ================= GOOGLE REDIRECT RESULT ================= */
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
      return signInWithRedirect(auth, googleProvider); // 📱 MOBILE
    }
    return signInWithPopup(auth, googleProvider); // 💻 DESKTOP
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
      <div className="min-h-screen flex items-center justify-center">
        Loading…
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
