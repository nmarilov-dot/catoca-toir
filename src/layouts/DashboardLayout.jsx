import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Wrench, 
  Cpu, 
  Zap, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search,
  HardHat,
  ChevronRight,
  Globe,
  Menu,
  X
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Сводка (Sumário)', icon: LayoutDashboard },
    { path: '/automation', label: 'Автоматика (Automação)', icon: Cpu },
    { path: '/mechanics', label: 'Механика (Mecânica)', icon: Wrench },
    { path: '/electrical', label: 'Электрика (Elétrica)', icon: Zap },
    { path: '/calendar', label: 'График (Escala)', icon: Calendar },
    { path: '/reports', label: 'Отчеты (Relatórios)', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-bg-app overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-surface-app border-r border-outline-variant flex flex-col p-6 gap-2 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Brand & User Profile */}
        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-primary">CATOCA</h1>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Служба ТОиР</p>
            </div>
          </div>
          
          <div className="p-3 bg-surface-container rounded-xl flex items-center gap-3 border border-outline-variant/30">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant">
               <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.username?.[0]?.toUpperCase()}
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface truncate">{user?.username === 'admin' ? 'Admin Engineer' : user?.username}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-secondary-container text-on-secondary-container shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span className={`text-sm ${isActive ? 'font-black' : 'font-medium'}`}>{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
          
          <div className="h-px bg-outline-variant my-4 opacity-50" />
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-error hover:bg-error-container/10 transition-all font-medium mt-auto"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Выход (Sair)</span>
          </button>
        </nav>

        {/* Footer Settings & Lang */}
        <div className="mt-8 pt-6 border-t border-outline-variant flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="px-2 py-1 bg-primary text-white text-[9px] font-black rounded-md cursor-pointer hover:opacity-80 transition-opacity">RU</span>
            <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-[9px] font-black rounded-md cursor-pointer hover:bg-surface-container-high transition-colors">PT</span>
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        
        {/* Top Header */}
        <header className="h-16 bg-surface-app border-b border-outline-variant px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-lg"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
               <LayoutDashboard className="w-5 h-5 text-primary lg:hidden" />
               <h2 className="text-lg font-black text-primary tracking-tight">M&R Catoca</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-surface-container px-4 py-2 rounded-xl gap-3 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-on-surface-variant group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Поиск оборудования..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder-on-surface-variant/50 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface-app"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-[10px] font-black text-on-secondary-container border border-outline-variant cursor-pointer hover:scale-105 transition-transform">
                {user?.username?.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <Outlet />
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
