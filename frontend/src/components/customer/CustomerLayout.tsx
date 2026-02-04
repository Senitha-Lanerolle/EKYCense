import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/ekycense-logo.png';

interface CustomerLayoutProps {
  children: ReactNode;
  showBackLink?: boolean;
}

export function CustomerLayout({ children, showBackLink = false }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/customer" className="flex items-center">
              <img src={logo} alt="Logo" className="h-10" />
            </Link>
            {showBackLink && (
              <Link 
                to="/customer" 
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Back to home
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white/50 py-8 mt-auto">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm text-slate-500">
            © 2024 Secure identity verification.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <Link to="/customer/help" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
              Help & Support
            </Link>
            <span className="text-slate-300">|</span>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-300">|</span>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
