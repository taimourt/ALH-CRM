import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, Home, Building, DollarSign, Calendar, Sparkles, Phone, ArrowRight } from 'lucide-react';
import { cn, formatPKR } from '@/lib/utils';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = Router();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({ leads: [], properties: [], customers: [], deals: [] });
  const [loading, setLoading] = useState(false);

  function Router() {
    return useRouter();
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ leads: [], properties: [], customers: [], deals: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  const hasResults =
    results.leads?.length > 0 ||
    results.properties?.length > 0 ||
    results.customers?.length > 0 ||
    results.deals?.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Palette Box */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phone numbers (e.g. 03001234567), plot #, leads, properties..."
            className="w-full py-4 text-sm bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading && (
            <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
              Searching Pakistani Real Estate CRM Database...
            </div>
          )}

          {!loading && !query && (
            <div className="p-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => navigateTo('/leads')}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <User className="w-4 h-4 text-emerald-500" />
                  <span>Lead Management & Pipeline</span>
                </button>
                <button
                  onClick={() => navigateTo('/properties')}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Home className="w-4 h-4 text-blue-500" />
                  <span>Property & Plot Inventory</span>
                </button>
                <button
                  onClick={() => navigateTo('/deals')}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  <span>Deals & Token Booking</span>
                </button>
                <button
                  onClick={() => navigateTo('/ai-assistant')}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>AI Natural Language Search</span>
                </button>
              </div>
            </div>
          )}

          {!loading && query && !hasResults && (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching leads, plot numbers, or clients found for "{query}".
            </div>
          )}

          {!loading && hasResults && (
            <div className="space-y-4 p-2">
              {/* Leads */}
              {results.leads?.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 px-2">
                    Leads ({results.leads.length})
                  </div>
                  {results.leads.map((lead: any) => (
                    <button
                      key={lead.id}
                      onClick={() => navigateTo(`/leads?id=${lead.id}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {lead.name}
                            <span className="text-[10px] font-normal text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Stage: <span className="font-medium text-emerald-600">{lead.stage}</span> • Pref: {lead.preferredSize} in {lead.preferredSociety || 'Any'}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}

              {/* Properties */}
              {results.properties?.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 px-2">
                    Properties & Plots ({results.properties.length})
                  </div>
                  {results.properties.map((prop: any) => (
                    <button
                      key={prop.id}
                      onClick={() => navigateTo(`/properties?id=${prop.id}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {prop.title} {prop.plotNumber ? `(Plot #${prop.plotNumber})` : ''}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {prop.size} {prop.sizeUnit} • {prop.society?.name || prop.city} • <span className="font-semibold text-slate-900 dark:text-slate-200">{formatPKR(prop.demandPrice)}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search Asad Land Holdings CRM</span>
          <span>Press <strong>Cmd + K</strong> anytime to toggle</span>
        </div>
      </div>
    </div>
  );
}
