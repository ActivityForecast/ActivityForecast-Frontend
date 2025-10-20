import React, { useState, isValidElement, cloneElement, Children } from 'react';
import useClickOutside from 'hooks/useClickOutside';

export default function Dropdown({ children, className = '' }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);
  const ref = useClickOutside(close);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {Children.map(children, (child) => {
        if (
          isValidElement(child) &&
          child.type?.displayName === 'DropdownButton'
        ) {
          return cloneElement(child, { onClick: toggle });
        }
        if (
          isValidElement(child) &&
          child.type?.displayName === 'DropdownMenu'
        ) {
          return cloneElement(child, { open, close });
        }
        return child;
      })}
    </div>
  );
}
