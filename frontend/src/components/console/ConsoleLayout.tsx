import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, ListFilter, Settings, User, ArrowLeft } from 'lucide-react';
import logo from '@/assets/ekycense-logo.png';

interface ConsoleLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Overview', href: '/console', icon: LayoutDashboard, exact: true },
  { label: 'Cases', href: '/console/cases', icon: FileText },
  { label: 'Review Queue', href: '/console/review-queue', icon: ListFilter },
  { label: 'Settings', href: '/console/settings', icon: Settings, disabled: true },
];

export function ConsoleLayout({ children }: ConsoleLayoutProps) {
  const location = useLocation();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border/60 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <a href="/" className="flex items-center gap-3 group">
            <img src={logo} alt="EKYCense" className="h-10 w-auto brightness-0 invert" />
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          <p className="px-3 pb-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            
            return (
              <NavLink
                key={item.href}
                to={item.disabled ? '#' : item.href}
                onClick={(e) => item.disabled && e.preventDefault()}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  active 
                    ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5',
                  item.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-400'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg transition-all',
                  active 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'bg-white/5 text-slate-400'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Back to Site Link */}
        <div className="px-4 pb-4">
          <a 
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </a>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
            <div 
              className="h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10"
            >
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">analyst_1</p>
              <p className="text-xs text-slate-400">Compliance Analyst</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 ml-72 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-border/60 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-foreground">Analyst Console</span>
            <span className="text-xs text-emerald-600 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-medium">Live</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-border/60">
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10"
              >
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground block">analyst_1</span>
                <span className="text-xs text-muted-foreground">Compliance Team</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
