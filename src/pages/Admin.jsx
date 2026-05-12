import React from 'react';
import { 
  Settings, 
  Users, 
  Database, 
  ShieldCheck, 
  Activity, 
  Save 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();

  const sections = [
    {
      title: 'Управление доступом',
      icon: ShieldCheck,
      description: 'Настройка прав ролей и доступ к модулям системы.',
      action: 'Настроить роли'
    },
    {
      title: 'Пользователи',
      icon: Users,
      description: 'Редактирование профилей сотрудников, сброс паролей.',
      action: 'Список пользователей'
    },
    {
      title: 'Системные данные',
      icon: Database,
      description: 'Импорт/Экспорт справочников оборудования и ТМЦ.',
      action: 'Управление данными'
    }
  ];

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar bg-dark-bg">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="text-primary w-8 h-8" />
          Настройки системы
        </h1>
        <p className="text-text-muted mt-2">Панель администратора для управления проектом</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Settings Cards */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-lg hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{section.title}</h3>
                    <p className="text-sm text-text-muted mt-1 mb-4">{section.description}</p>
                    <button className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest">
                      {section.action} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Health / Status */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Статус системы
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-muted">Загрузка базы данных</span>
                <span className="text-white font-bold">12%</span>
              </div>
              <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[12%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-dark-bg p-4 rounded-xl border border-dark-border">
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter mb-1">Версия ПО</p>
                <p className="text-lg font-bold text-white">v0.1.2-stable</p>
              </div>
              <div className="bg-dark-bg p-4 rounded-xl border border-dark-border">
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter mb-1">Время работы</p>
                <p className="text-lg font-bold text-white">99.9%</p>
              </div>
            </div>

            <div className="pt-6 border-t border-dark-border">
              <label className="block text-sm font-medium text-text-muted mb-3">Техническое уведомление для всех</label>
              <textarea 
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none resize-none"
                placeholder="Текст уведомления появится в шапке у всех пользователей..."
                rows={3}
              />
              <button className="mt-4 w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                <Save className="w-4 h-4" />
                Сохранить и отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
