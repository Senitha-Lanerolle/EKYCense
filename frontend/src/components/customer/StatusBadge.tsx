import { cn } from '@/lib/utils';
import { Clock, RefreshCw, CheckCircle2, AlertCircle, LucideIcon } from 'lucide-react';

type StatusType = 'submitted' | 'in_progress' | 'verified' | 'action_required';

interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  icon: LucideIcon;
  label: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  submitted: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-300',
    border: 'border-slate-500/30',
    icon: Clock,
    label: 'Submitted',
  },
  in_progress: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    icon: RefreshCw,
    label: 'Verification in Progress',
  },
  verified: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    icon: CheckCircle2,
    label: 'Verified',
  },
  action_required: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    icon: AlertCircle,
    label: 'Action Required',
  },
};

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'lg';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-medium',
        config.bg,
        config.text,
        config.border,
        size === 'sm' ? 'px-3 py-1 text-sm' : 'px-5 py-2.5 text-base'
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-4 w-4' : 'h-5 w-5', status === 'in_progress' && 'animate-spin')} />
      {config.label}
    </span>
  );
}

export function mapReviewStatusToCustomerStatus(reviewStatus: string | null | undefined): StatusType {
  if (!reviewStatus || reviewStatus === 'OPEN') return 'submitted';
  if (reviewStatus === 'IN_REVIEW') return 'in_progress';
  if (reviewStatus === 'CLEARED') return 'verified';
  if (reviewStatus === 'REJECTED') return 'action_required';
  return 'submitted';
}
