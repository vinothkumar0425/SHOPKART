import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 🔹 Load profile data (per user)
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setForm(snap.data());
      }

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  // 🔹 Save profile
  const saveProfile = async () => {
    if (!form.name || !form.phone) {
      alert("Name and phone are required");
      return;
    }

    await setDoc(doc(db, "users", user.uid), form);
    setEdit(false);
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] py-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white dark:bg-[#0f172a] rounded-xl shadow p-6 flex justify-between">
          <div>
            <h2 className="text-xl font-bold">My Profile</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#020617]"
          >
            Logout
          </button>
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ProfileNav title="My Wishlist" onClick={() => navigate("/wishlist")} />
          <ProfileNav title="My Cart" onClick={() => navigate("/cart")} />
          <ProfileNav title="My Orders" onClick={() => navigate("/orders")} />
        </div>

        {/* Profile Details */}
        <div className="bg-white dark:bg-[#0f172a] rounded-xl shadow p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-lg">Profile Details</h3>
            {!edit && (
              <button
                onClick={() => setEdit(true)}
                className="text-blue-600 hover:underline"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* VIEW MODE */}
          {!edit && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p><b>Name:</b> {form.name}</p>
              <p><b>Phone:</b> {form.phone}</p>
              <p><b>Address:</b> {form.street}</p>
              <p><b>City:</b> {form.city}</p>
              <p><b>State:</b> {form.state}</p>
              <p><b>Pincode:</b> {form.pincode}</p>
            </div>
          )}

          {/* EDIT MODE */}
          {edit && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />

              <Input label="Phone Number" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />

              <Input label="Street / Area" value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })} />

              <Input label="City" value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })} />

              <Input label="State" value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })} />

              <Input label="Pincode" value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })} />

              <div className="col-span-full flex gap-3 mt-4">
                <button
                  onClick={saveProfile}
                  className="bg-black text-white px-6 py-2 rounded"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="border px-6 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* 🔹 Small reusable components */

function ProfileNav({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-[#0f172a] rounded-xl shadow p-5 hover:ring-2 hover:ring-blue-500"
    >
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500">View your {title.toLowerCase()}</p>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        {...props}
        className="w-full mt-1 border rounded px-3 py-2 dark:bg-[#020617]"
      />
    </div>
  );
}
