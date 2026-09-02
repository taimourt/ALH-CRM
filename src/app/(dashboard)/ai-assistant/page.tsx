'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Bot, MessageSquare, Flame, CheckCircle, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPKR } from '@/lib/utils';

export default function AIAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [whatsappDraft, setWhatsappDraft] = useState('');

  const samplePrompts = [
    'Show me hot leads interested in 10 marla plots under 2 crore in DHA',
    'Generate WhatsApp follow-up message for Taimour Shah',
    'Which DHA Phase 8 plots have highest commission percentage?',
  ];

  const handleQuery = async (queryText?: string) => {
    const q = queryText || prompt;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q }),
      });
      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      }
    } catch (err) {
      console.error('AI query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWhatsApp = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_whatsapp',
          prompt: {
            leadName: 'Taimour Shah',
            propertyTitle: '10 Marla Corner Plot 142 DHA Phase 8',
            price: '1.85 Crore',
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWhatsappDraft(data.draft);
      }
    } catch (err) {
      console.error('Error drafting WhatsApp:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" /> AI Systems & Sales Assistant
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Natural language CRM query engine, AI lead scoring, property matcher, and automated WhatsApp draft generator.
        </p>
      </div>

      {/* Query Box */}
      <Card className="p-5 border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-slate-900 to-slate-950 text-white space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-bold text-purple-100">
            Ask AI Real Estate Assistant
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="e.g. Find leads looking for 10 marla plots under 2 crore in DHA..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-purple-500 transition-colors"
          />
          <Button
            onClick={() => handleQuery()}
            isLoading={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Preset prompts */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[11px] text-slate-400 self-center">Try asking:</span>
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(sp);
                handleQuery(sp);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 transition-colors"
            >
              "{sp}"
            </button>
          ))}
        </div>
      </Card>

      {/* Response Display Area */}
      {response && (
        <Card className="p-6 space-y-4 border-purple-500/40 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-sm text-purple-600 dark:text-purple-400">
            <Sparkles className="w-4 h-4" /> AI Query Results
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {response.message}
          </p>

          {/* Matched Properties */}
          {response.matchedProperties?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Matched Properties ({response.matchedProperties.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {response.matchedProperties.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1"
                  >
                    <div className="font-bold text-slate-900 dark:text-slate-100">{p.title}</div>
                    <div className="text-slate-500">
                      Plot #{p.plotNumber} • {p.size} {p.sizeUnit} •{' '}
                      <strong className="text-emerald-600">{formatPKR(p.demandPrice)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Follow-up Generator */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              AI WhatsApp Follow-up Generator
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Generate personalized, high-converting WhatsApp message copy for Pakistani real estate leads.
          </p>

          <Button
            onClick={handleGenerateWhatsApp}
            isLoading={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-2"
          >
            <Sparkles className="w-4 h-4" /> Generate Follow-up Draft for Taimour Shah
          </Button>

          {whatsappDraft && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-3">
              <div className="font-bold text-emerald-800 dark:text-emerald-300">
                Generated WhatsApp Draft:
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans italic">
                "{whatsappDraft}"
              </p>
              <div className="flex justify-end">
                <a
                  href={`https://wa.me/923001234567?text=${encodeURIComponent(whatsappDraft)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Send via WhatsApp →
                </a>
              </div>
            </div>
          )}
        </Card>

        {/* Lead Scoring Intelligence */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              AI Lead Qualification & Scoring Model
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Evaluates client budget, activity velocity, site visit history, and lead source to assign intent score (0 to 100).
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Chaudhry Nisar Ahmed
              </span>
              <Badge variant="success" className="font-bold">
                Score: 94 / 100
              </Badge>
            </div>
            <p className="text-slate-500 text-[11px]">
              High qualification factors: Budget PKR 3.5 Crore, Site visit completed, Negotiation in progress.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
