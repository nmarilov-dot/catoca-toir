import React, { useState } from 'react';
import { MOCK_EQUIPMENT, MOCK_TICKETS } from '../api/mockData';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Settings2,
  Wrench,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Custom SVG Donut Chart
const DonutChart = ({ working, ppm, broken }) => {
  const total = working + ppm + broken;
  if (!total) return null;
  
  const wPct = (working / total) * 100;
  const pPct = (ppm / total) * 100;
  const bPct = (broken / total) * 100;

  const r = 15.91549430918954; // circumference = 100
  const wDash = wPct;
  const pDash = pPct;
  const bDash = bPct;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle cx="21" cy="21" r={r} fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
        
        {/* Segments */}
        {working > 0 && (
          <circle cx="21" cy="21" r={r} fill="transparent" stroke="#22c55e" strokeWidth="6" strokeDasharray={`${wDash} ${100 - wDash}`} strokeDashoffset="0" className="transition-all duration-1000 ease-out" />
        )}
        {ppm > 0 && (
          <circle cx="21" cy="21" r={r} fill="transparent" stroke="#eab308" strokeWidth="6" strokeDasharray={`${pDash} ${100 - pDash}`} strokeDashoffset={`-${wDash}`} className="transition-all duration-1000 ease-out" />
        )}
        {broken > 0 && (
          <circle cx="21" cy="21" r={r} fill="transparent" stroke="#ef4444" strokeWidth="6" strokeDasharray={`${bDash} ${100 - bDash}`} strokeDashoffset={`-${wDash + pDash}`} className="transition-all duration-1000 ease-out" />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-text-main">{Math.round(wPct)}%</span>
        <span className="text-xs text-text-muted font-medium">В работе</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeModal, setActiveModal] = useState(null);

  // Calculations
  const equipment = MOCK_EQUIPMENT.filter(e => e.isEquipment);
  const totalEq = equipment.length;
  const workingEq = equipment.filter(e => e.status === 'working').length;
  const ppmEq = equipment.filter(e => e.status === 'ppm').length;
  const brokenEq = equipment.filter(e => e.status === 'not_working').length;

  const workingPercent = totalEq ? Math.round((workingEq / totalEq) * 100) : 0;

  const activeAccidents = MOCK_TICKETS.filter(t => t.type === 'accident' && t.status !== 'completed').length;
  const activePPMs = MOCK_TICKETS.filter(t => t.type === 'ppm' && t.status !== 'completed').length;

  const recentTickets = [...MOCK_TICKETS]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getEquipmentName = (id) => MOCK_EQUIPMENT.find(e => e.id === id)?.name || 'Неизвестно';

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar bg-bg-app">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-main flex items-center gap-3">
          <Activity className="text-primary w-8 h-8" />
          Сводка по предприятию
        </h1>
        <p className="text-text-muted mt-2 font-medium">Оперативная картина состояния оборудования и заявок</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-app border border-border-app rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Settings2 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[10px] font-bold bg-bg-app border border-border-app px-2 py-1 rounded-full text-text-muted uppercase tracking-tighter">Всего</span>
          </div>
          <h3 className="text-3xl font-bold text-text-main mb-1 relative">{totalEq}</h3>
          <p className="text-sm text-text-muted relative">Единиц оборудования</p>
        </div>

        <div className="bg-surface-app border border-border-app rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/5 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-[10px] font-bold bg-bg-app border border-border-app px-2 py-1 rounded-full text-text-muted uppercase tracking-tighter">Исправно</span>
          </div>
          <h3 className="text-3xl font-bold text-text-main mb-1 relative">{workingPercent}%</h3>
          <p className="text-sm text-text-muted relative">{workingEq} машин в работе</p>
        </div>

        <div 
          onClick={() => setActiveModal('ppm')}
          className="bg-surface-app border border-border-app rounded-2xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:border-accent-yellow/50 transition-colors"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-yellow/5 rounded-full group-hover:scale-110 transition-transform pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-3 bg-accent-yellow/10 rounded-xl">
              <Wrench className="w-6 h-6 text-accent-yellow" />
            </div>
            <span className="text-[10px] font-bold bg-bg-app border border-border-app px-2 py-1 rounded-full text-text-muted uppercase tracking-tighter">В ремонте</span>
          </div>
          <h3 className="text-3xl font-bold text-text-main mb-1 relative">{activePPMs}</h3>
          <p className="text-sm text-text-muted relative">Активных ППР</p>
        </div>

        <div 
          onClick={() => setActiveModal('accident')}
          className="bg-surface-app border border-border-app rounded-2xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:border-accent-red/50 transition-colors"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-red/5 rounded-full group-hover:scale-110 transition-transform pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-3 bg-accent-red/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-accent-red" />
            </div>
            <span className="text-[10px] font-bold bg-bg-app border border-border-app px-2 py-1 rounded-full text-text-muted uppercase tracking-tighter">Остановлено</span>
          </div>
          <h3 className="text-3xl font-bold text-text-main mb-1 relative">{activeAccidents}</h3>
          <p className="text-sm text-text-muted relative">Аварийных простоев</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left Column: Charts */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Equipment Status Chart */}
          <div className="bg-surface-app border border-border-app rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-bold text-text-main mb-6">Статус парка машин</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <DonutChart working={workingEq} ppm={ppmEq} broken={brokenEq} />
            </div>
            
            <div className="mt-8 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-text-muted font-medium">В работе</span>
                </div>
                <span className="font-bold text-text-main">{workingEq}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-accent-yellow"></span>
                  <span className="text-text-muted font-medium">Плановый ремонт</span>
                </div>
                <span className="font-bold text-text-main">{ppmEq}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-accent-red"></span>
                  <span className="text-text-muted font-medium">Авария</span>
                </div>
                <span className="font-bold text-text-main">{brokenEq}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Feed and Lists */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Tickets Feed */}
          <div className="bg-surface-app border border-border-app rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-text-main">Последние тикеты</h3>
              <Link to="/tickets" className="text-sm text-primary hover:text-primary-dark font-bold flex items-center gap-1 transition-colors">
                Все тикеты <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentTickets.length > 0 ? recentTickets.map(ticket => (
                <Link 
                  key={ticket.id} 
                  to="/tickets"
                  className="block bg-bg-app border border-border-app rounded-xl p-4 hover:border-primary/50 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${ticket.type === 'accident' ? 'bg-accent-red/10' : 'bg-accent-yellow/10'}`}>
                        {ticket.type === 'accident' ? <AlertTriangle className="w-5 h-5 text-accent-red" /> : <Wrench className="w-5 h-5 text-accent-yellow" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main group-hover:text-primary transition-colors">{getEquipmentName(ticket.equipmentId)}</h4>
                        <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                          <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${ticket.type === 'accident' ? 'text-accent-red bg-accent-red/5' : 'text-accent-yellow bg-accent-yellow/5'}`}>
                            {ticket.type === 'accident' ? 'Авария' : 'ППР'}
                          </span>
                          <span className="flex items-center gap-1 font-medium"><Clock className="w-3 h-3"/> {format(new Date(ticket.createdAt), 'dd MMM HH:mm', { locale: ru })}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-lg border font-bold ${
                      ticket.status === 'completed' ? 'border-green-500/20 text-green-600 bg-green-500/5' : 'border-border-app bg-surface-app text-text-muted'
                    }`}>
                      {ticket.status === 'completed' ? 'ВЫПОЛНЕНО' : 'В ПРОЦЕССЕ'}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mt-3 pl-[3.25rem] truncate font-medium">{ticket.description}</p>
                </Link>
              )) : (
                <div className="text-center text-text-muted py-8 italic border border-dashed border-border-app rounded-xl">
                  Активных инцидентов нет
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modal for viewing tickets by category */}
      {activeModal && (
        <div className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-app border border-border-app rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border-app flex justify-between items-center bg-bg-app/30">
              <h2 className="font-bold text-lg flex items-center gap-2 text-text-main">
                {activeModal === 'accident' ? <AlertTriangle className="text-accent-red w-5 h-5" /> : <Wrench className="text-accent-yellow w-5 h-5" />}
                {activeModal === 'accident' ? 'Аварийные простои' : 'Плановые ремонты (ППР)'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-text-muted hover:text-text-main p-1 rounded-lg hover:bg-bg-app transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-3 bg-bg-app/10">
              {MOCK_TICKETS
                .filter(t => t.type === activeModal && t.status !== 'completed')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(ticket => (
                  <Link 
                    key={ticket.id} 
                    to="/tickets"
                    className="block bg-surface-app border border-border-app rounded-xl p-4 hover:border-primary/50 transition-all group shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-text-main group-hover:text-primary transition-colors">{getEquipmentName(ticket.equipmentId)}</h4>
                        <div className="text-xs text-text-muted mt-1 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3"/> {format(new Date(ticket.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru })}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-1 bg-bg-app border border-border-app rounded-lg text-text-muted font-bold uppercase tracking-tighter">
                        {ticket.authorName}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted mt-3 font-medium">{ticket.description}</p>
                  </Link>
                ))}
              
              {MOCK_TICKETS.filter(t => t.type === activeModal && t.status !== 'completed').length === 0 && (
                <div className="text-center text-text-muted py-8 italic border border-dashed border-border-app rounded-xl">
                  Нет активных заявок в данной категории
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
