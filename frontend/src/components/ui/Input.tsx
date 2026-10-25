import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded border ${
            error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#D1D5DB] focus:ring-[#2563EB] focus:border-[#2563EB]'
          } bg-white px-3 py-2 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${
            icon ? 'pl-9' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-[#DC2626]">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#6B7280]">{helperText}</p>
      ) : null}
    </div>
  );
};
