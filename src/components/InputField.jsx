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
          className={`w-full rounded-xl px-4 py-3 text-md sm:py-4 sm:text-lg ${
            isDisabled
              ? 'border border-bd-primary/10 bg-b-tertiary text-t-disabled'
              : 'border border-bd-primary/10 bg-b-secondary text-t-primary hover:border-i-hover focus:border-i-focus focus:outline-none focus:ring-1 focus:ring-green-500'
          } placeholder-t-default ${error ? 'border-[#ff6060]' : ''}`}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {!isDisabled && isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-t-default hover:text-i-hover"
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
