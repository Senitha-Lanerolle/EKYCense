import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, ChevronRight, Shield, Lock, CheckCircle2 } from 'lucide-react';
import logo from '@/assets/ekycense-logo.png';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - navigate to onboarding
    navigate('/customer/onboarding/personal');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, hsl(200 30% 8%) 0%, hsl(210 25% 12%) 50%, hsl(220 20% 10%) 100%)'
        }}
      >
        {/* Animated gradient orbs */}
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(170 70% 45% / 0.25) 0%, hsl(190 60% 40% / 0.15) 40%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'orbFloat 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(200 70% 50% / 0.2) 0%, hsl(220 60% 45% / 0.1) 50%, transparent 70%)',
            filter: 'blur(70px)',
            animation: 'orbFloat 18s ease-in-out 3s infinite reverse',
          }}
        />
        
        <div className="max-w-md w-full mx-auto relative z-10">
          {/* Logo */}
          <div className="mb-12">
            <img src={logo} alt="EKYCense" className="h-12 w-auto brightness-0 invert" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Welcome back
            </h1>
            <p className="text-slate-400">Continue your verification journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email address</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-emerald-400/50 focus:ring-emerald-400/20 focus:bg-white/10 transition-all"
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
                  className="h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl pr-12 focus:border-emerald-400/50 focus:ring-emerald-400/20 focus:bg-white/10 transition-all"
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
                  className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                  Keep me logged in
                </label>
              </div>
              <button type="button" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit"
              className="w-full h-14 mt-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold text-base rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]"
            >
              Sign in
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <button onClick={() => navigate('/customer/signup')} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Create one
            </button>
          </p>
        </div>

        <style>{`
          @keyframes orbFloat {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-20px, 20px) scale(1.05); }
            66% { transform: translate(15px, -10px) scale(0.98); }
          }
        `}</style>
      </div>

      {/* Right Panel - Features */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-center p-12 xl:p-16 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, hsl(190 25% 6%) 0%, hsl(200 30% 8%) 50%, hsl(210 25% 6%) 100%)'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 right-20 w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(170 60% 50% / 0.15) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
          <div 
            className="absolute bottom-32 left-10 w-48 h-48 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(200 60% 50% / 0.1) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Continue where you left off</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Your progress is saved</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Pick up right where you left off in your verification journey</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/20 flex items-center justify-center">
                <Lock className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Secure authentication</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Your account is protected with industry-standard security</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Track your status</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Monitor your verification progress in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
