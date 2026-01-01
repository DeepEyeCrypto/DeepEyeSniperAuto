
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface SystemLogsProps {
  externalLogs?: LogEntry[];
}

const SystemLogs: React.FC<SystemLogsProps> = ({ externalLogs = [] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [externalLogs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-400';
      case 'WARN': return 'text-amber-400';
      case 'SYSTEM': return 'text-cyan-400';
      case 'MARKET': return 'text-purple-400';
      default: return 'text-emerald-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0E11] font-mono">
      <div className="p-4 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="ml-4 text-xs font-bold text-slate-400 uppercase tracking-widest">DEEPEYE_CONSOLE_V5</span>
        </div>
        <div className="text-[10px] text-slate-600 flex gap-4">
            <span>THREAD: 0xCF2A</span>
            <span>POOL: HYPER_SIMD</span>
        </div>
      </div>
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-1 text-xs sm:text-sm leading-relaxed"
      >
        {externalLogs.map((log) => (
          <div key={log.id} className="flex gap-4 group hover:bg-white/[0.02] py-0.5 transition-colors">
            <span className="text-slate-600 shrink-0 select-none">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
            <span className={`font-bold shrink-0 w-16 ${getLevelColor(log.level)}`}>{log.level}</span>
            <span className="text-slate-300">{log.message}</span>
          </div>
        ))}
        <div className="flex gap-4 animate-pulse pt-2">
            <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
            <span className="font-bold shrink-0 w-16 text-cyan-400">WAITING</span>
            <span className="text-slate-300">_</span>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
