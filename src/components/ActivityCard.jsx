export default function ActivityCard({
  src,
  label,
  alt = "",
  onClick,        
  size = "md",          
  className = "",
}) {
  const interactive = typeof onClick === "function";
  const Wrapper = interactive ? "button" : "div";

  const sizeMap = {
    md: {
      wrapper: "w-[96px] sm:w-[120px]",
      label: "mt-2 text-center text-base sm:text-lg font-semibold text-gray-800",
    },
    lg: {
      wrapper: "w-[160px] sm:w-[200px]",
      label: "mt-3 text-center text-xl font-semibold text-gray-800",
    },
  };
  const sz = sizeMap[size] ?? sizeMap.md;

  const a11yProps = interactive
    ? {
        type: "button",
        onClick,
        "aria-label": label,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(e);
          }
        },
      }
    : { "aria-label": label, tabIndex: -1 };

  return (
    <Wrapper
      {...a11yProps}
      className={[
        "group select-none",
        sz.wrapper,
        interactive ? "cursor-pointer" : "cursor-default",
        className,
      ].join(" ")}
    >
      <div className="overflow-hidden rounded-lg">
        <div className={sz.imageBox}>
          <img
            src={src}
            alt={alt || label}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      <div className={sz.label}>{label}</div>
    </Wrapper>
  );
}
