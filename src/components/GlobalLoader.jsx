import { useContext } from "react";
import { LoaderContext } from "../context/LoaderContext";
export default function GlobalLoader() {
  const { loading } = useContext(LoaderContext);
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3 animate-scale">
        <div className="loader-circle" />
        <p className="text-sm text-gray-600">Please wait…</p>
      </div>
    </div>
  );
}
