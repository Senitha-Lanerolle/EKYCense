import { TrendingUp, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';

export function AnalyticsMockup() {
  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 blur-3xl opacity-30">
        <div className="absolute top-1/4 right-0 w-56 h-56 bg-lavender rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-soft-pink rounded-full" />
      </div>

      {/* Main Card */}
      <div className="relative glass-card p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-lavender/30 via-transparent to-soft-pink/20 rounded-3xl" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-semibold text-foreground text-lg">Screening Analytics</h3>
              <p className="text-sm text-muted-foreground">Decision breakdown</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 border border-border/50">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">This week</span>
            </div>
          </div>

          {/* Visual Bar Chart */}
          <div className="space-y-4 mb-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-foreground">Clear</span>
                </div>
                <span className="text-muted-foreground font-medium">72%</span>
              </div>
              <div className="h-3 rounded-full bg-background/60 overflow-hidden">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-green-500 to-green-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-foreground">Review</span>
                </div>
                <span className="text-muted-foreground font-medium">21%</span>
              </div>
              <div className="h-3 rounded-full bg-background/60 overflow-hidden">
                <div className="h-full w-[21%] rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-foreground">Match</span>
                </div>
                <span className="text-muted-foreground font-medium">7%</span>
              </div>
              <div className="h-3 rounded-full bg-background/60 overflow-hidden">
                <div className="h-full w-[7%] rounded-full bg-gradient-to-r from-red-500 to-red-400" />
              </div>
            </div>
          </div>

          {/* Insight Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-green-500/8 border border-green-500/10">
              <p className="text-2xl font-bold text-foreground mb-1">60%</p>
              <p className="text-xs text-muted-foreground">Fewer false positives</p>
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-2xl font-bold text-foreground mb-1">3.2s</p>
              <p className="text-xs text-muted-foreground">Avg. decision time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
