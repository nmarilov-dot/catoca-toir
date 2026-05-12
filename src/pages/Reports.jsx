import React, { useState, useEffect } from 'react';
import { MOCK_DOWNTIME_LOG, MOCK_TICKETS } from '../api/mockData';
import { Calendar, BarChart2 } from 'lucide-react';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear } from 'date-fns';
import { safeParseISO } from '../utils/helpers';

// Helper to filter logs by date range
const filterByRange = (logs, start, end) =>
  logs.filter(l => {
    const logDate = safeParseISO(l.startTime);
    return logDate >= start && logDate <= end;
  });

const Reports = () => {
  const [period, setPeriod] = useState('week'); // week | month | year
  const [range, setRange] = useState({ start: new Date(), end: new Date() });
  const [stats, setStats] = useState({ downtime: 0, incidents: 0, byService: {} });

  // Compute date range based on selected period
  useEffect(() => {
    const now = new Date();
    let start, end;
    if (period === 'week') {
      start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      end = endOfWeek(now, { weekStartsOn: 1 });
    } else if (period === 'month') {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else {
      start = startOfYear(now);
      end = endOfYear(now);
    }
    setRange({ start, end });
  }, [period]);

  // Recalculate stats when range changes
  useEffect(() => {
    const logs = filterByRange(MOCK_DOWNTIME_LOG, range.start, range.end);
    const downtime = logs.reduce((sum, l) => sum + (l.hours || 0), 0);
    const incidents = logs.length;
    const byService = logs.reduce((acc, l) => {
      const svc = l.service || 'Неизвестно';
      acc[svc] = (acc[svc] || 0) + (l.hours || 0);
      return acc;
    }, {});
    setStats({ downtime, incidents, byService });
  }, [range]);

  // Simple bar chart data (service => hours)
  const chartData = Object.entries(stats.byService).map(([service, hours]) => ({ service, hours }));
  const maxHours = Math.max(...chartData.map(d => d.hours), 1);

  return (
    <div className="p-6 space-y-6 bg-bg-app min-h-screen text-text-main">
      <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
        <BarChart2 className="w-6 h-6" />Отчёты по простоям
      </h1>

      {/* Period selector */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-text-muted">
          <Calendar className="w-4 h-4" /> Период:
        </label>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="bg-surface-app text-text-main rounded-md px-3 py-1 border border-border-app focus:outline-none"
        >
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
          <option value="year">Год</option>
        </select>
        <span className="text-sm text-text-muted">
          {format(range.start, 'dd MMM yyyy')} — {format(range.end, 'dd MMM yyyy')}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-app p-4 rounded-xl border border-border-app shadow-sm">
          <p className="text-xs text-text-muted">Общее время простоя</p>
          <p className="text-2xl font-bold text-primary">{stats.downtime.toFixed(1)} ч</p>
        </div>
        <div className="bg-surface-app p-4 rounded-xl border border-border-app shadow-sm">
          <p className="text-xs text-text-muted">Количество инцидентов</p>
          <p className="text-2xl font-bold text-primary">{stats.incidents}</p>
        </div>
        <div className="bg-surface-app p-4 rounded-xl border border-border-app shadow-sm">
          <p className="text-xs text-text-muted">Среднее время простоя</p>
          <p className="text-2xl font-bold text-primary">
            {stats.incidents ? (stats.downtime / stats.incidents).toFixed(1) : 0} ч
          </p>
        </div>
      </div>

      {/* Bar chart per service */}
      <div className="bg-surface-app p-4 rounded-xl border border-border-app shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-text-main">Простои по службам</h2>
        <div className="flex flex-col gap-3">
          {chartData.map(d => (
            <div key={d.service} className="flex items-center gap-2">
              <span className="w-24 text-sm text-text-muted">{d.service}</span>
              <div className="flex-1 h-6 bg-primary/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(d.hours / maxHours) * 100}%` }}
                />
              </div>
              <span className="w-12 text-sm text-primary font-medium">{d.hours.toFixed(1)}ч</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
