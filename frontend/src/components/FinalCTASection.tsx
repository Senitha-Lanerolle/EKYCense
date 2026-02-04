import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FinalCTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Premium background with organic shapes */}
      <div className="absolute inset-x-4 inset-y-0 lg:inset-x-8 bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 rounded-[3rem]">
        {/* Ambient orbs */}
        <div className="glow-orb glow-orb-mint w-80 h-80 top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
        <div className="glow-orb glow-orb-lavender w-96 h-96 bottom-0 right-0 translate-x-1/3 translate-y-1/3" />
        <div className="glow-orb glow-orb-coral w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">
        <div
          ref={ref}
          className={cn(
            'max-w-2xl mx-auto text-center transition-all duration-700',
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        >
          {/* Content */}
          <h2 className="text-display-md mb-6">
            Take the next step.
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
            Start verifying identities with confidence — your compliance journey begins now.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-primary text-lg px-10 py-6">
              Get Started
            </Button>
            <Button className="btn-outline text-lg px-10 py-6">
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
