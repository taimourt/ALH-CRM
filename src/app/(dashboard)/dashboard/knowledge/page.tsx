'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Tag, 
  Clock,
  Layers,
  Info
} from 'lucide-react';
import { KnowledgeItem } from '@/lib/ai/knowledge-service';

export default function KnowledgeBasePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State for new item
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeItem['category']>('SOCIETIES');
  const [newContent, setNewContent] = useState('');
  const [newSource, setNewSource] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchKnowledgeItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crm/knowledge');
      const data = await res.json();
      if (data.success && data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Failed to fetch knowledge base', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeItems();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'ACTIVE' | 'INACTIVE') => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch('/api/crm/knowledge', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
      }
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/crm/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          content: newContent,
          source: newSource || 'Admin Entry',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchKnowledgeItems();
        setShowAddModal(false);
        setNewTitle('');
        setNewContent('');
        setNewSource('');
      }
    } catch (err) {
      console.error('Failed to create knowledge item', err);
    } fontFinally: {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 md:p-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Asad AI Knowledge Base & Grounding Admin
            </h1>
            <span className="text-xs font-mono bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-2.5 py-1">
              Strict Verification Enabled
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage verified facts, society rules, market rates, and official policies used to ground Asad AI.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Knowledge Record
        </button>
      </div>

      {/* Grounding System Alert */}
      <div className="mb-8 p-4 bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-zinc-100 flex items-start gap-4">
        <div className="p-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
            Zero Hallucination Grounding Rule
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
            Asad AI cross-references all user inquiries against active records below. If a price, payment plan, or society detail is not present in inventory or this Knowledge Base, the AI will state that official confirmation from senior agent Asad Ali is required rather than inventing details.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 bg-white dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800">
          {['ALL', 'POLICIES', 'SOCIETIES', 'PROPERTIES', 'CONSTRUCTION_BOQ', 'FAQS'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
          />
        </div>
      </div>

      {/* Grid of Knowledge Base Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-zinc-400">Loading Knowledge Base...</div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-800">
          No matching knowledge records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`bg-white dark:bg-zinc-900 border p-5 flex flex-col justify-between transition-all ${
                item.status === 'ACTIVE'
                  ? 'border-zinc-200 dark:border-zinc-800'
                  : 'border-zinc-200 dark:border-zinc-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 uppercase">
                    {item.category}
                  </span>
                  
                  <button
                    onClick={() => handleToggleStatus(item.id, item.status)}
                    className={`text-[10px] font-mono px-2 py-0.5 border font-bold transition-all flex items-center gap-1 ${
                      item.status === 'ACTIVE'
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700'
                    }`}
                  >
                    {item.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {item.status}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug font-serif">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans mb-4">
                  {item.content}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>Source: {item.source}</span>
                <span>Updated: {item.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-zinc-100 w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-serif text-zinc-900 dark:text-zinc-50">
                Add Knowledge Base Record
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                [ESC] Close
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Record Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Faisal Hills Block C Ground Water Status 2026"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as KnowledgeItem['category'])}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                >
                  <option value="SOCIETIES">SOCIETIES</option>
                  <option value="PROPERTIES">PROPERTIES</option>
                  <option value="PAYMENT_PLANS">PAYMENT_PLANS</option>
                  <option value="POLICIES">POLICIES</option>
                  <option value="CONSTRUCTION_BOQ">CONSTRUCTION_BOQ</option>
                  <option value="FAQS">FAQS</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Fact Content / Policy Text</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter exact verified fact text..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Authority Source</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="e.g. RDA Gazette / Asad Ali Verification"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
