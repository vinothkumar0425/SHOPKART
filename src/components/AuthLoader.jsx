// src/components/AuthLoader.jsx
export default function AuthLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 px-8 py-6 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
        <p className="font-medium">Please wait...</p>
      </div>
    </div>
  );
}
