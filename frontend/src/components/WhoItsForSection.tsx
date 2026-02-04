import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { Building2, ShieldCheck, UserCheck } from 'lucide-react';

const audiences = [
  {
    icon: Building2,
    title: 'For Financial Institutions',
    benefits: [
      'Reduce false positives by 60%',
      'Improve analyst efficiency',
      'Meet regulatory expectations',
    ],
    gradient: 'from-mint to-mint-dark',
  },
  {
    icon: ShieldCheck,
    title: 'For Compliance Teams',
    benefits: [
      'Transparent decisions',
      'Review-friendly case timelines',
      'Understand why a match occurred',
    ],
    gradient: 'from-lavender to-periwinkle',
  },
  {
    icon: UserCheck,
    title: 'For Customers',
    benefits: [
      'Fewer unnecessary rejections',
      'Faster onboarding experience',
      'Fairer identity verification',
    ],
    gradient: 'from-periwinkle to-soft-pink',
  },
];

export function WhoItsForSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="who-its-for" className="py-24 md:py-32 relative">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/20" />
      
      <div className="container relative mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div
          ref={ref}
          className={cn(
            'text-center mb-16 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <h2 className="text-display-md mb-4">
            Who it's <span className="gradient-text">for</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for everyone in the identity verification chain.
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className={cn(
                'glass-card p-8 transition-all duration-500 hover-glow group',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Icon */}
              <div className={cn(
                'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300',
                audience.gradient
              )}>
                <audience.icon className="w-7 h-7 text-foreground" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground mb-5">{audience.title}</h3>

              {/* Benefits */}
              <ul className="space-y-3">
                {audience.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
