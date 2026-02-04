import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CustomerCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string | React.ReactNode;
  error?: string;
}

export const CustomerCheckbox = forwardRef<HTMLInputElement, CustomerCheckboxProps>(
  ({ label, error, className, id, checked, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-1">
        <label 
          htmlFor={checkboxId} 
          className={cn(
            'flex cursor-pointer items-start gap-3 text-sm',
            className
          )}
        >
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                'h-5 w-5 rounded border-2 transition-all duration-200',
                'peer-focus:ring-2 peer-focus:ring-blue-500/20',
                checked
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-slate-300 bg-white',
                error && 'border-red-300'
              )}
            >
              {checked && (
                <Check className="h-full w-full p-0.5 text-white" strokeWidth={3} />
              )}
            </div>
          </div>
          <span className="text-slate-600">{label}</span>
        </label>
        {error && (
          <p className="ml-8 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

CustomerCheckbox.displayName = 'CustomerCheckbox';
