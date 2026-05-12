import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { MOCK_TICKETS, MOCK_EQUIPMENT } from '../api/mockData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Wrench, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';

const MaintenanceCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTicket, setActiveTicket] = useState(null);

  // Get all PPM tickets
  const ppmTickets = MOCK_TICKETS.filter(t => t.type === 'ppm');

  const getEquipmentName = (id) => MOCK_EQUIPMENT.find(e => e.id === id)?.name || 'Неизвестно';

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-xl">
            <CalendarIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">График ППР</h1>
            <p className="text-text-muted text-sm capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-dark-surface border border-dark-border rounded-xl p-1">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-dark-bg rounded-lg transition-colors text-text-muted hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-xs font-medium hover:bg-dark-bg rounded-lg transition-colors text-text-muted hover:text-white"
          >
            Сегодня
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-dark-bg rounded-lg transition-colors text-text-muted hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day, i) => (
          <div key={i} className="text-center text-xs font-bold text-text-muted uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="grid grid-cols-7 gap-px bg-dark-border border border-dark-border rounded-2xl overflow-hidden shadow-2xl">
        {calendarDays.map((day, i) => {
          const dayTickets = ppmTickets.filter(t => isSameDay(parseISO(t.createdAt), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={i}
              className={`min-h-[120px] bg-dark-surface p-2 transition-colors relative group cursor-pointer
                ${!isCurrentMonth ? 'opacity-30 bg-dark-bg/50' : 'hover:bg-dark-surface-light'}
                ${isSelected ? 'ring-2 ring-primary ring-inset z-10' : ''}
              `}
              onClick={() => setSelectedDate(day)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-bold rounded-lg w-7 h-7 flex items-center justify-center
                  ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-text-muted'}
                `}>
                  {format(day, 'd')}
                </span>
                {dayTickets.length > 0 && (
                  <span className="text-[10px] bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30 px-1.5 py-0.5 rounded-md font-bold">
                    {dayTickets.length} ППР
                  </span>
                )}
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar-thin">
                {dayTickets.map(ticket => (
                  <div 
                    key={ticket.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTicket(ticket);
                    }}
                    className={`text-[10px] p-1.5 rounded-md border truncate transition-all
                      ${ticket.status === 'completed' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400 opacity-60' 
                        : 'bg-accent-yellow/10 border-accent-yellow/30 text-accent-yellow hover:scale-[1.02]'
                      }
                    `}
                  >
                    <span className="font-bold">{getEquipmentName(ticket.equipmentId)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar bg-dark-bg">
      {renderHeader()}
      
      <div className="bg-dark-surface border border-dark-border rounded-3xl p-4 md:p-6 shadow-xl">
        {renderDays()}
        {renderCells()}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> План на {format(selectedDate, 'd MMMM', { locale: ru })}
          </h3>
          <div className="space-y-3">
            {ppmTickets.filter(t => isSameDay(parseISO(t.createdAt), selectedDate)).length > 0 ? (
              ppmTickets.filter(t => isSameDay(parseISO(t.createdAt), selectedDate)).map(ticket => (
                <div 
                  key={ticket.id}
                  className="bg-dark-bg border border-dark-border rounded-xl p-4 flex justify-between items-center group hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => setActiveTicket(ticket)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${ticket.status === 'completed' ? 'bg-green-500/20' : 'bg-accent-yellow/20'}`}>
                      <Wrench className={`w-5 h-5 ${ticket.status === 'completed' ? 'text-green-400' : 'text-accent-yellow'}`} />
                    </div>
                    <div>
                      <p className="text-white font-bold group-hover:text-primary transition-colors">
                        {getEquipmentName(ticket.equipmentId)}
                      </p>
                      <p className="text-xs text-text-muted mt-1">{ticket.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-dark-border group-hover:text-primary transition-colors" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 border border-dashed border-dark-border rounded-xl text-text-muted italic">
                На выбранную дату работ не запланировано
              </div>
            )}
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" /> Статус выполнения (Месяц)
          </h3>
          <div className="space-y-4">
            {(() => {
              const monthTickets = ppmTickets.filter(t => isSameMonth(parseISO(t.createdAt), currentMonth));
              const completed = monthTickets.filter(t => t.status === 'completed').length;
              const total = monthTickets.length;
              const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-3xl font-bold text-white">{completed}</span>
                      <span className="text-text-muted text-sm ml-2">из {total} выполнено</span>
                    </div>
                    <span className="text-primary font-black text-xl">{percent}%</span>
                  </div>
                  <div className="w-full h-3 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                    <div 
                      className="h-full bg-primary shadow-[0_0_10px_rgba(134,59,255,0.5)] transition-all duration-1000"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-dark-bg p-3 rounded-xl border border-dark-border">
                      <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">В процессе</p>
                      <p className="text-xl font-bold text-accent-yellow">{total - completed}</p>
                    </div>
                    <div className="bg-dark-bg p-3 rounded-xl border border-dark-border">
                      <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Критично</p>
                      <p className="text-xl font-bold text-accent-red">2</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {activeTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
              <div className="flex items-center gap-3">
                <Wrench className="w-6 h-6 text-accent-yellow" />
                <h2 className="text-xl font-bold text-white">Детали ППР</h2>
              </div>
              <button 
                onClick={() => setActiveTicket(null)}
                className="p-2 hover:bg-dark-bg rounded-xl transition-colors text-text-muted hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-xs text-text-muted uppercase font-bold tracking-widest block mb-2">Оборудование</label>
                <div className="text-2xl font-bold text-white">{getEquipmentName(activeTicket.equipmentId)}</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-text-muted uppercase font-bold tracking-widest block mb-2">Дата создания</label>
                  <div className="text-text-main flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    {format(parseISO(activeTicket.createdAt), 'dd MMMM yyyy', { locale: ru })}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase font-bold tracking-widest block mb-2">Статус</label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border
                    ${activeTicket.status === 'completed' 
                      ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                      : 'bg-accent-yellow/10 border-accent-yellow/30 text-accent-yellow'
                    }
                  `}>
                    {activeTicket.status === 'completed' ? 'ВЫПОЛНЕНО' : 'В ПРОЦЕССЕ'}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase font-bold tracking-widest block mb-2">Описание работ</label>
                <div className="bg-dark-bg p-4 rounded-xl border border-dark-border text-gray-300 leading-relaxed">
                  {activeTicket.description}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  className="flex-1 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  onClick={() => setActiveTicket(null)}
                >
                  Перейти к тикету
                </button>
                <button 
                  className="px-6 py-4 bg-dark-bg border border-dark-border text-white rounded-2xl font-bold hover:bg-dark-surface-light transition-all"
                  onClick={() => setActiveTicket(null)}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceCalendar;
