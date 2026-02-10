import { useState, useEffect } from 'react';
import { Sun, Moon, LayoutDashboard, Clock, User, LogOut, Menu, BarChart3, TrendingUp, PiggyBank, Upload } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

export default function Sidebar({ currentPage, onPageChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = (forceExpand = false) => {
    const isMobile = window.innerWidth < 1024;
    
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      if (forceExpand) {
        setIsCollapsed(false);
      } else {
        setIsCollapsed(!isCollapsed);
      }
    }
  };

  const handleNavClick = (page) => {
    if (window.innerWidth < 1024 && isCollapsed) {
      setIsCollapsed(false);
    }
    onPageChange(page);
    
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'trends', icon: TrendingUp, label: 'Trends' },
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'budget', icon: PiggyBank, label: 'Budget' },
    { id: 'import', icon: Upload, label: 'Import' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <>
      {/* Mobile Header Bar - Only visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu size={24} className="text-gray-900 dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Financy</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 top-16"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}
          flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-4 space-y-8 
          transition-all duration-300 z-40 h-full overflow-hidden
          absolute lg:relative
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-lg dark:shadow-none
          top-16 lg:top-0
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => handleToggle(true)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <Logo size="medium" showText={!isCollapsed} />
          </button>
          
          <button
            onClick={() => handleToggle()}
            className="sidebar-text p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl hidden lg:flex items-center justify-center text-gray-600 dark:text-gray-400"
            aria-label="Toggle Sidebar"
          >
            <span className="text-sm font-bold">{isCollapsed ? '→' : '←'}</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  nav-link w-full flex items-center gap-4 p-3 rounded-xl font-bold transition-all
                  ${currentPage === item.id
                    ? 'text-primary bg-blue-50 dark:bg-primary/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }
                `}
                aria-selected={currentPage === item.id}
                title={item.label}
              >
                <IconComponent size={20} />
                <span className="sidebar-text whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-4 p-3 rounded-xl font-bold transition-all text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <>
              <Sun size={20} />
              <span className="sidebar-text whitespace-nowrap">Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={20} />
              <span className="sidebar-text whitespace-nowrap">Dark Mode</span>
            </>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="relative z-50 w-full flex items-center gap-4 p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-500 dark:hover:text-white transition-all overflow-visible"
          title="Logout"
        >
          <LogOut size={20} />
          <span className="sidebar-text whitespace-nowrap">Logout</span>
        </button>
      </aside>
    </>
  );
}
