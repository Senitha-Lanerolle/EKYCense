import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/ekycense-logo.png';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Who It\'s For', href: '#who-its-for' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      {/* Floating pill navbar */}
      <nav
        className={cn(
          'mx-auto max-w-4xl rounded-full transition-all duration-500',
          'border border-white/60'
        )}
        style={{
          background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.85) 0%, hsl(0 0% 100% / 0.75) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 4px 24px -4px hsl(220 30% 20% / 0.1), 0 2px 8px -2px hsl(220 30% 20% / 0.06)',
        }}
      >
        <div className="px-3 md:px-5 py-2">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <a href="#" className="flex items-center shrink-0">
              <img 
                src={logo} 
                alt="EKYCense" 
                className="h-9 md:h-10 w-auto object-contain"
              />
            </a>

            {/* Desktop Navigation - centered */}
            <div className="hidden lg:flex items-center justify-center gap-0.5 flex-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-foreground/5"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop CTAs - Sign In and Request Demo */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Button 
                variant="ghost"
                className="rounded-full px-4 py-1.5 h-auto font-medium text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5"
              >
                Sign In
              </Button>
              <Button 
                className="rounded-full px-4 py-1.5 h-auto font-medium text-sm"
                style={{
                  background: 'hsl(220 15% 15%)',
                  boxShadow: '0 2px 8px -2px hsl(220 30% 10% / 0.3)',
                }}
              >
                Request Demo
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground rounded-full hover:bg-foreground/5"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden mx-auto max-w-4xl mt-2 rounded-2xl border border-white/50 animate-fade-in overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.95) 0%, hsl(0 0% 100% / 0.9) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 8px 32px -4px hsl(220 30% 20% / 0.1)',
          }}
        >
          <div className="p-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-base font-medium text-foreground hover:bg-foreground/5 transition-colors text-left px-4 py-3 rounded-xl"
              >
                {link.label}
              </button>
            ))}
            <hr className="border-border/30 my-2" />
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline"
                className="rounded-full w-full py-4 font-medium"
              >
                Sign In
              </Button>
              <Button 
                className="rounded-full w-full py-4 font-medium"
                style={{
                  background: 'hsl(220 15% 15%)',
                }}
              >
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
