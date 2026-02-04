import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function FormCard({ children, className, title, description }: FormCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white p-8 shadow-sm',
        className
      )}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
