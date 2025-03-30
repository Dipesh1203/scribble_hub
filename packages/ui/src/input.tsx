import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  label?: string;
}

export function Input({
  type = "text",
  placeholder,
  className = "",
  icon,
  error,
  label,
  id,
  ...props
}: InputProps) {
  const baseStyles =
    "w-full px-4 py-3 bg-gray-700 dark:text-white text-black placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";
  const iconStyles = icon ? "pl-10" : "";
  const errorStyles = error ? "border-2 border-red-500" : "";

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`${baseStyles} ${iconStyles} ${errorStyles} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
