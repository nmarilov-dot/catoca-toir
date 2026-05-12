import React, { useState } from 'react';
import { MOCK_EQUIPMENT, MOCK_TICKETS } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, ChevronDown, Settings2, Activity, AlertTriangle, Plus, Clock, User as UserIcon, FolderOpen, Folder, Cpu } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const buildTree = (items, parentId = null) => items.filter(item => item.parentId === parentId).map(item => ({ ...item, children: buildTree(items, item.id) }));

const EquipmentBase = () => {
  const { user } = useAuth();
  const [expandedNodes, setExpandedNodes] = useState(new Set(['f-2', 'f-2-1', 'eq-6', 'eq-6-1', 'eq-6-1-1']));
  const [selectedEq, setSelectedEq] = useState(null);
  const treeData = buildTree(MOCK_EQUIPMENT);

  const toggleNode = (nodeId) => { const n = new Set(expandedNodes); if (n.has(nodeId)) n.delete(nodeId); else n.add(nodeId); setExpandedNodes(n); };
  const getEquipmentPath = (id) => { const path = []; let cur = MOCK_EQUIPMENT.find(e => e.id === id); while (cur && cur.parentId) { cur = MOCK_EQUIPMENT.find(e => e.id === cur.parentId); if (cur) path.unshift(cur.name); } return path; };

  const EqTickets = ({ equipmentId }) => {
    const tickets = MOCK_TICKETS.filter(t => t.equipmentId === equipmentId);
    if (tickets.length === 0) return <p className="text-sm text-text-muted italic">Нет активных тикетов</p>;
    return (
      <div className="space-y-3 mt-3">
        {tickets.map(t => (
          <div key={t.id} className={`bg-dark-bg p-3 rounded-lg border border-l-2 ${t.type === 'accident' ? 'border-accent-red/30 border-l-accent-red' : 'border-accent-yellow/30 border-l-accent-yellow'}`}>
            <div className="flex justify-between items-start mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${t.type === 'accident' ? 'text-accent-red' : 'text-accent-yellow'}`}>{t.type === 'accident' ? 'Авария' : 'ППР'}</span>
              <span className="text-xs text-text-muted">{format(new Date(t.createdAt), 'dd MMM HH:mm', { locale: ru })}</span>
            </div>
            <p className="text-sm font-medium mb-2">{t.description}</p>
            <div className="flex items-center gap-2 text-xs text-text-muted"><UserIcon className="w-3 h-3" /><span>{t.authorName}</span></div>
          </div>
        ))}
      </div>
    );
  };

  const TreeNode = ({ node, level = 0 }) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    return (
      <div className="w-full">
        <div className={`flex items-center justify-between py-1.5 px-2 my-0.5 cursor-pointer transition-all rounded-lg select-none ${selectedEq?.id === node.id ? 'bg-primary/20 border border-primary/50 shadow-sm' : 'hover:bg-dark-surface-light border border-transparent'}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => { if (hasChildren || !node.isEquipment) toggleNode(node.id); if (node.isEquipment) setSelectedEq(node); }}>
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            <div className="w-4 shrink-0 flex justify-center">{hasChildren ? (isExpanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-text-muted" />) : null}</div>
            {node.isEquipment ? <Cpu className="w-4 h-4 text-text-muted shrink-0" /> : (isExpanded ? <FolderOpen className="w-4 h-4 text-primary shrink-0" /> : <Folder className="w-4 h-4 text-text-muted shrink-0" />)}
            <span className={`truncate text-sm ${node.isEquipment ? (selectedEq?.id === node.id ? 'text-white font-medium' : 'text-gray-300') : 'font-bold text-white tracking-wide'}`}>{node.name}</span>
          </div>
          {node.isEquipment && <span className={`shrink-0 w-2.5 h-2.5 rounded-full shadow-sm ml-2 ${node.status === 'working' ? 'bg-green-500 shadow-green-500/50' : node.status === 'ppm' ? 'bg-accent-yellow shadow-accent-yellow/50' : 'bg-accent-red shadow-accent-red/50'}`} />}
        </div>
        {isExpanded && hasChildren && <div className="flex flex-col w-full border-l border-dark-border/50 ml-[14px]">{node.children.map(child => <TreeNode key={child.id} node={child} level={level + 1} />)}</div>}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col bg-dark-surface rounded-2xl border border-dark-border overflow-hidden shadow-lg h-[50vh] md:h-full">
        <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
          <h2 className="font-bold text-lg flex items-center gap-2"><Settings2 className="text-primary w-5 h-5" />База оборудования</h2>
          {user?.role === 'admin' && <button className="p-1.5 bg-primary/20 text-primary rounded-lg hover:bg-primary/40 transition-colors" title="Добавить"><Plus className="w-5 h-5" /></button>}
        </div>
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">{treeData.map(node => <TreeNode key={node.id} node={node} level={0} />)}</div>
      </div>
      <div className="w-full md:w-1/2 lg:w-2/3">
        {selectedEq ? (
          <div className="bg-dark-surface rounded-2xl border border-dark-border p-6 shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-start mb-6 border-b border-dark-border pb-6">
              <div><h2 className="text-2xl font-bold text-white mb-2">{selectedEq.name}</h2>
                <div className="flex flex-wrap gap-2 text-xs text-text-muted items-center">{getEquipmentPath(selectedEq.id).map((p, i, arr) => (<React.Fragment key={i}><span className="bg-dark-bg px-2 py-1 rounded-md border border-dark-border">{p}</span>{i < arr.length - 1 && <ChevronRight className="w-3 h-3" />}</React.Fragment>))}</div>
              </div>
              <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${selectedEq.status === 'working' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : selectedEq.status === 'ppm' ? 'bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20' : 'bg-accent-red/10 text-accent-red border border-accent-red/20'}`}>
                <Activity className="w-4 h-4" />{selectedEq.status === 'working' ? 'В РАБОТЕ' : selectedEq.status === 'ppm' ? 'ПЛАНОВЫЙ РЕМОНТ' : 'АВАРИЙНЫЙ ПРОСТОЙ'}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-l-2 border-primary pl-3">Управление статусом</h3>
                <div className="bg-dark-bg p-4 rounded-xl border border-dark-border">
                  <div className="flex justify-between text-sm text-text-muted mb-2"><span>Статус установлен:</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(selectedEq.lastStatusChange), 'dd MMM HH:mm', { locale: ru })}</span></div>
                  <div className="text-sm text-text-muted mb-4">Диспетчер: <span className="font-medium text-gray-300">{selectedEq.statusAuthor}</span></div>
                  {(user?.role === 'dispatcher' || user?.role === 'admin') ? (
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                      {[{ status: 'working', label: 'В работу', colors: 'green-500' }, { status: 'ppm', label: 'В ремонт (ППР)', colors: 'accent-yellow' }, { status: 'not_working', label: 'Авария', colors: 'accent-red' }].map(({ status, label, colors }) => (
                        <button key={status} disabled={selectedEq.status === status} className={`flex-1 py-2 px-2 rounded-lg font-medium transition-colors border text-xs sm:text-sm ${selectedEq.status === status ? `opacity-50 cursor-not-allowed bg-${colors}/10 text-${colors}/50 border-${colors}/20` : `bg-${colors}/20 text-${colors.replace('500','400')} hover:bg-${colors}/30 border-${colors}/30`}`}>{label}</button>
                      ))}
                    </div>
                  ) : <div className="p-3 bg-dark-surface rounded-lg text-sm text-text-muted text-center border border-dark-border/50">Только Диспетчер может менять статус.</div>}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><h3 className="text-lg font-medium border-l-2 border-accent-yellow pl-3">Активные тикеты</h3><button className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/30 font-medium flex items-center gap-1"><Plus className="w-3 h-3" />Создать</button></div>
                <div className="bg-dark-bg/50 p-4 rounded-xl border border-dark-border min-h-[200px]"><EqTickets equipmentId={selectedEq.id} /></div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-dark-border flex justify-end gap-3">
              <button className="px-4 py-2 bg-dark-bg text-text-main hover:bg-dark-surface-light rounded-xl font-medium transition-colors text-sm border border-dark-border">Открыть паспорт</button>
              {user?.role === 'admin' && <button className="px-4 py-2 bg-dark-bg text-text-main hover:bg-dark-surface-light rounded-xl font-medium transition-colors text-sm border border-dark-border">Редактировать</button>}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-dark-surface/50 border border-dark-border border-dashed rounded-2xl text-text-muted p-6 text-center">
            <Settings2 className="w-16 h-16 mb-4 text-dark-border" /><h3 className="text-xl font-medium mb-2">Оборудование не выбрано</h3><p className="max-w-sm">Выберите оборудование из иерархии слева.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentBase;
