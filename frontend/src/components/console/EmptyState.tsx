import { cn } from '@/lib/utils';
import { Inbox, FileText, MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  type?: 'cases' | 'notes' | 'default';
  title?: string;
  description?: string;
  className?: string;
}

const defaults = {
  cases: {
    icon: FileText,
    title: 'No cases found',
    description: 'There are no cases matching your current filters.'
  },
  notes: {
    icon: MessageSquare,
    title: 'No notes yet',
    description: 'Add a note to document your review findings.'
  },
  default: {
    icon: Inbox,
    title: 'No data available',
    description: 'There is nothing to display at the moment.'
  }
};

export function EmptyState({ 
  type = 'default', 
  title, 
  description,
  className 
}: EmptyStateProps) {
  const config = defaults[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-6 text-center',
      className
    )}>
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-medium text-foreground mb-1">
        {title || config.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {description || config.description}
      </p>
    </div>
  );
}
