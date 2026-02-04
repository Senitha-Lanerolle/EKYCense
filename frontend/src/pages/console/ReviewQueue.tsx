import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsoleLayout } from '@/components/console/ConsoleLayout';
import { SectionCard } from '@/components/console/SectionCard';
import { DataTable, Column } from '@/components/console/DataTable';
import { StatusPill } from '@/components/console/StatusPill';
import { EmptyState } from '@/components/console/EmptyState';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink } from 'lucide-react';
import { getOpenAndInReviewCases, Case } from '@/data/mockCases';
import { formatDistanceToNow, format } from 'date-fns';

export default function ReviewQueue() {
  const navigate = useNavigate();
  const cases = useMemo(() => getOpenAndInReviewCases(), []);

  const columns: Column<Case>[] = [
    {
      key: 'case',
      header: 'Case',
      render: (item) => (
        <div>
          <p className="font-medium text-foreground">{item.full_name}</p>
          <p className="text-xs text-muted-foreground">Case #{item.id}</p>
        </div>
      )
    },
    {
      key: 'country',
      header: 'Country',
      render: (item) => (
        <span className="text-sm text-foreground">{item.country}</span>
      )
    },
    {
      key: 'decision',
      header: 'Decision',
      render: (item) => <StatusPill type="decision" value={item.decision} />
    },
    {
      key: 'risk',
      header: 'Risk',
      render: (item) => <StatusPill type="risk" value={item.risk_level} />
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusPill type="review" value={item.review_status} />
    },
    {
      key: 'created',
      header: 'Created',
      render: (item) => (
        <div className="text-sm">
          <span className="text-foreground">
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      className: 'w-[180px]',
      render: (item) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button 
            size="sm" 
            variant="outline"
            className="h-8 gap-1.5"
            onClick={() => navigate(`/console/cases/${item.id}`)}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </Button>
          {item.review_status === 'OPEN' && (
            <Button 
              size="sm" 
              variant="outline"
              className="h-8 gap-1.5"
            >
              <Search className="h-3.5 w-3.5" />
              Review
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <ConsoleLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review Queue</h1>
          <p className="text-muted-foreground mt-1">
            Cases requiring analyst review ({cases.length} pending)
          </p>
        </div>

        {/* Cases Table */}
        <SectionCard noPadding>
          <DataTable 
            data={cases}
            columns={columns}
            onRowClick={(item) => navigate(`/console/cases/${item.id}`)}
            emptyState={
              <EmptyState 
                type="cases"
                title="Queue is empty"
                description="All cases have been reviewed. Great work!"
              />
            }
          />
        </SectionCard>
      </div>
    </ConsoleLayout>
  );
}
