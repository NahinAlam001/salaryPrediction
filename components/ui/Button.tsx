
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400",
    secondary: "bg-slate-600 hover:bg-slate-700 text-slate-100 focus:ring-slate-500",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
    