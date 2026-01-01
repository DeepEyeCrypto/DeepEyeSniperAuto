
import React, { useMemo } from 'react';
import { L2Book, Trade } from '../types';
import { Activity, ArrowUpRight, ArrowDownRight, BarChart3, TrendingUp } from 'lucide-react';

interface NetworkProps {
  book: L2Book | null;
  trades: Trade[];
}

const Network: React.FC<NetworkProps> = ({ book, trades }) => {
  const asks = useMemo(() => book?.levels[1].slice(0, 15).reverse() || [], [book]);
  const bids = useMemo(() => book?.levels[0].slice(0, 15) || [], [book]);

  const maxTotal = useMemo(() => {
    if (!book) return 1;
    const all = [...asks, ...bids];
    return Math.max(...all.map(l => parseFloat(l.sz)));
  }, [asks, bids, book]);

  return (
    <div className="p-8 h-full flex flex-col gap-8 overflow-hidden">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/20">
            <Activity className="text-cyan-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SOL/USDC <span className="text-slate-500 font-normal text-lg">Hyperliquid</span></h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">SIMD_PARSING_ACTIVE</span>
              <span className="text-[10px] font-mono text-slate-500">LATENCY: 12ms</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="obsidian-glass px-6 py-3 rounded-2xl flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Mark Price</span>
            <span className="text-xl font-mono font-bold text-white">
              {trades[0]?.px ? `$${parseFloat(trades[0].px).toFixed(3)}` : '---'}
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        {/* Order Book */}
        <div className="lg:col-span-2 obsidian-glass rounded-2xl flex flex-col overflow-hidden border border-white/5">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={14} /> Order Book Depth
            </span>
            <span className="text-[10px] font-mono text-slate-600">UNIT: SOL</span>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-px bg-white/5">
            {/* Asks (Sellers) */}
            <div className="bg-[#0B0E11] flex flex-col p-2 overflow-hidden">
              <div className="grid grid-cols-3 text-[10px] font-bold text-slate-600 uppercase mb-2 px-2">
                <span>Price</span>
                <span className="text-right">Size</span>
                <span className="text-right">Total</span>
              </div>
              <div className="space-y-0.5 overflow-hidden">
                {asks.map((level, i) => (
                  <div key={i} className="relative group cursor-default grid grid-cols-3 text-xs font-mono py-1 px-2 hover:bg-white/[0.03] transition-colors">
                    <div 
                      className="absolute inset-0 bg-red-500/5 origin-right transition-all" 
                      style={{ width: `${(parseFloat(level.sz) / maxTotal) * 100}%`, left: 'auto', right: 0 }}
                    ></div>
                    <span className="text-red-400 relative z-10">{parseFloat(level.px).toFixed(3)}</span>
                    <span className="text-right text-slate-400 relative z-10">{parseFloat(level.sz).toFixed(2)}</span>
                    <span className="text-right text-slate-500 relative z-10">{(parseFloat(level.px) * parseFloat(level.sz)).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bids (Buyers) */}
            <div className="bg-[#0B0E11] flex flex-col p-2 overflow-hidden">
              <div className="grid grid-cols-3 text-[10px] font-bold text-slate-600 uppercase mb-2 px-2">
                <span>Price</span>
                <span className="text-right">Size</span>
                <span className="text-right">Total</span>
              </div>
              <div className="space-y-0.5 overflow-hidden">
                {bids.map((level, i) => (
                  <div key={i} className="relative group cursor-default grid grid-cols-3 text-xs font-mono py-1 px-2 hover:bg-white/[0.03] transition-colors">
                    <div 
                      className="absolute inset-0 bg-emerald-500/5 origin-left transition-all" 
                      style={{ width: `${(parseFloat(level.sz) / maxTotal) * 100}%` }}
                    ></div>
                    <span className="text-emerald-400 relative z-10">{parseFloat(level.px).toFixed(3)}</span>
                    <span className="text-right text-slate-400 relative z-10">{parseFloat(level.sz).toFixed(2)}</span>
                    <span className="text-right text-slate-500 relative z-10">{(parseFloat(level.px) * parseFloat(level.sz)).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="obsidian-glass rounded-2xl flex flex-col overflow-hidden border border-white/5">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} /> Market Trades
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Live</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {trades.map((trade, i) => (
              <div key={trade.hash || i} className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded ${trade.side === 'B' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trade.side === 'B' ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                  </div>
                  <span className={`text-sm font-mono font-bold ${trade.side === 'B' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {parseFloat(trade.px).toFixed(3)}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-300 font-mono">{parseFloat(trade.sz).toFixed(2)} SOL</span>
                  <span className="text-[10px] text-slate-600 font-mono">
                    {new Date(trade.time).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;
