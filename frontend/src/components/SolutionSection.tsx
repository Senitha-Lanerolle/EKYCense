import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DashboardMockup } from './mockups/DashboardMockup';
import { ArrowRight, Globe2, TrendingDown, MapPin } from 'lucide-react';

const features = [
  {
    icon: Globe2,
    text: 'Handles transliteration variants',
    color: 'emerald',
  },
  {
    icon: TrendingDown,
    text: 'Reduces false positives by 60%',
    color: 'violet',
  },
  {
    icon: MapPin,
    text: 'Works across 40+ jurisdictions',
    color: 'amber',
  },
];

export function SolutionSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-background to-muted/20" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--mint)) 0%, transparent 50%)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      <div className="container relative mx-auto px-6 lg:px-8 max-w-7xl">
        <div
          ref={ref}
          className={cn(
            'grid lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-foreground/[0.03] border border-border/50">
              <Globe2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-muted-foreground">Multilingual Intelligence</span>
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.1] mb-6">
                <span className="gradient-text-mint">Cross-lingual</span>
                <br />
                name matching
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Verify identities across languages and scripts — Arabic, Chinese, Russian, and more. Our semantic embeddings understand meaning, not just spellings.
              </p>
            </div>

            {/* Feature list with icons */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl transition-all duration-300',
                      'bg-card/50 border border-border/30 hover:border-border/50 hover:bg-card/70'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      feature.color === 'emerald' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                      feature.color === 'violet' && 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
                      feature.color === 'amber' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-foreground font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            <Button className="group rounded-full text-base px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-300">
              Learn more
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>

          {/* Mockup with animated border */}
          <div
            className={cn(
              'relative transition-all duration-700 delay-200',
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            )}
          >
            {/* Animated gradient glow behind */}
            <div 
              className="absolute -inset-4 rounded-[2rem] opacity-40"
              style={{
                background: 'conic-gradient(from 0deg, hsl(162 60% 45% / 0.3), hsl(258 70% 60% / 0.3), hsl(162 60% 45% / 0.3))',
                filter: 'blur(40px)',
                animation: 'spin 15s linear infinite',
              }}
            />
            
            {/* Card with animated border */}
            <div className="relative p-px rounded-[2rem] overflow-hidden">
              {/* Animated gradient border */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, hsl(162 60% 45% / 0.5), hsl(258 70% 60% / 0.5), hsl(162 60% 45% / 0.5))',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-shift 6s ease infinite',
                }}
              />
              
              <div className="relative bg-card rounded-[1.9rem] p-2">
                <DashboardMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
