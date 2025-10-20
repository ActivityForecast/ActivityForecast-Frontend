import { cn } from 'utils/cn';

export default function DropdownMenuItem({
  children,
  onClick,
  className = '',
  close,
}) {
  const handle = () => {
    close?.();
    onClick?.();
  };
  return (
    <button
      onClick={handle}
      className={cn(
        'w-full text-left rounded-xl px-4 py-2 text-sm hover:bg-gray-100 active:scale-95',
        className
      )}
    >
      {children}
    </button>
  );
}
