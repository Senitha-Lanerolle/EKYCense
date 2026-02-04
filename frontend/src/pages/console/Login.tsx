import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Shield, ChevronRight, Quote, Sparkles } from 'lucide-react';
import logo from '@/assets/ekycense-logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to console
    navigate('/console');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, hsl(220 20% 10%) 0%, hsl(240 15% 15%) 50%, hsl(280 15% 12%) 100%)'
        }}
      >
        {/* Animated gradient orbs */}
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(350 70% 55% / 0.25) 0%, hsl(20 60% 50% / 0.15) 40%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'orbFloat 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(280 60% 50% / 0.2) 0%, hsl(320 50% 45% / 0.1) 50%, transparent 70%)',
            filter: 'blur(70px)',
            animation: 'orbFloat 18s ease-in-out 3s infinite reverse',
          }}
        />
        <div 
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(200 70% 50% / 0.15) 0%, transparent 60%)',
            filter: 'blur(60px)',
            animation: 'orbFloat 16s ease-in-out 1s infinite',
          }}
        />
        
        <div className="max-w-md w-full mx-auto relative z-10">
          {/* Logo - larger and better positioned */}
          <div className="mb-16">
            <img src={logo} alt="EKYCense" className="h-12 w-auto brightness-0 invert" />
          </div>

          {/* Welcome Text */}
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Welcome back
            </h1>
            <p className="text-slate-400 text-lg">Enter your credentials to access the compliance console</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email address</label>
              <Input
                type="email"
                placeholder="analyst@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-rose-400/50 focus:ring-rose-400/20 focus:bg-white/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl pr-12 focus:border-rose-400/50 focus:ring-rose-400/20 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-slate-600 data-[state=checked]:bg-rose-400 data-[state=checked]:border-rose-400"
                />
                <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                  Keep me logged in
                </label>
              </div>
              <button type="button" className="text-sm text-rose-400 hover:text-rose-300 font-medium transition-colors">
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 mt-2 bg-gradient-to-r from-rose-400 via-rose-500 to-orange-400 hover:from-rose-500 hover:via-rose-600 hover:to-orange-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-rose-500/30 transition-all hover:shadow-xl hover:shadow-rose-500/40 hover:scale-[1.02]"
            >
              Sign in to Console
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-12 text-center text-sm text-slate-500">
            Need access? <a href="#" className="text-rose-400 hover:text-rose-300 font-medium transition-colors">Contact your administrator</a>
          </p>
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
          background: 'linear-gradient(160deg, hsl(240 20% 8%) 0%, hsl(260 25% 10%) 50%, hsl(280 20% 8%) 100%)'
        }}
      >
        {/* Decorative starburst */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-0.5 origin-bottom"
                style={{
                  height: `${200 + Math.random() * 100}px`,
                  transform: `translate(-50%, -100%) rotate(${i * 22.5}deg)`,
                  background: `linear-gradient(to top, transparent 0%, hsl(${280 + i * 5} 50% 50% / ${0.15 + Math.random() * 0.1}) 50%, transparent 100%)`,
                }}
              />
            ))}
          </div>
          {/* Glowing center */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(280 60% 60% / 0.3) 0%, transparent 70%)',
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20 mb-8">
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-medium text-rose-300">Trusted by 500+ institutions</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-8 leading-tight">
              What Compliance<br />Officers Say
            </h2>
            
            <div className="mb-10">
              <Quote className="h-10 w-10 text-rose-400/40 mb-6" />
              <p className="text-xl xl:text-2xl text-slate-300 leading-relaxed font-light">
                "EKYCense transformed our screening process. What used to take hours now takes minutes with significantly better accuracy."
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="h-16 w-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(350 60% 55%) 0%, hsl(20 70% 55%) 100%)',
                }}
              >
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-xl">Sarah Chen</p>
                <p className="text-slate-400 text-base">Head of Compliance, GlobalBank</p>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-3 mt-10">
              <button className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              <button className="h-12 w-12 rounded-xl bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 hover:from-rose-500/30 hover:to-orange-500/30 transition-all">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="flex-1" />
              <div className="flex gap-1.5">
                <div className="h-2 w-8 rounded-full bg-gradient-to-r from-rose-400 to-orange-400" />
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
