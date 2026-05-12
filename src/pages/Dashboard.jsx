import React, { useState } from 'react';
import { MOCK_EQUIPMENT, MOCK_TICKETS, MOCK_DOWNTIME_LOG } from '../api/mockData';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Settings2,
  Wrench,
  TrendingUp,
  Plus,
  Search,
  Bell,
  Map as MapIcon,
  Maximize2,
  Zap,
  Cpu,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays, isWithinInterval } from 'date-fns';
import { ru } from 'date-fns/locale';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('month');

  // Logic for calculations
  const equipment = MOCK_EQUIPMENT.filter(e => e.isEquipment);
  const accidents = MOCK_TICKETS.filter(t => t.type === 'accident' && t.status !== 'completed');
  const ppms = MOCK_TICKETS.filter(t => t.type === 'ppm' && t.status !== 'completed');
  
  const totalAvailability = 94.2; // Mocked for design
  
  const getEquipmentName = (id) => MOCK_EQUIPMENT.find(e => e.id === id)?.name || 'Неизвестно';

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-bg-app animate-in fade-in duration-500">
      
      {/* Hero Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Availability Chart Card */}
        <div className="col-span-12 lg:col-span-8 bg-surface-app border border-outline-variant rounded-2xl p-6 flex flex-col gap-6 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                ОБЩАЯ ГОТОВНОСТЬ / DISPONIBILIDADE GERAL
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-black text-primary">{totalAvailability}%</span>
                <span className="text-green-600 font-bold text-sm flex items-center gap-0.5">
                  <TrendingUp className="w-4 h-4" /> +1.4%
                </span>
              </div>
            </div>
            <div className="flex gap-1 bg-surface-container p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('week')}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeTab === 'week' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-white/50'}`}
              >
                НЕДЕЛЯ
              </button>
              <button 
                onClick={() => setActiveTab('month')}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeTab === 'month' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-white/50'}`}
              >
                МЕСЯЦ
              </button>
            </div>
          </div>

          {/* Visual Chart Bars */}
          <div className="h-48 w-full mt-auto flex items-end gap-3 px-2">
            {[65, 82, 70, 92, 85, 94.2, 0].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col gap-2 group/bar">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-700 ease-out hover:scale-x-105 ${i === 5 ? 'bg-primary' : 'bg-surface-container-high group-hover/bar:bg-primary/20'}`}
                  style={{ height: `${val}%` }}
                />
                <div className="text-[9px] font-bold text-on-surface-variant text-center truncate">
                  {i === 6 ? 'ЗАВТРА' : `${i + 15} МАЙ`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Incidents Card */}
        <div className="col-span-12 lg:col-span-4 bg-surface-app border border-outline-variant rounded-2xl p-6 flex flex-col gap-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-bold text-error uppercase tracking-widest">
              КРИТИЧЕСКИЕ ИНЦИДЕНТЫ / AVARIAS
            </h3>
            <span className="px-2 py-1 bg-error-container text-on-error-container text-[10px] font-black rounded-full">
              {accidents.length} ACTIVE
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar-thin pr-2">
            {accidents.length > 0 ? accidents.map(acc => (
              <div key={acc.id} className="p-4 rounded-xl border-l-4 border-error bg-error-container/5 hover:bg-error-container/10 transition-colors flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold text-on-surface">{getEquipmentName(acc.equipmentId)}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant">{format(new Date(acc.createdAt), 'HH:mm')}</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{acc.description}</p>
              </div>
            )) : (
              <div className="text-center py-12 text-text-muted italic border border-dashed border-outline-variant rounded-xl">
                Критических аварий нет
              </div>
            )}
          </div>

          <Link 
            to="/tickets"
            className="mt-auto w-full py-3 border border-outline-variant rounded-xl text-[11px] font-bold text-on-surface-variant hover:bg-surface-container transition-all text-center uppercase tracking-wider"
          >
            Посмотреть все (Ver Todos)
          </Link>
        </div>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Automation */}
        <div className="bg-surface-app border border-outline-variant rounded-2xl p-5 flex items-center gap-5 shadow-sm hover:border-primary transition-colors cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Автоматика</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-on-surface">98.1%</span>
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">NORMAL</span>
            </div>
          </div>
        </div>

        {/* Mechanics */}
        <div className="bg-surface-app border border-outline-variant rounded-2xl p-5 flex items-center gap-5 shadow-sm hover:border-primary transition-colors cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <Wrench className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Механика</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-on-surface">89.4%</span>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">Attention</span>
            </div>
          </div>
        </div>

        {/* Electrical */}
        <div className="bg-surface-app border border-outline-variant rounded-2xl p-5 flex items-center gap-5 shadow-sm hover:border-primary transition-colors cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <Zap className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Электрика</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-on-surface">95.2%</span>
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">NORMAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Layout: Work Orders & Map */}
      <div className="grid grid-cols-12 gap-6 pb-12">
        
        {/* Work Orders Table */}
        <div className="col-span-12 lg:col-span-8 bg-surface-app border border-outline-variant rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="text-lg font-bold text-on-surface">Текущие работы (Ordens de Trabalho)</h3>
            <Link 
              to="/tickets"
              className="bg-primary text-white px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" /> НОВАЯ ЗАЯВКА
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase tracking-widest border-b border-outline-variant">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Оборудование (Equipamento)</th>
                  <th className="px-6 py-4">Сервис</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4">Приоритет</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {[...accidents, ...ppms].slice(0, 5).map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                    <td className="px-6 py-5 text-xs font-bold text-on-surface-variant">#{ticket.id.toUpperCase()}</td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-on-surface">{getEquipmentName(ticket.equipmentId)}</div>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">Участок: Фабрика 2</div>
                    </td>
                    <td className="px-6 py-5 text-xs text-on-surface font-medium">{ticket.service}</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black rounded-full uppercase">
                        {ticket.status === 'completed' ? 'DONE' : 'IN PROGRESS'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`font-black text-[10px] ${ticket.type === 'accident' ? 'text-error' : 'text-on-surface-variant'}`}>
                        {ticket.type === 'accident' ? 'HIGH' : 'MEDIUM'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Map Preview */}
        <div className="col-span-12 lg:col-span-4 bg-surface-app border border-outline-variant rounded-2xl overflow-hidden flex flex-col shadow-sm group">
          <div className="px-6 py-5 border-b border-outline-variant bg-surface-container-low">
            <h3 className="text-lg font-bold text-on-surface">Карта карьера (Localização)</h3>
          </div>
          <div className="flex-1 relative min-h-[350px]">
            <img 
              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
              alt="Mining site aerial view"
              src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1000"
            />
            {/* Map Hotspots */}
            <div className="absolute top-[30%] left-[45%] group/pin cursor-pointer">
              <div className="w-5 h-5 bg-error rounded-full animate-ping absolute inset-0 opacity-75"></div>
              <div className="w-5 h-5 bg-error rounded-full border-2 border-white relative"></div>
              <div className="hidden group-hover/pin:block absolute top-7 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-xl border border-outline-variant">
                Shovel S-02: Failure
              </div>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 bg-surface-app/90 backdrop-blur-md border border-outline-variant p-3 rounded-xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-bold text-on-surface">Catoca Mine, Angola</span>
              </div>
              <Maximize2 className="w-4 h-4 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* FAB (Conditional for Dashboard) */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <Wrench className="w-7 h-7 group-hover:rotate-45 transition-transform" />
      </button>

    </div>
  );
};

export default Dashboard;
