import { Link } from 'react-router-dom';

export default function Button({
  children,
  styleType = 'solid',
  state = 'default',
  size = 'large',
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  href,
}) {
  const baseStyles = () =>
    `font-semibold text-center ${
      state === 'floating'
        ? 'rounded-[40px] shadow-[0px_25px_50px_-12px_#00000040]'
        : 'rounded-xl'
    }`;

  const isDisabled = disabled ? 'cursor-not-allowed' : '';

  const sizeClass = {
    large: 'w-[332px] h-[48px] text-lg p-3',
    'X-small': 'w-[74px] h-[32px] text-sm p-[6px]',
  };
  const sizeStyles = sizeClass[size] || size;

  const getStyleByType = (type) => {
    if (disabled) {
      return type === 'outlined'
        ? 'bg-white border border-[#94A3B8] text-[#94A3B8]'
        : 'bg-[#94A3B8] text-white';
    }

    if (state === 'danger') {
      return 'bg-[#dc2626] text-white hover:bg-[#B91C1C] hover:text-[#CBD5E1] active:bg-[#7F1D1D]';
    }

    if (type === 'outlined-secondary') {
      return 'bg-white border border-[#CBD5E1] text-[##64748B] hover:border-[#E2E8F0] hover:text-[#CBD5E1] active:border-[#E2E8F0] active:text-[#E2E8F0]';
    }

    return type === 'outlined'
      ? 'bg-white border border-[#4FBFF2] text-[#4FBFF2] hover:border-blue-400 hover:bg-[#CBD5E1] hover:text-blue-400 active:border-blue-600 active:text-blue-600'
      : 'bg-[#4FBFF2] text-white hover:bg-blue-500 active:bg-blue-600';
  };

  const styleTypes = {
    solid: getStyleByType('solid'),
    outlined: getStyleByType('outlined'),
    'outlined-secondary': getStyleByType('outlined-secondary'),
  };

  const styleClasses = `${baseStyles()} ${sizeStyles} ${
    styleTypes[styleType]
  } ${isDisabled} ${className}`;

  if (href) {
    return (
      <Link
        to={href}
        className={`flex items-center justify-center ${styleClasses}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={styleClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
