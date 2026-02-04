import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  noPadding?: boolean;
  accent?: 'none' | 'lavender' | 'mint' | 'blue';
}

const accentStyles = {
  none: '',
  lavender: 'border-t-2 border-t-lavender-dark/40',
  mint: 'border-t-2 border-t-mint-dark/40',
  blue: 'border-t-2 border-t-blue-400/40'
};

export function SectionCard({ 
  title, 
  description, 
  children, 
  className,
  headerAction,
  noPadding = false,
  accent = 'none'
}: SectionCardProps) {
  return (
    <div className={cn(
      'bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-sm transition-all duration-300 hover:shadow-md',
      accentStyles[accent],
      className
    )}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div className={cn(!noPadding && 'p-6')}>
        {children}
      </div>
    </div>
  );
}
