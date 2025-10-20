export default function DropdownButton({ children, onClick, className = '' }) {
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
DropdownButton.displayName = 'DropdownButton';
