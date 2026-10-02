'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChatMessage } from '@/lib/ai/asad-ai';
import { trackEvent } from '@/lib/analytics';
import { MessageSquare, X, Send, Bot, Sparkles, User, MapPin, ExternalLink } from 'lucide-react';
import { Button } from './Button';

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'AI',
      text: 'Assalam-o-Alaikum! Main Asad AI hoon — aap ka verified real-estate advisor. Aap Wah Cantt, Taxila ya Islamabad mein plot, villa ya investment option dhoond rahe hain?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          senderId: 'web-visitor-session',
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        text: data.reply || data.replyText || 'Asad Land Holdings verified rate guide par aap ka shukriya.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat AI Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'AI',
          text: 'Apologies, our advisory server is temporary updating. You can connect directly via WhatsApp: +92 300 5123456',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    'Find a Property',
    'Compare Societies',
    'Calculate Investment',
    'Check Installments',
    'Book Site Visit',
    'Talk to an Agent',
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            trackEvent('page_viewed', { widget: 'ASAD_AI_OPENED' });
          }}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-[#000000] text-[#FEFEFE] border border-[#000000] px-4 py-3 shadow-2xl flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#222222] transition-transform hover:scale-105"
          aria-label="Open Asad AI Advisor Chat"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#FEFEFE]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span>Ask Asad AI</span>
        </button>
      )}

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-full max-w-sm sm:max-w-md bg-[#FEFEFE] border border-[#000000] shadow-2xl flex flex-col h-[520px] font-sans">
          {/* Header */}
          <div className="p-4 bg-[#000000] text-[#FEFEFE] border-b border-[#222222] flex items-center justify-between font-mono">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#FEFEFE] flex items-center justify-center p-1 bg-[#FEFEFE] text-[#000000]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-tight text-[#FEFEFE]">
                  ASAD AI PROPERTY ADVISOR
                </h3>
                <span className="text-[9px] uppercase tracking-widest text-[#BDBDBD] block">
                  Verified Real Rates Engine
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[#222222] text-[#FEFEFE] transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Pills Strip */}
          <div className="px-3 py-2 bg-[#F4F4F4] border-b border-[#E5E5E5] flex items-center gap-1.5 overflow-x-auto font-mono text-[9px] no-scrollbar">
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qa)}
                className="px-2.5 py-1 bg-[#FEFEFE] border border-[#000000] text-[#000000] uppercase whitespace-nowrap hover:bg-[#000000] hover:text-[#FEFEFE] transition-colors"
              >
                {qa}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FEFEFE] text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'AI' && (
                  <div className="w-6 h-6 border border-[#000000] bg-[#000000] text-[#FEFEFE] flex items-center justify-center text-[10px] shrink-0 font-mono">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 text-xs leading-relaxed border ${
                    msg.sender === 'USER'
                      ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]'
                      : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5]'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[8px] font-mono opacity-60 block mt-1 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-[#666666] font-mono">
                <div className="w-6 h-6 border border-[#000000] bg-[#000000] text-[#FEFEFE] flex items-center justify-center text-[10px]">
                  AI
                </div>
                <span>Checking verified database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#000000] bg-[#FEFEFE] flex items-center gap-2 font-mono"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask in English or Urdu (e.g. 5 marla plot rates)..."
              className="flex-1 bg-[#F4F4F4] border border-[#000000] px-3 py-2.5 text-xs text-[#000000] rounded-none focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#000000] text-[#FEFEFE] hover:bg-[#222222] transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
