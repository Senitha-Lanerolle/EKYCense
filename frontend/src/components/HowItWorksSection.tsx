import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Customer Submission',
    description: 'Customer submits identity details during onboarding through your existing channels.',
    accent: 'emerald',
  },
  {
    number: '02',
    title: 'Intelligent Screening',
    description: 'Two-stage search: candidate shortlisting with safe lexical filters, then multilingual semantic matching.',
    accent: 'violet',
  },
  {
    number: '03',
    title: 'Risk Classification',
    description: 'Each case is classified as Match, Partial Match, or No Match with confidence scoring.',
    accent: 'amber',
  },
  {
    number: '04',
    title: 'Human Review',
    description: 'Compliance analysts review flagged cases with full context and match breakdown.',
    accent: 'blue',
  },
  {
    number: '05',
    title: 'Final Decision',
    description: 'A clear, auditable decision is recorded — ready for regulators at any time.',
    accent: 'rose',
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="how-it-works" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        {/* Floating orbs */}
        <div 
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] opacity-30"
          style={{
            background: 'radial-gradient(circle, hsl(258 55% 70% / 0.5) 0%, transparent 60%)',
            filter: 'blur(60px)',
            animation: 'pulse-glow 8s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] opacity-25"
          style={{
            background: 'radial-gradient(circle, hsl(162 50% 60% / 0.5) 0%, transparent 60%)',
            filter: 'blur(50px)',
            animation: 'pulse-glow 6s ease-in-out 2s infinite',
          }}
        />
      </div>
      
      <div className="container relative mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Section Header - compact */}
        <div
          ref={ref}
          className={cn(
            'text-center mb-14 lg:mb-20 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.1] mb-5">
            From submission to{' '}
            <span className="gradient-text-lavender">decision</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A streamlined workflow that keeps your team efficient and your institution compliant
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central connector line with animated gradient */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-border to-transparent" />
            <div 
              className={cn(
                "absolute inset-0 bg-gradient-to-b from-violet-500/50 via-emerald-500/50 to-rose-500/50 transition-all duration-1000",
                isVisible ? "opacity-100" : "opacity-0"
              )}
              style={{
                maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
              }}
            />
          </div>

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={cn(
                    'relative transition-all duration-700',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={cn(
                    'flex items-start gap-6 md:gap-0',
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}>
                    {/* Timeline node */}
                    <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                      <div className={cn(
                        'w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300',
                        'bg-card border-2 shadow-lg',
                        step.accent === 'emerald' && 'border-emerald-500/50 text-emerald-600 dark:text-emerald-400',
                        step.accent === 'violet' && 'border-violet-500/50 text-violet-600 dark:text-violet-400',
                        step.accent === 'amber' && 'border-amber-500/50 text-amber-600 dark:text-amber-400',
                        step.accent === 'blue' && 'border-blue-500/50 text-blue-600 dark:text-blue-400',
                        step.accent === 'rose' && 'border-rose-500/50 text-rose-600 dark:text-rose-400',
                      )}>
                        {step.number}
                      </div>
                      
                      {/* Glow ring */}
                      <div className={cn(
                        'absolute inset-0 rounded-2xl opacity-30 blur-md -z-10',
                        step.accent === 'emerald' && 'bg-emerald-500',
                        step.accent === 'violet' && 'bg-violet-500',
                        step.accent === 'amber' && 'bg-amber-500',
                        step.accent === 'blue' && 'bg-blue-500',
                        step.accent === 'rose' && 'bg-rose-500',
                      )} />
                    </div>

                    {/* Content card */}
                    <div className={cn(
                      'flex-1 md:w-[calc(50%-4rem)]',
                      isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'
                    )}>
                      <div className={cn(
                        'group relative p-6 lg:p-8 rounded-2xl transition-all duration-500',
                        'bg-card/60 backdrop-blur-sm border border-border/40',
                        'hover:border-border/60 hover:shadow-xl hover:-translate-y-1'
                      )}>
                        {/* Subtle gradient overlay */}
                        <div className={cn(
                          'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                          step.accent === 'emerald' && 'bg-gradient-to-br from-emerald-500/5 to-transparent',
                          step.accent === 'violet' && 'bg-gradient-to-br from-violet-500/5 to-transparent',
                          step.accent === 'amber' && 'bg-gradient-to-br from-amber-500/5 to-transparent',
                          step.accent === 'blue' && 'bg-gradient-to-br from-blue-500/5 to-transparent',
                          step.accent === 'rose' && 'bg-gradient-to-br from-rose-500/5 to-transparent',
                        )} />
                        
                        <div className="relative">
                          <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-[calc(50%-4rem)]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
}
