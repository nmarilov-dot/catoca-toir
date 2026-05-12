import React, { useState, useEffect } from 'react';
import { MOCK_DOWNTIME_LOG } from '../api/mockData';
import { Calendar, BarChart2, TrendingDown, Clock, AlertTriangle } from 'lucide-react';
import { format, startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear } from 'date-fns';
import { ru } from 'date-fns/locale';

const filterByRange = (logs, start, end) => logs.filter(l => new Date(l.startTime) >= start && new Date(l.startTime) <= end);
const COLORS = { 'Механики': '#2a3b8c', 'Электрики': '#f59e0b', 'Автоматики': '#8b5cf6' };

const Reports = () => {
  const [period, setPeriod] = useState('month');
  const [range, setRange] = useState({ start: new Date(), end: new Date() });
  const [stats, setStats] = useState({ downtime: 0, incidents: 0, byService: {}, logs: [] });

  useEffect(() => {
    const now = new Date();
    let start, end;
    if (period === 'week') { start = startOfWeek(now, { weekStartsOn: 1 }); end = endOfWeek(now, { weekStartsOn: 1 }); }
    else if (period === 'month') { start = startOfMonth(now); end = endOfMonth(now); }
    else { start = startOfYear(now); end = endOfYear(now); }
    setRange({ start, end });
  }, [period]);

  useEffect(() => {
    const logs = filterByRange(MOCK_DOWNTIME_LOG, range.start, range.end);
    const downtime = logs.reduce((sum, l) => sum + (l.hours || 0), 0);
    const byService = logs.reduce((acc, l) => { const s = l.service || 'Неизвестно'; acc[s] = (acc[s] || 0) + (l.hours || 0); return acc; }, {});
    setStats({ downtime, incidents: logs.length, byService, logs });
  }, [range]);

  const chartData = Object.entries(stats.byService).sort((a, b) => b[1] - a[1]);
  const maxHours = Math.max(...chartData.map(d => d[1]), 1);

  return (
    <div className="p-4 md:p-8 overflow-y-auto min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><BarChart2 className="text-primary w-6 h-6" />Отчёты по простоям</h1>
          <p className="text-text-muted text-sm mt-1">Аналитика простоев по службам</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-text-muted" />
          <select value={period} onChange={e => setPeriod(e.target.value)} className="bg-dark-surface text-text-main rounded-xl px-3 py-2 border border-dark-border outline-none text-sm">
            <option value="week">Текущая неделя</option>
            <option value="month">Текущий месяц</option>
            <option value="year">Текущий год</option>
          </select>
          <span className="text-xs text-text-muted">{format(range.start, 'dd MMM', { locale: ru })} — {format(range.end, 'dd MMM yyyy', { locale: ru })}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[{ label: 'Общий простой', value: `${stats.downtime.toFixed(1)} ч`, icon: TrendingDown, color: 'bg-primary/20 text-primary' },
          { label: 'Инцидентов', value: stats.incidents, icon: AlertTriangle, color: 'bg-accent-red/20 text-accent-red' },
          { label: 'Среднее время', value: `${stats.incidents ? (stats.downtime / stats.incidents).toFixed(1) : 0} ч`, icon: Clock, color: 'bg-accent-yellow/20 text-accent-yellow' }]
          .map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-dark-surface p-5 rounded-2xl border border-dark-border">
            <div className="flex items-center gap-2 mb-2"><div className={`p-2 rounded-lg ${color}`}><Icon className="w-4 h-4" /></div><p className="text-xs text-text-muted uppercase tracking-wider">{label}</p></div>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="bg-dark-surface p-6 rounded-2xl border border-dark-border mb-6">
        <h2 className="font-bold text-white mb-6">Простои по службам</h2>
        {chartData.length > 0 ? (
          <div className="space-y-4">
            {chartData.map(([service, hours]) => (
              <div key={service}>
                <div className="flex justify-between mb-1"><span className="text-sm font-medium">{service}</span><span className="text-sm font-bold" style={{ color: COLORS[service] || '#6b7280' }}>{hours.toFixed(1)} ч</span></div>
                <div className="h-3 bg-dark-bg rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${(hours / maxHours) * 100}%`, backgroundColor: COLORS[service] || '#6b7280' }} /></div>
              </div>
            ))}
          </div>
        ) : <p className="text-center text-text-muted py-8">Нет данных за выбранный период</p>}
      </div>
      {stats.logs.length > 0 && (
        <div className="bg-dark-surface rounded-2xl border border-dark-border overflow-hidden">
          <div className="p-4 border-b border-dark-border"><h2 className="font-bold text-white">Журнал инцидентов</h2></div>
          <div className="divide-y divide-dark-border">
            {stats.logs.map(log => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-2 hover:bg-dark-bg/50">
                <div className="flex-1"><p className="text-sm font-medium">{log.reason}</p><p className="text-xs text-text-muted mt-1">{format(new Date(log.startTime), 'dd MMM yyyy, HH:mm', { locale: ru })}</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-lg border border-dark-border text-text-muted">{log.service}</span>
                  <span className="text-sm font-bold text-primary">{log.hours ? `${log.hours} ч` : 'В процессе'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Reports;
