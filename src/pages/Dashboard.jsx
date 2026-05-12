import React, { useState } from 'react';
import { MOCK_EQUIPMENT, MOCK_TICKETS } from '../api/mockData';
import { Activity, AlertTriangle, CheckCircle, Clock, ChevronRight, Settings2, Wrench, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const DonutChart = ({ working, ppm, broken }) => {
  const total = working + ppm + broken;
  if (!total) return null;
  const wPct = (working / total) * 100, pPct = (ppm / total) * 100, bPct = (broken / total) * 100;
  const r = 15.91549430918954;
  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90 filter drop-shadow-lg">
        <circle cx="21" cy="21" r={r} fill="transparent" stroke="#1e293b" strokeWidth="6" />
        {working > 0 && <circle cx="21" cy="21" r={r} fill="transparent" stroke="#22c55e" strokeWidth="6" strokeDasharray={`${wPct} ${100 - wPct}`} strokeDashoffset="0" className="transition-all duration-1000" />}
        {ppm > 0 && <circle cx="21" cy="21" r={r} fill="transparent" stroke="#eab308" strokeWidth="6" strokeDasharray={`${pPct} ${100 - pPct}`} strokeDashoffset={`-${wPct}`} className="transition-all duration-1000" />}
        {broken > 0 && <circle cx="21" cy="21" r={r} fill="transparent" stroke="#ef4444" strokeWidth="6" strokeDasharray={`${bPct} ${100 - bPct}`} strokeDashoffset={`-${wPct + pPct}`} className="transition-all duration-1000" />}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-white">{Math.round(wPct)}%</span>
        <span className="text-xs text-text-muted">В работе</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const equipment = MOCK_EQUIPMENT.filter(e => e.isEquipment);
  const totalEq = equipment.length, workingEq = equipment.filter(e => e.status === 'working').length;
  const ppmEq = equipment.filter(e => e.status === 'ppm').length, brokenEq = equipment.filter(e => e.status === 'not_working').length;
  const workingPercent = totalEq ? Math.round((workingEq / totalEq) * 100) : 0;
  const activeAccidents = MOCK_TICKETS.filter(t => t.type === 'accident' && t.status !== 'completed').length;
  const activePPMs = MOCK_TICKETS.filter(t => t.type === 'ppm' && t.status !== 'completed').length;
  const recentTickets = [...MOCK_TICKETS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const getEquipmentName = (id) => MOCK_EQUIPMENT.find(e => e.id === id)?.name || 'Неизвестно';

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"><Activity className="text-primary w-8 h-8" />Сводка по предприятию</h1>
        <p className="text-text-muted mt-2">Оперативная картина состояния оборудования и заявок</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative"><div className="p-3 bg-primary/20 rounded-xl"><Settings2 className="w-6 h-6 text-primary" /></div><span className="text-xs font-bold bg-dark-bg px-2 py-1 rounded-full text-text-muted">Всего</span></div>
          <h3 className="text-3xl font-bold text-white mb-1 relative">{totalEq}</h3><p className="text-sm text-text-muted relative">Единиц оборудования</p>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative"><div className="p-3 bg-green-500/20 rounded-xl"><CheckCircle className="w-6 h-6 text-green-400" /></div><span className="text-xs font-bold bg-dark-bg px-2 py-1 rounded-full text-text-muted">Исправно</span></div>
          <h3 className="text-3xl font-bold text-white mb-1 relative">{workingPercent}%</h3><p className="text-sm text-text-muted relative">{workingEq} машин в работе</p>
        </div>
        <div onClick={() => setActiveModal('ppm')} className="bg-dark-surface border border-dark-border rounded-2xl p-5 shadow-lg relative overflow-hidden group cursor-pointer hover:border-accent-yellow/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-yellow/10 rounded-full group-hover:scale-110 transition-transform pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative"><div className="p-3 bg-accent-yellow/20 rounded-xl"><Wrench className="w-6 h-6 text-accent-yellow" /></div><span className="text-xs font-bold bg-dark-bg px-2 py-1 rounded-full text-text-muted">В ремонте</span></div>
          <h3 className="text-3xl font-bold text-white mb-1 relative">{activePPMs}</h3><p className="text-sm text-text-muted relative">Активных ППР</p>
        </div>
        <div onClick={() => setActiveModal('accident')} className="bg-dark-surface border border-dark-border rounded-2xl p-5 shadow-lg relative overflow-hidden group cursor-pointer hover:border-accent-red/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-red/10 rounded-full group-hover:scale-110 transition-transform pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative"><div className="p-3 bg-accent-red/20 rounded-xl"><AlertTriangle className="w-6 h-6 text-accent-red" /></div><span className="text-xs font-bold bg-dark-bg px-2 py-1 rounded-full text-text-muted">Остановлено</span></div>
          <h3 className="text-3xl font-bold text-white mb-1 relative">{activeAccidents}</h3><p className="text-sm text-text-muted relative">Аварийных простоев</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-lg flex flex-col h-full">
            <h3 className="text-lg font-bold text-white mb-6">Статус парка машин</h3>
            <div className="flex-1 flex items-center justify-center"><DonutChart working={workingEq} ppm={ppmEq} broken={brokenEq} /></div>
            <div className="mt-8 space-y-3">
              {[{ label: 'В работе', color: 'bg-green-500', value: workingEq }, { label: 'Плановый ремонт', color: 'bg-accent-yellow', value: ppmEq }, { label: 'Авария', color: 'bg-accent-red', value: brokenEq }]
                .map(({ label, color, value }) => (
                  <div key={label} className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${color}`}></span><span className="text-gray-300">{label}</span></div><span className="font-bold text-white">{value}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Последние тикеты</h3>
              <Link to="/tickets" className="text-sm text-primary hover:text-primary-light flex items-center gap-1 transition-colors">Все тикеты <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="space-y-4">
              {recentTickets.length > 0 ? recentTickets.map(ticket => (
                <Link key={ticket.id} to="/tickets" className="block bg-dark-bg border border-dark-border rounded-xl p-4 hover:border-primary/50 transition-colors group">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${ticket.type === 'accident' ? 'bg-accent-red/20' : 'bg-accent-yellow/20'}`}>{ticket.type === 'accident' ? <AlertTriangle className="w-5 h-5 text-accent-red" /> : <Wrench className="w-5 h-5 text-accent-yellow" />}</div>
                      <div><h4 className="font-bold text-white group-hover:text-primary transition-colors">{getEquipmentName(ticket.equipmentId)}</h4>
                        <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                          <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${ticket.type === 'accident' ? 'text-accent-red bg-accent-red/10' : 'text-accent-yellow bg-accent-yellow/10'}`}>{ticket.type === 'accident' ? 'Авария' : 'ППР'}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(ticket.createdAt), 'dd MMM HH:mm', { locale: ru })}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-xl border ${ticket.status === 'completed' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-dark-border bg-dark-bg text-text-muted'}`}>{ticket.status === 'completed' ? 'ВЫПОЛНЕНО' : 'В ПРОЦЕССЕ'}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-3 pl-[3.25rem] truncate">{ticket.description}</p>
                </Link>
              )) : <div className="text-center text-text-muted py-8 italic border border-dashed border-dark-border rounded-xl">Активных инцидентов нет</div>}
            </div>
          </div>
        </div>
      </div>
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
              <h2 className="font-bold text-lg flex items-center gap-2 text-white">{activeModal === 'accident' ? <AlertTriangle className="text-accent-red w-5 h-5" /> : <Wrench className="text-accent-yellow w-5 h-5" />}{activeModal === 'accident' ? 'Аварийные простои' : 'Плановые ремонты (ППР)'}</h2>
              <button onClick={() => setActiveModal(null)} className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-dark-bg transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-3">
              {MOCK_TICKETS.filter(t => t.type === activeModal && t.status !== 'completed').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(ticket => (
                <Link key={ticket.id} to="/tickets" className="block bg-dark-bg border border-dark-border rounded-xl p-4 hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-2"><div><h4 className="font-bold text-white group-hover:text-primary transition-colors">{getEquipmentName(ticket.equipmentId)}</h4><div className="text-xs text-text-muted mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(ticket.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru })}</div></div><span className="text-xs px-2 py-1 bg-dark-surface border border-dark-border rounded-lg text-text-muted">{ticket.authorName}</span></div>
                  <p className="text-sm text-gray-300 mt-3">{ticket.description}</p>
                </Link>
              ))}
              {MOCK_TICKETS.filter(t => t.type === activeModal && t.status !== 'completed').length === 0 && <div className="text-center text-text-muted py-8 italic border border-dashed border-dark-border rounded-xl">Нет активных заявок</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
