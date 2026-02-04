import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { Languages, Brain, FileCheck, Shield, Users, Zap } from 'lucide-react';

const capabilities = [
  {
    icon: Languages,
    title: 'Cross-Script Matching',
    description: 'Understands Arabic, Chinese, Cyrillic, and 40+ writing systems natively.',
    metric: '40+',
    metricLabel: 'scripts',
  },
  {
    icon: Brain,
    title: 'Smart Decisioning',
    description: 'ML + rule-based hybrid that knows when to escalate to humans.',
    metric: '99.2%',
    metricLabel: 'accuracy',
  },
  {
    icon: FileCheck,
    title: 'Clear Audit Trails',
    description: 'Every decision documented with reasoning your auditors will love.',
    metric: '100%',
    metricLabel: 'traceable',
  },
  {
    icon: Shield,
    title: 'Global Watchlists',
    description: 'PEP, sanctions, and adverse media from 200+ jurisdictions.',
    metric: '200+',
    metricLabel: 'sources',
  },
  {
    icon: Users,
    title: 'Case Management',
    description: 'Assign, review, and resolve cases with built-in collaboration.',
    metric: '3x',
    metricLabel: 'faster',
  },
  {
    icon: Zap,
    title: 'Instant Response',
    description: 'Sub-second screening at enterprise scale. No queues.',
    metric: '<100',
    metricLabel: 'ms',
  },
];

export function CapabilitiesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Unique geometric background - not generic gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Diagonal stripe pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              hsl(var(--foreground)) 0px,
              hsl(var(--foreground)) 1px,
              transparent 1px,
              transparent 80px
            )`,
          }}
        />
        
        {/* Asymmetric accent shape - top right */}
        <div 
          className="absolute -top-40 right-0 w-[500px] h-[500px]"
          style={{
            background: `conic-gradient(from 180deg at 50% 50%, 
              hsl(258 45% 92% / 0.6) 0deg, 
              hsl(200 50% 94% / 0.4) 120deg, 
              hsl(162 40% 93% / 0.5) 240deg, 
              hsl(258 45% 92% / 0.6) 360deg
            )`,
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            filter: 'blur(60px)',
          }}
        />
        
        {/* Bottom left accent */}
        <div 
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px]"
          style={{
            background: 'linear-gradient(135deg, hsl(350 40% 94% / 0.5) 0%, hsl(20 50% 95% / 0.3) 100%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            filter: 'blur(50px)',
          }}
        />
      </div>

      <div className="container relative mx-auto px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div
          ref={ref}
          className={cn(
            'mb-16 lg:mb-20 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              Platform Capabilities
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-foreground">
              What powers your{' '}
              <span className="relative inline-block">
                compliance
                <span 
                  className="absolute -bottom-1 left-0 w-full h-3 -z-10 opacity-40"
                  style={{
                    background: 'linear-gradient(90deg, hsl(258 55% 75%) 0%, hsl(200 60% 80%) 100%)',
                    borderRadius: '4px',
                  }}
                />
              </span>
            </h2>
          </div>
        </div>

        {/* Asymmetric grid layout - not uniform cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div
                key={index}
                className={cn(
                  'group relative bg-card p-8 lg:p-10 transition-all duration-500',
                  'hover:bg-muted/30',
                  isVisible ? 'opacity-100' : 'opacity-0'
                )}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                {/* Top section with icon and metric */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-foreground/[0.04] border border-border/60 flex items-center justify-center group-hover:bg-foreground/[0.08] transition-colors">
                    <Icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  
                  {/* Metric - right aligned */}
                  <div className="text-right">
                    <span className="text-2xl font-bold text-foreground tracking-tight">
                      {item.metric}
                    </span>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {item.metricLabel}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
                
                {/* Subtle hover indicator */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
