import { createContext, useContext } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "./AuthContext";

export const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user } = useContext(AuthContext);

  const placeOrder = async (items, total, address, paymentMethod) => {
    if (!user) throw new Error("User not logged in");

    const docRef = await addDoc(collection(db, "orders"), {
      userId: user.uid,
      items,
      total,
      address,
      paymentMethod,
      status: "Placed",
      createdAt: serverTimestamp(),
    });

    // ✅ VERY IMPORTANT
    return { id: docRef.id };
  };

  return (
    <OrderContext.Provider value={{ placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}
