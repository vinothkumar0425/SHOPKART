export default function Rating({ value = 0, onChange, readOnly }) {
  return (
    <div className="flex gap-1 text-yellow-500 text-lg">
      {[1,2,3,4,5].map(star => (
        <span key={star} className="cursor-pointer"
          onClick={() => !readOnly && onChange?.(star)}>
          {star <= value ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
