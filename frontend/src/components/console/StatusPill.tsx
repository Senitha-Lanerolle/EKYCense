import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, XCircle, Clock, Search, AlertCircle, LucideIcon } from 'lucide-react';
import type { Decision, RiskLevel, ReviewStatus } from '@/data/mockCases';

interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  icon: LucideIcon;
  label: string;
}

interface StatusPillProps {
  type: 'decision' | 'risk' | 'review';
  value: Decision | RiskLevel | ReviewStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const decisionConfig: Record<Decision, StatusConfig> = {
  MATCH: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
    label: 'Match'
  },
  PARTIAL_MATCH: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: AlertTriangle,
    label: 'Partial Match'
  },
  NO_MATCH: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2,
    label: 'No Match'
  }
};

const riskConfig: Record<RiskLevel, StatusConfig> = {
  HIGH: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: AlertCircle,
    label: 'High'
  },
  MEDIUM: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: AlertTriangle,
    label: 'Medium'
  },
  LOW: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2,
    label: 'Low'
  }
};

const reviewConfig: Record<ReviewStatus, StatusConfig> = {
  OPEN: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    icon: Clock,
    label: 'Open'
  },
  IN_REVIEW: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Search,
    label: 'In Review'
  },
  CLEARED: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2,
    label: 'Cleared'
  },
  REJECTED: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
    label: 'Rejected'
  }
};

function getStatusConfig(type: 'decision' | 'risk' | 'review', value: string): StatusConfig | null {
  if (type === 'decision') {
    return decisionConfig[value as Decision] || null;
  }
  if (type === 'risk') {
    return riskConfig[value as RiskLevel] || null;
  }
  if (type === 'review') {
    return reviewConfig[value as ReviewStatus] || null;
  }
  return null;
}

export function StatusPill({ type, value, size = 'sm', showIcon = true }: StatusPillProps) {
  const statusConfig = getStatusConfig(type, value);
  
  if (!statusConfig) return null;

  const Icon = statusConfig.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        statusConfig.bg,
        statusConfig.text,
        statusConfig.border,
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {showIcon && <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />}
      {statusConfig.label}
    </span>
  );
}
