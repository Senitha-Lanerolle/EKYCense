import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export function ProblemSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-[0.08]"
          style={{
            background: 'conic-gradient(from 0deg, hsl(15 85% 55%), hsl(258 70% 60%), hsl(162 60% 45%), hsl(15 85% 55%))',
            filter: 'blur(100px)',
            animation: 'spin 20s linear infinite',
          }}
        />
      </div>

      <div className="container relative mx-auto px-6 lg:px-8 max-w-6xl">
        <div
          ref={ref}
          className={cn(
            'relative transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Animated gradient border card */}
          <div className="relative p-px rounded-[2.5rem] overflow-hidden">
            {/* Animated gradient border */}
            <div 
              className="absolute inset-0 rounded-[2.5rem]"
              style={{
                background: 'linear-gradient(135deg, hsl(15 85% 55% / 0.3), hsl(258 70% 60% / 0.3), hsl(162 60% 45% / 0.3), hsl(15 85% 55% / 0.3))',
                backgroundSize: '300% 300%',
                animation: 'gradient-shift 8s ease infinite',
              }}
            />
            
            {/* Inner content */}
            <div className="relative rounded-[2.4rem] bg-card/90 backdrop-blur-xl px-8 py-16 md:px-16 md:py-24 lg:px-24 lg:py-32">
              {/* Decorative corner accents */}
              <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-foreground/10 rounded-tl-xl" />
              <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-foreground/10 rounded-br-xl" />
              
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.15]">
                  <span className="gradient-text-coral">Stop penalties</span>{' '}
                  <span className="text-muted-foreground">before they start.</span>
                  <br className="hidden md:block" />
                  <span className="gradient-text-lavender">Verify</span>{' '}
                  <span className="text-muted-foreground">identities across languages,</span>
                  <br className="hidden lg:block" />
                  <span className="text-foreground">get clear explanations,</span>{' '}
                  <span className="text-muted-foreground">all in one platform.</span>
                </h2>
                
                {/* Stats row */}
                <div className="mt-12 md:mt-16 grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-foreground">$4.2B</div>
                    <div className="text-sm text-muted-foreground mt-1">AML fines in 2023</div>
                  </div>
                  <div className="text-center border-x border-border/50">
                    <div className="text-3xl md:text-4xl font-bold text-foreground">60%</div>
                    <div className="text-sm text-muted-foreground mt-1">False positive rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-foreground">40+</div>
                    <div className="text-sm text-muted-foreground mt-1">Scripts we support</div>
                  </div>
                </div>
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
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
