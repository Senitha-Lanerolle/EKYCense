import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'default' | 'warning' | 'success' | 'info';
  className?: string;
}

const variants = {
  default: {
    gradient: 'from-muted/80 to-muted/40',
    iconBg: 'linear-gradient(135deg, hsl(220 15% 90%) 0%, hsl(220 15% 85%) 100%)',
    iconColor: 'text-muted-foreground'
  },
  warning: {
    gradient: 'from-amber-50 to-orange-50/50',
    iconBg: 'linear-gradient(135deg, hsl(40 90% 85%) 0%, hsl(30 85% 80%) 100%)',
    iconColor: 'text-amber-600'
  },
  success: {
    gradient: 'from-emerald-50 to-teal-50/50',
    iconBg: 'linear-gradient(135deg, hsl(160 60% 85%) 0%, hsl(170 55% 80%) 100%)',
    iconColor: 'text-emerald-600'
  },
  info: {
    gradient: 'from-blue-50 to-indigo-50/50',
    iconBg: 'linear-gradient(135deg, hsl(220 80% 90%) 0%, hsl(240 70% 88%) 100%)',
    iconColor: 'text-blue-600'
  }
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon,
  variant = 'default',
  className 
}: StatCardProps) {
  const variantStyles = variants[variant];

  return (
    <div className={cn(
      'relative overflow-hidden bg-card rounded-2xl border border-border p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
      className
    )}>
      {/* Subtle gradient overlay */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50',
        variantStyles.gradient
      )} />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div 
          className="h-11 w-11 rounded-xl flex items-center justify-center shadow-sm"
          style={{ background: variantStyles.iconBg }}
        >
          <Icon className={cn('h-5 w-5', variantStyles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
