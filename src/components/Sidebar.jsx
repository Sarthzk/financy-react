import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Sidebar({ currentPage, onPageChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'history', icon: '📜', label: 'History' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-card border border-border rounded-xl"
        aria-label="Toggle Menu"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}
          flex flex-col bg-card border-r border-border p-4 space-y-8 
          transition-all duration-300 z-40 h-full overflow-hidden
          absolute lg:relative
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => handleToggle(true)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-10 h-10 min-w-[40px]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#D4AF37"
                  strokeWidth="3"
                  strokeDasharray="180 70"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#0B50DA"
                  strokeWidth="6"
                  strokeDasharray="140 110"
                  transform="rotate(-90 50 50)"
                  fill="none"
                />
              </svg>
            </div>
            <span className="sidebar-text text-xl font-bold tracking-tight text-white whitespace-nowrap">
              Financy
            </span>
          </button>
          
          <button
            onClick={() => handleToggle()}
            className="sidebar-text p-2 hover:bg-slate-800 rounded-xl hidden lg:flex items-center justify-center"
            aria-label="Toggle Sidebar"
          >
            <span className="text-xs">{isCollapsed ? '❯' : '❮'}</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                nav-link w-full flex items-center gap-4 p-3 rounded-xl font-bold transition-all
                ${currentPage === item.id
                  ? 'text-primary bg-primary/10'
                  : 'text-slate-400 hover:bg-slate-800'
                }
              `}
              aria-selected={currentPage === item.id}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="sidebar-text whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all overflow-hidden"
          title="Logout"
        >
          <span className="text-xl">🚪</span>
          <span className="sidebar-text whitespace-nowrap">Logout</span>
        </button>
      </aside>
    </>
  );
}
