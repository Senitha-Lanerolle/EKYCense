import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AnalyticsMockup } from './mockups/AnalyticsMockup';

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          ref={ref}
          className={cn(
            'feature-row-reverse transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-display-sm">
              Explainable screening<br />
              results.
            </h2>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Every decision comes with a clear reason. No black boxes. Your compliance teams get human-readable explanations they can actually trust and defend.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                Clear match rationale
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                Threshold transparency
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                Audit-ready documentation
              </li>
            </ul>
            <Button className="btn-primary mt-4">
              Learn more
            </Button>
          </div>

          {/* Mockup */}
          <div
            className={cn(
              'transition-all duration-700 delay-200',
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            )}
          >
            <AnalyticsMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
