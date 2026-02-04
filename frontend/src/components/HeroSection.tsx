import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScreeningMockup } from './mockups/ScreeningMockup';
import { MatchResultMockup } from './mockups/MatchResultMockup';

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Unique architectural background - not generic gradient orbs */}
      <div className="absolute inset-0">
        {/* Base - clean warm white */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'hsl(40 30% 98%)',
          }}
        />
        
        {/* Architectural diagonal accent - top */}
        <div 
          className="absolute top-0 right-0 w-full h-[60%]"
          style={{
            background: `linear-gradient(165deg, 
              hsl(258 35% 94% / 0.7) 0%, 
              hsl(210 40% 96% / 0.5) 30%,
              transparent 60%
            )`,
            clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0% 60%)',
          }}
        />
        
        {/* Subtle warm accent - bottom left */}
        <div 
          className="absolute bottom-0 left-0 w-[50%] h-[40%]"
          style={{
            background: 'linear-gradient(45deg, hsl(20 45% 95% / 0.6) 0%, transparent 70%)',
          }}
        />
        
        {/* Fine grid pattern - editorial style */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />
        
        {/* Single accent line */}
        <div 
          className="absolute top-[20%] left-0 w-full h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, hsl(258 40% 80% / 0.3) 30%, hsl(200 50% 85% / 0.2) 70%, transparent 100%)',
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-7">
            {/* Headline */}
            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08]">
                <span className="text-foreground">Bank-grade</span>
                <br />
                <span className="text-foreground">identity screening.</span>
                <br />
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, hsl(258 70% 55%) 0%, hsl(200 80% 50%) 50%, hsl(160 70% 45%) 100%)',
                  }}
                >
                  Built for compliance.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Verify identities across languages, scripts, and jurisdictions with advanced name matching and explainable workflows.
              </p>
            </div>

            {/* CTAs - Two buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="rounded-full text-base px-7 py-6 font-semibold group shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: 'hsl(220 15% 12%)',
                }}
                onClick={() => navigate('/console/login')}
              >
                Access Bank Console
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full text-base px-7 py-6 border-foreground/20 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all font-medium group"
                onClick={() => navigate('/customer')}
              >
                Start Customer Verification
              </Button>
            </div>
          </div>

          {/* Right Column - Mockups */}
          <div className="relative h-[420px] md:h-[500px] lg:h-[540px]">
            {/* Accent gradient shape behind mockups */}
            <div 
              className="absolute top-10 right-10 w-80 h-80 rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(20 80% 75% / 0.3) 0%, hsl(350 60% 80% / 0.2) 50%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />
            <div 
              className="absolute bottom-20 left-10 w-64 h-64 rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(258 70% 80% / 0.3) 0%, transparent 60%)',
                filter: 'blur(45px)',
              }}
            />

            {/* Main mockup */}
            <div 
              className="absolute top-0 right-0 w-full max-w-[400px] z-10"
              style={{ animation: 'mockupFloat 8s ease-in-out infinite' }}
            >
              <div 
                className="rounded-2xl overflow-hidden border border-white/60"
                style={{
                  background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.95) 0%, hsl(0 0% 100% / 0.88) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 25px 60px -15px hsl(220 30% 20% / 0.2), 0 10px 30px -10px hsl(220 30% 20% / 0.15)',
                }}
              >
                <ScreeningMockup />
              </div>
            </div>
            
            {/* Secondary mockup */}
            <div 
              className="absolute bottom-4 left-0 w-[300px] z-20"
              style={{ animation: 'mockupFloat 8s ease-in-out 2s infinite' }}
            >
              <div 
                className="rounded-2xl overflow-hidden border border-white/60"
                style={{
                  background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.95) 0%, hsl(0 0% 100% / 0.88) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 50px -12px hsl(220 30% 20% / 0.18), 0 8px 20px -6px hsl(220 30% 20% / 0.12)',
                }}
              >
                <MatchResultMockup />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes mockupFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </section>
  );
}
