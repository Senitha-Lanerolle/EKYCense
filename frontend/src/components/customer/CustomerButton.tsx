import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CustomerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const CustomerButton = forwardRef<HTMLButtonElement, CustomerButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading, disabled, className, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
      outline: 'border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-400',
    };
    
    const sizes = {
      sm: 'rounded-lg px-4 py-2 text-sm',
      md: 'rounded-xl px-6 py-3 text-sm',
      lg: 'rounded-xl px-8 py-4 text-base',
    };
    
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

CustomerButton.displayName = 'CustomerButton';
