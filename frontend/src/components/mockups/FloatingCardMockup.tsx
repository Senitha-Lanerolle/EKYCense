import { CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export function FloatingCardMockup() {
  const { ref: cardRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="relative w-full h-full">
      {/* Main Card - Bottom Left - Glass Premium with scroll animation */}
      <div 
        ref={cardRef}
        className={cn(
          "absolute bottom-0 left-0 w-[85%] max-w-[380px] transition-all duration-700 ease-out",
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        )}
        style={{
          animation: isVisible ? 'floatCard 7s ease-in-out infinite' : 'none',
          animationDelay: '0.3s',
        }}
      >
        <div className="glass-card overflow-hidden">
          {/* Inner gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-mint/60 via-transparent to-lavender/40" />
          
          {/* Content */}
          <div className="relative p-7">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-background" />
                </div>
                <span className="text-sm font-semibold text-foreground">EKYCense</span>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 font-medium">Active</span>
            </div>
            
            <div className="space-y-1 mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Compliance Score</p>
              <div className="flex items-baseline gap-2">
                <p className="text-6xl font-bold text-foreground tracking-tighter">98.7</p>
                <span className="text-2xl text-muted-foreground font-medium">%</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/8 border border-green-500/10">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-foreground">All compliance checks passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Card - Top Right - Screening Results */}
      <div 
        className={cn(
          "absolute top-4 right-0 w-[80%] max-w-[320px] transition-all duration-700 ease-out",
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        )}
        style={{
          animation: isVisible ? 'floatCard 7s ease-in-out 1.5s infinite' : 'none',
          transitionDelay: '0.15s',
        }}
      >
        <div className="glass-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-soft-pink/50 via-transparent to-lavender/30" />
          
          <div className="relative p-5">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Live Screening</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Real-time</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background/60 rounded-xl border border-border/50">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">Mohammed Al-Rashid</p>
                  <p className="text-xs text-muted-foreground">94% match · Verified</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-background/40 rounded-xl border border-border/30">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">M. Ahmed Rasheed</p>
                  <p className="text-xs text-muted-foreground">Review required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small floating badge - Languages */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-700 ease-out",
          isVisible 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-90"
        )}
        style={{
          animation: isVisible ? 'floatCard 9s ease-in-out 3s infinite' : 'none',
          transitionDelay: '0.3s',
        }}
      >
        <div className="glass-card px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌍</span>
            <span className="text-sm font-semibold text-foreground">40+ Languages</span>
          </div>
        </div>
      </div>
    </div>
  );
}