import React from 'react';
import { Loader2 } from 'lucide-react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-[11px] rounded-lg gap-1.5',
    md: 'px-3.5 py-2 text-xs rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm rounded-xl gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold shadow-xs shadow-amber-500/20',
    secondary:
      'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold shadow-xs',
    outline:
      'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-2xs',
    danger:
      'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold shadow-xs shadow-rose-600/20',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium',
    success:
      'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs shadow-emerald-600/20',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
