import { Children, isValidElement, cloneElement } from 'react';

export default function DropdownMenu({
  children,
  className = '',
  open = false,
  close,
}) {
  if (!open) return null;

  return (
    <div
      className={
        'absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg z-50 ' +
        className
      }
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child, { close }) : child
      )}
    </div>
  );
}
DropdownMenu.displayName = 'DropdownMenu';
