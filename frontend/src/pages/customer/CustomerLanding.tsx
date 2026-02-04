import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ChevronRight, Quote, Sparkles, CheckCircle2, Clock, Users } from 'lucide-react';
import logo from '@/assets/ekycense-logo.png';

export default function CustomerLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Welcome & CTA */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, hsl(200 30% 8%) 0%, hsl(210 25% 12%) 50%, hsl(220 20% 10%) 100%)'
        }}
      >
        {/* Animated gradient orbs - mint/teal theme for customer portal */}
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(170 70% 45% / 0.25) 0%, hsl(190 60% 40% / 0.15) 40%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'orbFloat 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(200 70% 50% / 0.2) 0%, hsl(220 60% 45% / 0.1) 50%, transparent 70%)',
            filter: 'blur(70px)',
            animation: 'orbFloat 18s ease-in-out 3s infinite reverse',
          }}
        />
        <div 
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(160 60% 50% / 0.15) 0%, transparent 60%)',
            filter: 'blur(60px)',
            animation: 'orbFloat 16s ease-in-out 1s infinite',
          }}
        />
        
        <div className="max-w-md w-full mx-auto relative z-10">
          {/* Logo */}
          <div className="mb-16">
            <img src={logo} alt="EKYCense" className="h-12 w-auto brightness-0 invert" />
          </div>

          {/* Welcome Text */}
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Open your account
            </h1>
            <p className="text-slate-400 text-lg">Complete your verification quickly and securely in just a few steps</p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/customer/signup')}
              className="w-full h-14 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold text-base rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]"
            >
              Get started
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/customer/login')}
              className="w-full h-14 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 font-medium text-base rounded-xl transition-all"
            >
              Already started? Continue verification
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/10 mb-2">
                <Clock className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-400">Under 5 mins</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-teal-500/10 mb-2">
                <Shield className="h-5 w-5 text-teal-400" />
              </div>
              <p className="text-sm text-slate-400">Bank-grade</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-cyan-500/10 mb-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-400" />
              </div>
              <p className="text-sm text-slate-400">Fully secure</p>
            </div>
          </div>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes orbFloat {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(-20px, 20px) scale(1.05);
            }
            66% {
              transform: translate(15px, -10px) scale(0.98);
            }
          }
        `}</style>
      </div>

      {/* Right Panel - Testimonial */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-center p-12 xl:p-16 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, hsl(190 25% 6%) 0%, hsl(200 30% 8%) 50%, hsl(210 25% 6%) 100%)'
        }}
      >
        {/* Decorative starburst - teal/cyan theme */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-0.5 origin-bottom"
                style={{
                  height: `${200 + Math.random() * 100}px`,
                  transform: `translate(-50%, -100%) rotate(${i * 22.5}deg)`,
                  background: `linear-gradient(to top, transparent 0%, hsl(${170 + i * 5} 50% 50% / ${0.15 + Math.random() * 0.1}) 50%, transparent 100%)`,
                }}
              />
            ))}
          </div>
          {/* Glowing center */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(170 60% 50% / 0.3) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
        </div>

        {/* Testimonial Card */}
        <div className="relative z-10 max-w-xl mx-auto">
          <div 
            className="rounded-3xl p-10 xl:p-12 border border-white/5"
            style={{
              background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.03) 0%, hsl(0 0% 100% / 0.01) 100%)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-8">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Trusted verification partner</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-8 leading-tight">
              Simple &<br />Secure Process
            </h2>
            
            <div className="mb-10">
              <Quote className="h-10 w-10 text-emerald-400/40 mb-6" />
              <p className="text-xl xl:text-2xl text-slate-300 leading-relaxed font-light">
                "The verification was incredibly smooth. I was verified in minutes and the whole process felt secure and professional."
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="h-16 w-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(170 60% 45%) 0%, hsl(190 70% 45%) 100%)',
                }}
              >
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-xl">Michael Torres</p>
                <p className="text-slate-400 text-base">Verified Customer</p>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-3 mt-10">
              <button className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              <button className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="flex-1" />
              <div className="flex gap-1.5">
                <div className="h-2 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
