import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  HardHat,
  Bell,
  Wrench,
  AlertTriangle,
  FileText,
  BookOpen,
  Box
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Главная', path: '/', icon: LayoutDashboard },
    { name: 'Оборудование', path: '/equipment', icon: Wrench },
    { name: 'Тикеты (ППР / Аварии)', path: '/tickets', icon: AlertTriangle },
    { name: 'Заявки ТМЦ', path: '/materials', icon: Box },
    { name: 'Отчеты', path: '/reports', icon: FileText },
    { name: 'База знаний', path: '/knowledge', icon: BookOpen },
  ];

  const NavLinks = ({ onClick }) => (
    <div className="space-y-1 mt-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary/20 text-primary border border-primary/30 font-medium'
                  : 'text-text-muted hover:bg-dark-surface-light hover:text-text-main'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-dark-surface border-r border-dark-border h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3 border-b border-dark-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <HardHat className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">CATOCA</h1>
            <p className="text-xs text-primary font-medium uppercase tracking-widest">Система ТОиР</p>
          </div>
        </div>

        <div className="flex-1 px-4 overflow-y-auto">
          <NavLinks />
        </div>

        <div className="p-4 border-t border-dark-border">
          <div className="bg-dark-bg rounded-xl p-4 mb-4 border border-dark-border">
            <p className="text-sm font-medium text-text-main">{user?.name}</p>
            <p className="text-xs text-text-muted mt-1">{user?.service || 'Руководство'} • {user?.location}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile Header & Overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-dark-surface border-b border-dark-border z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <HardHat className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold">CATOCA</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-text-muted hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-dark-bg pt-16 flex flex-col h-screen">
          <div className="flex-1 px-4 overflow-y-auto">
            <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
          </div>
          <div className="p-4 border-t border-dark-border bg-dark-surface">
            <div className="mb-4">
              <p className="text-sm font-medium text-text-main">{user?.name}</p>
              <p className="text-xs text-text-muted">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-accent-red bg-accent-red/10 rounded-xl"
            >
              <LogOut className="w-5 h-5" />
              Выйти
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0">
        <header className="hidden md:flex h-16 bg-dark-surface border-b border-dark-border items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-medium text-text-muted">Рабочая область</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-text-muted hover:text-white transition-colors rounded-full hover:bg-dark-surface-light">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-red rounded-full border-2 border-dark-surface"></span>
            </button>
            <div className="h-8 w-8 bg-primary/20 text-primary border border-primary/30 rounded-full flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-dark-bg">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
