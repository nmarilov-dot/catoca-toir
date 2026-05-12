import React, { useState } from 'react';
import { MOCK_MATERIALS, MOCK_EQUIPMENT } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { Package, Plus, X, Filter, CheckCircle2, Clock, Truck, Box, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const STATUS_MAP = {
  new: { label: 'Новая', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30', icon: Box },
  processing: { label: 'В обработке', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: Clock },
  ordered: { label: 'Заказано', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: Truck },
  in_stock: { label: 'На складе', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle2 },
  issued: { label: 'Выдано', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30', icon: CheckCircle2 },
};
const URGENCY_MAP = {
  planned: { label: 'Планово', color: 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20' },
  critical: { label: 'Критично', color: 'text-accent-red bg-accent-red/10 border-accent-red/20' },
};

const MaterialRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState(MOCK_MATERIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({ itemName: '', quantity: '', unit: 'шт', urgency: 'planned', equipmentId: '', comment: '' });

  const getEquipmentPath = (id) => { const path = []; let cur = MOCK_EQUIPMENT.find(e => e.id === id); while (cur && cur.parentId) { cur = MOCK_EQUIPMENT.find(e => e.id === cur.parentId); if (cur) path.unshift(cur.name); } return path.length > 0 ? path.join(' > ') + ' > ' : ''; };
  const getEquipmentName = (id) => MOCK_EQUIPMENT.find(e => e.id === id)?.name || 'Неизвестно';
  const equipmentOptions = MOCK_EQUIPMENT.filter(e => e.isEquipment).map(e => ({ id: e.id, fullName: `${getEquipmentPath(e.id)}${e.name}` }));

  const handleCreateRequest = (e) => {
    e.preventDefault();
    setRequests([{ id: `m-${Date.now()}`, itemName: formData.itemName, quantity: Number(formData.quantity), unit: formData.unit, urgency: formData.urgency, equipmentId: formData.equipmentId, ticketId: null, authorName: user.name, status: 'new', createdAt: new Date().toISOString(), comment: formData.comment }, ...requests]);
    setIsModalOpen(false);
    setFormData({ itemName: '', quantity: '', unit: 'шт', urgency: 'planned', equipmentId: '', comment: '' });
  };
  const handleChangeStatus = (reqId, newStatus) => setRequests(requests.map(r => r.id === reqId ? { ...r, status: newStatus } : r));
  const filteredRequests = filterStatus === 'all' ? requests : requests.filter(r => r.status === filterStatus);

  return (
    <div className="p-4 md:p-8 h-full flex flex-col overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div><h1 className="text-2xl font-bold text-white flex items-center gap-3"><Package className="text-primary w-6 h-6" />Заявки ТМЦ</h1><p className="text-text-muted text-sm mt-1">Заказ материалов и запчастей</p></div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48"><Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full bg-dark-surface border border-dark-border rounded-xl py-2 pl-9 pr-3 text-sm focus:ring-1 focus:ring-primary outline-none text-white appearance-none">
              <option value="all">Все статусы</option><option value="new">Новая</option><option value="processing">В обработке</option><option value="ordered">Заказано</option><option value="in_stock">На складе</option>
            </select>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors whitespace-nowrap"><Plus className="w-5 h-5" /><span className="hidden sm:inline">Создать заявку</span></button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-10">
        {filteredRequests.map(req => { const StatusIcon = STATUS_MAP[req.status].icon; return (
          <div key={req.id} className="bg-dark-surface border border-dark-border rounded-2xl p-5 shadow-sm flex flex-col hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${STATUS_MAP[req.status].color}`}><StatusIcon className="w-3.5 h-3.5" />{STATUS_MAP[req.status].label}</div>
              <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${URGENCY_MAP[req.urgency].color}`}>{URGENCY_MAP[req.urgency].label}</div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{req.itemName}</h3>
            <div className="text-2xl font-black text-primary mb-4">{req.quantity} <span className="text-sm font-medium text-text-muted">{req.unit}</span></div>
            <div className="space-y-2 mb-4 flex-1">
              <div className="flex justify-between text-sm"><span className="text-text-muted">Оборудование:</span><span className="text-white text-right font-medium max-w-[60%] truncate">{getEquipmentName(req.equipmentId)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Автор:</span><span className="text-gray-300">{req.authorName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Дата:</span><span className="text-gray-300">{format(new Date(req.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru })}</span></div>
              {req.comment && <div className="mt-3 p-3 bg-dark-bg rounded-xl border border-dark-border text-sm text-gray-400"><span className="block text-xs text-text-muted mb-1">Комментарий:</span>{req.comment}</div>}
            </div>
            {(user?.role === 'admin' || user?.role === 'dispatcher') && (
              <div className="pt-4 border-t border-dark-border mt-auto">
                <label className="text-xs text-text-muted block mb-2">Изменить статус</label>
                <div className="relative"><select value={req.status} onChange={(e) => handleChangeStatus(req.id, e.target.value)} className={`w-full appearance-none rounded-xl py-2 px-3 text-sm font-medium outline-none cursor-pointer border ${STATUS_MAP[req.status].color}`}>
                  <option value="new">Новая</option><option value="processing">В обработке</option><option value="ordered">Заказано</option><option value="in_stock">На складе</option><option value="issued">Выдано</option>
                </select><ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" /></div>
              </div>
            )}
          </div>); })}
        {filteredRequests.length === 0 && <div className="col-span-full py-12 flex flex-col items-center justify-center text-text-muted border border-dashed border-dark-border rounded-2xl bg-dark-surface/50"><Package className="w-12 h-12 mb-3 opacity-20" /><p>Заявки не найдены</p></div>}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
            <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark-bg/50"><h2 className="font-bold text-lg text-white">Новая заявка ТМЦ</h2><button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white"><X className="w-6 h-6" /></button></div>
            <form onSubmit={handleCreateRequest} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <div className="space-y-1"><label className="text-sm font-medium text-text-muted">Наименование *</label><input type="text" required value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none text-white" placeholder="Ремень клиновой B-1250" /></div>
              <div className="flex gap-4">
                <div className="space-y-1 flex-1"><label className="text-sm font-medium text-text-muted">Количество *</label><input type="number" min="0.1" step="0.1" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm outline-none text-white" /></div>
                <div className="space-y-1 w-1/3"><label className="text-sm font-medium text-text-muted">Ед. изм.</label><select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm outline-none text-white"><option value="шт">шт</option><option value="м">м</option><option value="кг">кг</option><option value="л">л</option><option value="компл">компл</option></select></div>
              </div>
              <div className="space-y-1"><label className="text-sm font-medium text-text-muted">Срочность</label><select value={formData.urgency} onChange={(e) => setFormData({...formData, urgency: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm outline-none text-white"><option value="planned">Планово</option><option value="critical">Критично</option></select></div>
              <div className="space-y-1"><label className="text-sm font-medium text-text-muted">Оборудование *</label><select required value={formData.equipmentId} onChange={(e) => setFormData({...formData, equipmentId: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm outline-none text-white"><option value="" disabled>Выберите...</option>{equipmentOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.fullName}</option>)}</select></div>
              <div className="space-y-1"><label className="text-sm font-medium text-text-muted">Комментарий</label><textarea value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} rows={3} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm outline-none text-white resize-none" placeholder="Каталожный номер..." /></div>
            </form>
            <div className="p-4 border-t border-dark-border bg-dark-bg/50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-dark-surface border border-dark-border text-white rounded-xl font-medium hover:bg-dark-surface-light" type="button">Отмена</button>
              <button onClick={handleCreateRequest} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark">Создать заявку</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequests;
