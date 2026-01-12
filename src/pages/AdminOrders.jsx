import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
export default function AdminOrders() {
  const [orders,setOrders]=useState([]);
  useEffect(()=>{(async()=>{
    const snap = await getDocs(collection(db,"orders"));
    setOrders(snap.docs.map(d=>({id:d.id,...d.data()})));
  })();},[]);
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">All Orders</h2>
      {orders.map(o=>(
        <div key={o.id} className="border p-2 my-2">
          <p>{o.email}</p><p>Total: ₹{o.total}</p>
        </div>
      ))}
    </div>
  );
}
