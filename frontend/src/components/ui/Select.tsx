import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded border ${
          error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#D1D5DB] focus:ring-[#2563EB] focus:border-[#2563EB]'
        } bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 transition-colors ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-1 text-xs text-[#DC2626]">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#6B7280]">{helperText}</p>
      ) : null}
    </div>
  );
};
