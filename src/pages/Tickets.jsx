import React, { useState, useEffect } from 'react';
import { MOCK_TICKETS, MOCK_EQUIPMENT } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, MessageSquare, Camera, Plus, X, Save, Send, WifiOff, User as UserIcon, ChevronRight, ChevronDown, Cpu, FolderOpen, Folder } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const buildTree = (items, parentId = null) => items.filter(item => item.parentId === parentId).map(item => ({ ...item, children: buildTree(items, item.id) }));

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [formData, setFormData] = useState({ equipmentId: '', type: 'accident', description: '' });
  const [isSelectingEq, setIsSelectingEq] = useState(false);
  const [expandedEqNodes, setExpandedEqNodes] = useState(new Set(['f-2', 'f-2-1']));
  const treeData = buildTree(MOCK_EQUIPMENT);

  const toggleEqNode = (nodeId) => {
    const newExpanded = new Set(expandedEqNodes);
    if (newExpanded.has(nodeId)) newExpanded.delete(nodeId); else newExpanded.add(nodeId);
    setExpandedEqNodes(newExpanded);
  };

  useEffect(() => {
    const draft = localStorage.getItem('catoca_ticket_draft');
    if (draft) { setFormData(JSON.parse(draft)); setDraftSaved(true); }
  }, []);

  const handleFormChange = (e) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    localStorage.setItem('catoca_ticket_draft', JSON.stringify(newData));
    setDraftSaved(true);
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const newTicket = { id: `t-${Date.now()}`, equipmentId: formData.equipmentId, author: user.username, authorName: user.name, status: 'not_completed', type: formData.type, description: formData.description, createdAt: new Date().toISOString(), targetDate: new Date(Date.now() + 86400000).toISOString(), comments: [] };
    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
    setFormData({ equipmentId: '', type: 'accident', description: '' });
    localStorage.removeItem('catoca_ticket_draft');
    setDraftSaved(false);
    setIsSelectingEq(false);
  };

  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = (ticketId) => {
    if (!commentText.trim()) return;
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, comments: [...t.comments, { id: `c-${Date.now()}`, authorName: user.name, text: commentText, timestamp: new Date().toISOString() }] } : t));
    setCommentText('');
    setActiveCommentId(null);
  };

  const getEquipmentName = (id) => MOCK_EQUIPMENT.find(e => e.id === id)?.name || 'Неизвестно';

  const EqTreeNode = ({ node, level = 0 }) => {
    const isExpanded = expandedEqNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    return (
      <div className="w-full">
        <div className={`flex items-center gap-2 py-1.5 px-2 my-0.5 cursor-pointer transition-all rounded-lg select-none ${node.isEquipment ? 'hover:bg-primary/20 text-gray-300' : 'hover:bg-dark-surface-light font-medium text-white'}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => { if (hasChildren || !node.isEquipment) toggleEqNode(node.id); if (node.isEquipment) { handleFormChange({ target: { name: 'equipmentId', value: node.id } }); setIsSelectingEq(false); } }}>
          <div className="w-4 shrink-0 flex justify-center">{hasChildren ? (isExpanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-text-muted" />) : null}</div>
          {node.isEquipment ? <Cpu className="w-4 h-4 text-text-muted shrink-0" /> : (isExpanded ? <FolderOpen className="w-4 h-4 text-primary shrink-0" /> : <Folder className="w-4 h-4 text-text-muted shrink-0" />)}
          <span className="truncate text-sm">{node.name}</span>
        </div>
        {isExpanded && hasChildren && <div className="flex flex-col w-full border-l border-dark-border/50 ml-[14px]">{node.children.map(child => <EqTreeNode key={child.id} node={child} level={level + 1} />)}</div>}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><AlertTriangle className="text-accent-red w-6 h-6" />Тикеты (Аварии и ППР)</h1>
          <p className="text-text-muted text-sm mt-1">Отчеты о поломках и плановые работы</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors">
          <Plus className="w-5 h-5" /><span className="hidden sm:inline">Создать тикет</span>
        </button>
      </div>

      {draftSaved && !isModalOpen && (
        <div className="mb-4 p-3 bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent-yellow text-sm"><Save className="w-4 h-4" />У вас есть несохраненный черновик тикета.</div>
          <button onClick={() => setIsModalOpen(true)} className="text-xs bg-accent-yellow/20 px-3 py-1.5 rounded-lg text-accent-yellow hover:bg-accent-yellow/30 font-medium">Продолжить</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pb-10">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-dark-surface border border-dark-border rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${ticket.type === 'accident' ? 'bg-accent-red/20 text-accent-red' : 'bg-accent-yellow/20 text-accent-yellow'}`}>{ticket.type === 'accident' ? 'Авария' : 'ППР'}</span>
                  <span className="text-xs text-text-muted">{format(new Date(ticket.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru })}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{getEquipmentName(ticket.equipmentId)}</h3>
              </div>
              <span className={`px-3 py-1 rounded-xl border text-sm ${ticket.status === 'completed' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-dark-border bg-dark-bg text-text-muted'}`}>{ticket.status === 'completed' ? 'ВЫПОЛНЕНО' : 'НЕ ВЫПОЛНЕНО'}</span>
            </div>
            <p className="text-text-main mb-6 bg-dark-bg p-4 rounded-xl border border-dark-border">{ticket.description}</p>

            <div className="border-t border-dark-border pt-4">
              <h4 className="text-sm font-medium text-text-muted mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" />История и комментарии</h4>
              <div className="space-y-3 mb-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center shrink-0"><UserIcon className="w-4 h-4 text-text-muted" /></div>
                  <div className="bg-dark-bg p-3 rounded-xl rounded-tl-none border border-dark-border flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-gray-300">{ticket.authorName}</span>
                      <span className="text-xs text-text-muted">{format(new Date(ticket.createdAt), 'HH:mm', { locale: ru })}</span>
                    </div>
                    <p className="text-sm text-text-muted italic">Тикет создан.</p>
                  </div>
                </div>
                {ticket.comments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0"><span className="text-xs font-bold text-primary">{c.authorName.charAt(0)}</span></div>
                    <div className="bg-dark-bg p-3 rounded-xl rounded-tl-none border border-dark-border flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-primary">{c.authorName}</span>
                        <span className="text-xs text-text-muted">{format(new Date(c.timestamp), 'HH:mm', { locale: ru })}</span>
                      </div>
                      <p className="text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              {activeCommentId === ticket.id ? (
                <div className="flex gap-2 items-end">
                  <textarea autoFocus value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Напишите комментарий..." className="flex-1 bg-dark-bg border border-dark-border rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none resize-none h-20" />
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleAddComment(ticket.id)} className="bg-primary hover:bg-primary-dark text-white p-3 rounded-xl transition-colors"><Send className="w-4 h-4" /></button>
                    <button onClick={() => { setActiveCommentId(null); setCommentText(''); }} className="bg-dark-bg hover:bg-dark-surface-light border border-dark-border text-text-muted p-3 rounded-xl transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setActiveCommentId(ticket.id)} className="text-sm text-text-muted hover:text-white flex items-center gap-2 border border-dashed border-dark-border w-full p-3 rounded-xl justify-center hover:bg-dark-bg/50 transition-colors">
                  <Plus className="w-4 h-4" />Добавить комментарий
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
              <h2 className="font-bold text-lg">Создание тикета</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
              {draftSaved && <div className="text-xs flex items-center gap-1 text-text-muted mb-2"><Save className="w-3 h-3" />Черновик сохранен локально</div>}
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted">Тип заявки</label>
                <select name="type" value={formData.type} onChange={handleFormChange} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none text-white">
                  <option value="accident">Авария (поломка)</option>
                  <option value="ppm">Плановый ремонт (ППР)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted">Оборудование</label>
                {isSelectingEq ? (
                  <div className="border border-dark-border rounded-xl p-2 max-h-64 overflow-y-auto bg-dark-bg custom-scrollbar">{treeData.map(node => <EqTreeNode key={node.id} node={node} level={0} />)}</div>
                ) : (
                  <div onClick={() => setIsSelectingEq(true)} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm cursor-pointer hover:border-primary transition-colors flex justify-between items-center">
                    <span className={formData.equipmentId ? 'text-white' : 'text-text-muted'}>{formData.equipmentId ? getEquipmentName(formData.equipmentId) : 'Выберите оборудование...'}</span>
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted">Описание проблемы</label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} required rows={4} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none text-white resize-none" placeholder="Опишите, что произошло..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Фотографии</label>
                <div className="border-2 border-dashed border-dark-border rounded-xl p-6 flex flex-col items-center text-center hover:bg-dark-bg/50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/30"><Camera className="w-6 h-6" /></div>
                  <p className="text-sm text-white font-medium mb-1">Сделать фото или выбрать из галереи</p>
                  <p className="text-xs text-text-muted flex items-center gap-1"><WifiOff className="w-3 h-3" />Сжатие перед отправкой</p>
                </div>
              </div>
            </form>
            <div className="p-4 border-t border-dark-border bg-dark-bg/50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-dark-bg border border-dark-border text-white rounded-xl font-medium hover:bg-dark-surface-light transition-colors" type="button">Отмена</button>
              <button onClick={handleCreateTicket} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">Создать тикет</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
