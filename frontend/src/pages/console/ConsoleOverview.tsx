import { useNavigate } from 'react-router-dom';
import { ConsoleLayout } from '@/components/console/ConsoleLayout';
import { StatCard } from '@/components/console/StatCard';
import { SectionCard } from '@/components/console/SectionCard';
import { DataTable, Column } from '@/components/console/DataTable';
import { StatusPill } from '@/components/console/StatusPill';
import { FileText, Search, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { mockCases, getDashboardStats, Case } from '@/data/mockCases';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function ConsoleOverview() {
  const navigate = useNavigate();
  const stats = getDashboardStats();
  const recentCases = mockCases.slice(0, 5);

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
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
        </span>
      )
    }
  ];

  return (
    <ConsoleLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Console Overview</h1>
            <p className="text-muted-foreground mt-1">
              Monitor name screening cases and complete compliance review.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/console/cases')}
            className="gap-2 rounded-xl"
          >
            View all cases
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Open cases" 
            value={stats.openCases} 
            icon={FileText}
            variant="default"
          />
          <StatCard 
            title="In review" 
            value={stats.inReview} 
            icon={Search}
            variant="info"
          />
          <StatCard 
            title="High risk" 
            value={stats.highRisk} 
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard 
            title="Reviewed today" 
            value={stats.reviewedToday} 
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/console/review-queue')}
            className="group p-5 rounded-2xl border border-border bg-gradient-to-br from-blue-50/80 to-indigo-50/50 hover:from-blue-100/80 hover:to-indigo-100/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(220 80% 90%) 0%, hsl(240 70% 88%) 100%)'
                }}
              >
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-semibold text-foreground">Review Queue</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Cases awaiting analyst review</p>
          </button>
          
          <button 
            onClick={() => navigate('/console/cases')}
            className="group p-5 rounded-2xl border border-border bg-gradient-to-br from-lavender/50 to-periwinkle/30 hover:from-lavender/70 hover:to-periwinkle/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(258 50% 90%) 0%, hsl(240 50% 88%) 100%)'
                }}
              >
                <FileText className="h-5 w-5 text-violet-600" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-semibold text-foreground">All Cases</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Browse complete case history</p>
          </button>
          
          <button 
            className="group p-5 rounded-2xl border border-border bg-gradient-to-br from-mint/50 to-emerald-50/30 hover:from-mint/70 hover:to-emerald-100/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(160 60% 88%) 0%, hsl(170 55% 85%) 100%)'
                }}
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-semibold text-foreground">New Verification</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Start a new screening check</p>
          </button>
        </div>

        {/* Recent Cases */}
        <SectionCard 
          title="Recent cases"
          description="Latest screening cases requiring attention"
          accent="lavender"
          headerAction={
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/console/cases')}
              className="text-muted-foreground hover:text-foreground"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          }
        >
          <DataTable 
            data={recentCases}
            columns={columns}
            onRowClick={(item) => navigate(`/console/cases/${item.id}`)}
          />
        </SectionCard>
      </div>
    </ConsoleLayout>
  );
}
