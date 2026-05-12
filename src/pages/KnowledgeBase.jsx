import React, { useState, useEffect } from 'react';
import { MOCK_KNOWLEDGE, MOCK_EQUIPMENT } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Filter, Plus, X, FileText, Download, Image as ImageIcon, Clock, ChevronLeft, Trash2, Paperclip, Wrench, Zap, Droplets, FolderOpen, Cpu, Settings2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const CATEGORIES = [
  { id: 'all', name: 'Все категории' },
  { id: 'Механика', name: 'Механика', icon: Wrench, color: 'text-orange-500 bg-orange-500/10' },
  { id: 'Электрика', name: 'Электрика', icon: Zap, color: 'text-yellow-500 bg-yellow-500/10' },
  { id: 'Гидравлика', name: 'Гидравлика', icon: Droplets, color: 'text-blue-500 bg-blue-500/10' },
  { id: 'Автоматизация', name: 'Автоматизация', icon: Cpu, color: 'text-purple-500 bg-purple-500/10' },
  { id: 'Общее', name: 'Общее', icon: FolderOpen, color: 'text-gray-400 bg-gray-500/10' },
];

const KnowledgeBase = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState(MOCK_KNOWLEDGE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (!user || !user.service) return 'all';
    const s = user.service.toLowerCase();
    if (s.includes('механик')) return 'Механика';
    if (s.includes('электрик')) return 'Электрика';
    if (s.includes('автоматиз')) return 'Автоматизация';
    if (s.includes('гидравл')) return 'Гидравлика';
    return 'all';
  });
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'Механика', content: '', equipmentId: '' });

  useEffect(() => { if (selectedCategory !== 'all') setFormData(prev => ({ ...prev, category: selectedCategory })); }, [selectedCategory]);

  const getEquipmentName = (id) => MOCK_EQUIPMENT.find(e => e.id === id)?.name || 'Не привязано';
  const getEquipmentPath = (id) => {
    const path = []; let current = MOCK_EQUIPMENT.find(e => e.id === id);
    while (current && current.parentId) { current = MOCK_EQUIPMENT.find(e => e.id === current.parentId); if (current) path.unshift(current.name); }
    return path.length > 0 ? path.join(' > ') + ' > ' : '';
  };
  const equipmentOptions = MOCK_EQUIPMENT.filter(e => e.isEquipment).map(e => ({ id: e.id, fullName: `${getEquipmentPath(e.id)}${e.name}` }));

  const handleCreateArticle = (e) => {
    e.preventDefault();
    setArticles([{ id: `kb-${Date.now()}`, title: formData.title, category: formData.category, authorName: user.name, date: new Date().toISOString(), content: formData.content, attachments: [], equipmentId: formData.equipmentId || null }, ...articles]);
    setIsCreateModalOpen(false);
    setFormData({ title: '', category: 'Механика', content: '', equipmentId: '' });
  };

  const handleDelete = (id, e) => { e.stopPropagation(); if (window.confirm('Удалить статью?')) { setArticles(articles.filter(a => a.id !== id)); if (activeArticle?.id === id) setActiveArticle(null); } };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (selectedCategory === 'all' || a.category === selectedCategory) && (selectedEquipment === '' || a.equipmentId === selectedEquipment);
  });

  if (activeArticle) {
    const catConfig = CATEGORIES.find(c => c.id === activeArticle.category) || CATEGORIES[5];
    const CatIcon = catConfig.icon;
    return (
      <div className="p-4 md:p-8 h-full flex flex-col overflow-y-auto custom-scrollbar bg-dark-bg">
        <button onClick={() => setActiveArticle(null)} className="mb-6 flex items-center gap-2 text-text-muted hover:text-white transition-colors w-fit"><ChevronLeft className="w-5 h-5" />Назад к списку</button>
        <div className="max-w-4xl mx-auto w-full bg-dark-surface border border-dark-border rounded-2xl p-6 md:p-10 shadow-lg relative">
          {user?.role === 'admin' && <button onClick={(e) => handleDelete(activeArticle.id, e)} className="absolute top-6 right-6 p-2 text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-xl transition-colors" title="Удалить"><Trash2 className="w-5 h-5" /></button>}
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <span className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${catConfig.color}`}><CatIcon className="w-3.5 h-3.5" />{activeArticle.category}</span>
            <span className="text-sm text-text-muted flex items-center gap-1.5"><Clock className="w-4 h-4" />{format(new Date(activeArticle.date), 'dd MMMM yyyy', { locale: ru })}</span>
            <span className="text-sm px-3 py-1 bg-dark-bg border border-dark-border rounded-lg text-text-muted">Автор: {activeArticle.authorName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{activeArticle.title}</h1>
          {activeArticle.equipmentId && (
            <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
              <Settings2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div><p className="text-sm font-medium text-primary mb-1">Привязано к оборудованию</p><p className="text-white font-medium">{getEquipmentName(activeArticle.equipmentId)}</p></div>
            </div>
          )}
          <div className="prose prose-invert max-w-none mb-10 text-gray-300 leading-relaxed whitespace-pre-wrap">{activeArticle.content}</div>
          {activeArticle.attachments.length > 0 && (
            <div className="border-t border-dark-border pt-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Paperclip className="w-5 h-5" />Прикрепленные файлы</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeArticle.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-xl hover:border-primary/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-dark-surface-light rounded-lg text-text-muted group-hover:text-primary transition-colors">{file.name.endsWith('.pdf') ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}</div>
                      <div className="truncate"><p className="text-sm font-medium text-white truncate">{file.name}</p><p className="text-xs text-text-muted">{file.size}</p></div>
                    </div>
                    <Download className="w-5 h-5 text-text-muted group-hover:text-primary shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 h-full flex flex-col overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><BookOpen className="text-primary w-6 h-6" />База знаний</h1>
          <p className="text-text-muted text-sm mt-1">Документация, инструкции и паспорта оборудования</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors whitespace-nowrap">
          <Plus className="w-5 h-5" /><span className="hidden sm:inline">Написать статью</span>
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-dark-surface border border-dark-border rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-primary outline-none text-white" />
        </div>
        <select value={selectedEquipment} onChange={(e) => setSelectedEquipment(e.target.value)} className="md:w-1/3 bg-dark-surface border border-dark-border rounded-xl py-3 px-4 focus:ring-1 focus:ring-primary outline-none text-white appearance-none cursor-pointer">
          <option value="">-- Все оборудование --</option>
          {equipmentOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.fullName}</option>)}
        </select>
      </div>
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
        {CATEGORIES.map(cat => { const isSelected = selectedCategory === cat.id; const CatIcon = cat.icon; return (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap border ${isSelected ? 'bg-primary/20 border-primary/50 text-white' : 'bg-dark-surface border-dark-border text-text-muted hover:bg-dark-surface-light'}`}>
            {CatIcon && <CatIcon className={`w-4 h-4 ${isSelected ? 'text-primary' : ''}`} />}{cat.name}
          </button>); })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
        {filteredArticles.map(article => { const catConfig = CATEGORIES.find(c => c.id === article.category) || CATEGORIES[5]; const CatIcon = catConfig.icon; return (
          <div key={article.id} onClick={() => setActiveArticle(article)} className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-sm hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer flex flex-col group relative">
            {user?.role === 'admin' && <button onClick={(e) => handleDelete(article.id, e)} className="absolute top-4 right-4 p-2 text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${catConfig.color}`}><CatIcon className="w-3.5 h-3.5" />{article.category}</span>
              <span className="text-xs text-text-muted flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(article.date), 'dd MMM yyyy', { locale: ru })}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
            <p className="text-sm text-text-muted mb-6 line-clamp-3 flex-1">{article.content}</p>
            <div className="mt-auto pt-4 border-t border-dark-border flex justify-between items-center text-xs">
              <span className="text-gray-400 font-medium px-2 py-1 bg-dark-bg rounded-lg border border-dark-border">{article.authorName}</span>
              {article.attachments.length > 0 && <span className="flex items-center gap-1 text-text-muted"><Paperclip className="w-3.5 h-3.5" />{article.attachments.length} файла</span>}
            </div>
          </div>); })}
        {filteredArticles.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-text-muted border border-dashed border-dark-border rounded-2xl bg-dark-surface/50">
            <BookOpen className="w-16 h-16 mb-4 opacity-20" /><h3 className="text-xl font-medium mb-1">Ничего не найдено</h3><p>Попробуйте изменить запрос</p>
          </div>
        )}
      </div>
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
            <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
              <h2 className="font-bold text-lg text-white">Новая статья</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-text-muted hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleCreateArticle} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              <div className="space-y-1"><label className="text-sm font-medium text-text-muted">Название *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none text-white" placeholder="Коротко и ясно..." />
              </div>
              <div className="flex gap-4">
                <div className="space-y-1 w-1/3"><label className="text-sm font-medium text-text-muted">Категория</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none text-white">
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1 flex-1"><label className="text-sm font-medium text-text-muted">Оборудование</label>
                  <select value={formData.equipmentId} onChange={(e) => setFormData({...formData, equipmentId: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none text-white">
                    <option value="">-- Общая --</option>
                    {equipmentOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.fullName}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1"><label className="text-sm font-medium text-text-muted">Текст *</label>
                <textarea required value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={8} className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none text-white resize-none" placeholder="Опишите процесс..." />
              </div>
              <div className="space-y-2"><label className="text-sm font-medium text-text-muted">Файлы</label>
                <div className="border border-dashed border-dark-border rounded-xl p-4 flex flex-col items-center text-center hover:bg-dark-bg/50 cursor-pointer group">
                  <div className="p-2 bg-dark-bg text-text-muted rounded-lg mb-2 group-hover:text-primary border border-dark-border"><Paperclip className="w-5 h-5" /></div>
                  <p className="text-sm text-text-muted">Нажмите для прикрепления</p>
                </div>
              </div>
            </form>
            <div className="p-4 border-t border-dark-border bg-dark-bg/50 flex gap-3">
              <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 bg-dark-surface border border-dark-border text-white rounded-xl font-medium hover:bg-dark-surface-light transition-colors" type="button">Отмена</button>
              <button onClick={handleCreateArticle} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">Опубликовать</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
