
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Terminal } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const Intelligence: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'DEEPEYE Core Intelligence Online. How can I assist with your high-performance environment today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.getResponse(input);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0E11]">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20">
            <Bot className="text-cyan-400" size={24} />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight">V5 Core Intelligence</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Neural Link: ACTIVE</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">Clear Stream</button>
            <div className="px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs font-mono text-slate-500">
                PRO-GEN-3.0
            </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              msg.role === 'assistant' 
                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' 
                : 'bg-slate-800 border-white/10 text-slate-300'
            }`}>
              {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className={`max-w-2xl space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' ? 'Intelligence Core' : 'System Admin'}
                <span className="text-[8px] opacity-50">•</span>
                {msg.timestamp}
              </div>
              <div className={`p-5 rounded-2xl text-slate-200 leading-relaxed shadow-sm border ${
                msg.role === 'assistant' 
                  ? 'bg-white/[0.03] border-white/5 rounded-tl-none' 
                  : 'bg-cyan-600/10 border-cyan-500/20 rounded-tr-none'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Bot size={20} className="animate-pulse" />
            </div>
            <div className="max-w-2xl space-y-2">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                Intelligence Core <span className="text-[8px] opacity-50">•</span> PROCESSING
              </div>
              <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs text-slate-500 font-mono italic">Accessing knowledge graph...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/5 bg-[#0B0E11]/80 backdrop-blur-md sticky bottom-0">
        <div className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Execute neural command or query system knowledge..."
            className="w-full bg-slate-900 border border-white/10 focus:border-cyan-500/50 rounded-2xl py-4 pl-6 pr-16 text-white text-sm outline-none transition-all placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
              input.trim() && !isLoading 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
          <div className="absolute -top-10 left-0 flex gap-4">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-[10px] text-slate-400 hover:text-white transition-all">
                <Sparkles size={12} className="text-amber-400" />
                Analyze Performance
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-[10px] text-slate-400 hover:text-white transition-all">
                <Terminal size={12} className="text-cyan-400" />
                Optimization Plan
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
