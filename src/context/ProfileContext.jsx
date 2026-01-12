import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load profile per user
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        // default empty profile
        setProfile({
          fullName: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
        });
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  // 🔹 Update profile per user
  const updateProfile = async (data) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, data, { merge: true });
    setProfile(data);
  };

  return (
    <ProfileContext.Provider
      value={{ profile, updateProfile, loading }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
