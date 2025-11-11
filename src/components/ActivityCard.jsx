export default function ActivityCard({
  src,
  label,
  alt = "",
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-[96px] sm:w-[120px] select-none ${className}`}
      aria-label={label}
    >
      <div className="overflow-hidden rounded-lg">
        <img
          src={src}
          alt={alt || label}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-1 text-center text-xl font-semibold text-gray-800">
        {label}
      </div>
    </button>
  );
}
