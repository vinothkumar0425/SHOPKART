// src/components/ProductSkeleton.jsx
export default function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow animate-pulse">
      <div className="h-40 bg-gray-300 dark:bg-slate-700 rounded mb-4" />
      <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded mb-2" />
      <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2 mb-4" />
      <div className="h-9 bg-gray-300 dark:bg-slate-700 rounded" />
    </div>
  );
}
