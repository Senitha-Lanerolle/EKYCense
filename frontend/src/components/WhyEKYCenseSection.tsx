import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

const reasons = [
  'Designed around real banking workflows',
  'Explainability built in — not added later',
  'Hybrid intelligence, not blind automation',
  'Trusted by compliance professionals worldwide',
];

export function WhyEKYCenseSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="why-ekycense" className="py-24 md:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          ref={ref}
          className={cn(
            'max-w-3xl mx-auto text-center transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Header */}
          <h2 className="text-display-sm mb-4">
            <span className="gradient-text">Compliance-first.</span>{' '}
            Not AI-first.
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            We believe in technology that serves compliance goals, not the other way around.
          </p>

          {/* Reasons Grid */}
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-4 p-5 rounded-2xl bg-muted/50 transition-all duration-500',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
