import { useState, useEffect } from 'react';
import { ReactComponent as EyeOffIcon } from 'assets/icons/visibility_off.svg';
import { ReactComponent as EyeOnIcon } from 'assets/icons/visibility_on.svg';

export default function InputField({
  id,
  type,
  placeholder,
  value,
  onChange,
  validator,
  errorMessage,
  isPassword = false,
  className = '',
  state = 'default',
  children,
  maxlength,
  readOnly = false,
}) {
  const [inputType, setInputType] = useState(type);
  const [error, setError] = useState();

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  const handleBlur = () => {
    if (validator) setError(validator(value || ''));
  };

  const togglePasswordVisibility = () => {
    setInputType((p) => (p === 'password' ? 'text' : 'password'));
  };

  const isDisabled = state === 'default-disabled';

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={validator ? handleBlur : undefined}
          maxLength={maxlength}
          disabled={isDisabled}
          readOnly={readOnly}
          className={`w-full rounded-xl px-4 py-3 text-md sm:py-4 sm:text-lg ${
            isDisabled
              ? 'border border-gray-400  text-[#94A3B8]'
              : 'border border-gray-400  text-black focus:outline-none focus:ring-1 focus:ring-blue-500'
          } placeholder-[#64748B] ${error ? 'border-[#ff6060]' : ''} ${readOnly ? 'cursor-pointer' : ''}`}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {!isDisabled && isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-[#64748B]"
              aria-label={
                inputType === 'password' ? 'Show password' : 'Hide password'
              }
            >
              {inputType === 'password' ? <EyeOffIcon /> : <EyeOnIcon />}
            </button>
          )}
          {children}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-md font-medium text-[#ff6060]">{error}</p>
      )}
    </div>
  );
}
