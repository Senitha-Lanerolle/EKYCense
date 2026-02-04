import { CheckCircle2, Clock, Users, Shield } from 'lucide-react';

export function DashboardMockup() {
  return (
    <div className="relative">
      {/* Ambient glow behind */}
      <div className="absolute inset-0 blur-3xl opacity-40">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-mint rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-lavender rounded-full" />
      </div>

      {/* Main Dashboard Card */}
      <div className="relative glass-card p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-mint/30 via-transparent to-lavender/20 rounded-3xl" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <Shield className="w-5 h-5 text-background" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Verification Hub</h3>
                <p className="text-xs text-muted-foreground">Real-time monitoring</p>
              </div>
            </div>
            <span className="px-3 py-1.5 text-xs font-medium bg-green-500/10 text-green-600 rounded-full">Live</span>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-2xl bg-background/60 border border-border/50">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">847</p>
              <p className="text-xs text-muted-foreground">Cleared</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-background/60 border border-border/50">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">23</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-background/60 border border-border/50">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">1.2K</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Verifications</p>
            
            <div className="space-y-2">
              {[
                { name: 'Sarah Chen', status: 'verified', time: '2m ago', flag: '🇸🇬' },
                { name: 'محمد الفيصل', status: 'verified', time: '5m ago', flag: '🇦🇪' },
                { name: 'Алексей Петров', status: 'review', time: '8m ago', flag: '🇷🇺' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border/30">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.flag}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'verified' 
                      ? 'bg-green-500/10 text-green-600' 
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {item.status === 'verified' ? 'Verified' : 'Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
