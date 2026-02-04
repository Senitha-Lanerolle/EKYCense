import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CustomerInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

export const CustomerInput = forwardRef<HTMLInputElement, CustomerInputProps>(
  ({ label, error, optional, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="space-y-1.5">
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-slate-700"
        >
          {label}
          {optional && <span className="ml-1 text-slate-400 font-normal">(optional)</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900',
            'placeholder:text-slate-400',
            'transition-all duration-200',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

CustomerInput.displayName = 'CustomerInput';
