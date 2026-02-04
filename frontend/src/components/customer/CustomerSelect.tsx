import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomerSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  optional?: boolean;
  placeholder?: string;
}

export const CustomerSelect = forwardRef<HTMLSelectElement, CustomerSelectProps>(
  ({ label, options, error, optional, placeholder = 'Select...', className, id, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="space-y-1.5">
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-slate-700"
        >
          {label}
          {optional && <span className="ml-1 text-slate-400 font-normal">(optional)</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900',
              'transition-all duration-200',
              'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

CustomerSelect.displayName = 'CustomerSelect';
