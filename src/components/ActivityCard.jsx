export default function ActivityCard({
  src,
  label,
  alt = "",
  onClick,   
  className = "",
}) {
  const interactive = typeof onClick === "function";
  const Wrapper = interactive ? "button" : "div";

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
    : {
        "aria-label": label,
        tabIndex: -1,
      };

  return (
    <Wrapper
      {...a11yProps}
      className={[
        "group w-[96px] sm:w-[120px] select-none",
        interactive ? "cursor-pointer" : "cursor-default",
        className,
      ].join(" ")}
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
    </Wrapper>
  );
}
