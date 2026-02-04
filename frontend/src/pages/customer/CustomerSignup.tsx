import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, ChevronRight, Shield, Lock, CheckCircle2 } from 'lucide-react';
import logo from '@/assets/ekycense-logo.png';

export default function CustomerSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      sessionStorage.setItem('customer_email', formData.email);
      navigate('/customer/onboarding/personal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Logo" className="h-10" />
            <button 
              onClick={() => navigate('/customer')}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Back to home
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Left - Form */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-12">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Create your account
              </h1>
              <p className="text-slate-500">Enter your details to begin verification</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email address</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-blue-500 focus:ring-blue-500/20"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pr-12 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Confirm password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pr-12 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                  className="mt-0.5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
              {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms}</p>}

              <Button 
                type="submit"
                className="w-full h-12 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-sm transition-all hover:shadow-md"
              >
                Continue
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button onClick={() => navigate('/customer/login')} className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Right - Features */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-center p-12 xl:p-16 bg-slate-50 border-l border-slate-100">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Why verify with us?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Bank-grade security</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Your data is encrypted with 256-bit encryption and protected by industry-leading security protocols</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Privacy first</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">We only collect what's necessary and never share your personal information with third parties</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Quick verification</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Most verifications are completed within minutes, getting you onboarded faster</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
