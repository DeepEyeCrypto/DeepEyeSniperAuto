import React, { useMemo, useState } from 'react';
import PriceChart from './PriceChart';
import SystemLogs from './SystemLogs';
import { L2Book, Trade, Candle, LogEntry, SniperAlert, RiskStatus, DexType } from '../types';
import { ShieldAlert, Target, Zap, TrendingUp, AlertCircle, Cpu, Repeat } from 'lucide-react';

interface TerminalProps {
  book: L2Book | null;
  trades: Trade[];
  candles: Candle[];
  lastCandle: Candle | null;
  logs: LogEntry[];
  risk: RiskStatus;
  alerts: SniperAlert[];
  onTrade: (side: 'BUY' | 'SELL', dex?: DexType) => void;
}

const Terminal: React.FC<TerminalProps> = ({ book, trades, candles, lastCandle, logs, risk, alerts, onTrade }) => {
  const [selectedDex, setSelectedDex] = useState<DexType>(DexType.HYPERLIQUID);
  const asks = useMemo(() => book?.levels[1]?.slice(0, 15).reverse() || [], [book]);
  const bids = useMemo(() => book?.levels[0]?.slice(0, 15) || [], [book]);

  return (
    <div className="flex flex-col h-full bg-obsidian-bg overflow-hidden font-mono">
      <div className="flex-1 flex min-h-0">
        {/* Left: Sniper Control Hub */}
        <div className="w-[300px] shrink-0 border-r border-obsidian-border bg-obsidian-surface flex flex-col p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Target size={12} className="text-hft-dex" /> Execution Hub
            </h3>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-hft-green animate-pulse"></div>
              <div className="w-1 h-1 rounded-full bg-hft-green animate-pulse delay-75"></div>
            </div>
          </div>
          
          {/* DEX Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setSelectedDex(DexType.JUPITER)}
              className={`p-2 border text-[9px] font-bold rounded-lg transition-all ${selectedDex === DexType.JUPITER ? 'bg-hft-dex/10 border-hft-dex text-hft-dex shadow-[0_0_10px_rgba(255,0,229,0.2)]' : 'bg-white/5 border-white/5 text-slate-500'}`}
            >
              JUPITER_V6
            </button>
            <button 
              onClick={() => setSelectedDex(DexType.HYPERLIQUID)}
              className={`p-2 border text-[9px] font-bold rounded-lg transition-all ${selectedDex === DexType.HYPERLIQUID ? 'bg-hft-cyan/10 border-hft-cyan text-hft-cyan shadow-[0_0_10px_rgba(0,209,255,0.2)]' : 'bg-white/5 border-white/5 text-slate-500'}`}
            >
              HL_PERP
            </button>
          </div>

          {/* Sniper Alerts List */}
          <div className="flex-1 space-y-2 overflow-y-auto">
            <div className="text-[9px] text-slate-600 uppercase font-bold mb-2">Active Signals</div>
            {alerts.length === 0 ? (
              <div className="h-20 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-[8px] text-slate-700">
                SCANNING_MEMPOOL...
              </div>
            ) : (
              alerts.map((alert, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 p-3 rounded-xl space-y-2 group hover:border-hft-amber/30 transition-all">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold ${alert.type === 'BUBBLE' ? 'text-hft-amber' : 'text-hft-dex'}`}>
                      {alert.type}
                    </span>
                    <span className="text-[8px] text-slate-600">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour12: false })}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-[9px] text-slate-400">
                      CONF: <span className="text-white">{alert.confidence}%</span>
                    </div>
                    <div className="px-2 py-0.5 bg-obsidian-bg border border-white/10 rounded text-[8px] text-hft-cyan font-bold uppercase">
                      Auto-Route: {alert.recommendedDex}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3">
             <div className="flex justify-between text-[10px]">
                <span className="text-slate-500 uppercase">Leverage</span>
                <span className="text-white font-bold">5.00x</span>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => onTrade('BUY', selectedDex)}
                  className="flex-1 py-3 bg-hft-green text-black font-bold text-xs rounded-xl hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all active:scale-95"
                >
                  LONG
                </button>
                <button 
                  onClick={() => onTrade('SELL', selectedDex)}
                  className="flex-1 py-3 bg-hft-red text-white font-bold text-xs rounded-xl hover:shadow-[0_0_20px_rgba(255,65,65,0.3)] transition-all active:scale-95"
                >
                  SHORT
                </button>
             </div>
          </div>
        </div>

        {/* Center: Main Visualization */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative bg-obsidian-bg border-r border-obsidian-border">
             <PriceChart candles={candles} lastCandle={lastCandle} />
             
             {/* Dynamic Indicator Overlay */}
             <div className="absolute top-4 left-4 flex gap-4 pointer-events-none">
                <div className="obsidian-glass px-4 py-2 rounded-xl flex items-center gap-3">
                   <Repeat size={14} className="text-hft-cyan" />
                   <div>
                      <div className="text-[8px] text-slate-500 uppercase font-bold">Sync Speed</div>
                      <div className="text-xs font-bold text-white">0.42ms</div>
                   </div>
                </div>
                <div className="obsidian-glass px-4 py-2 rounded-xl flex items-center gap-3">
                   <Cpu size={14} className="text-hft-green" />
                   <div>
                      <div className="text-[8px] text-slate-500 uppercase font-bold">Kernel</div>
                      <div className="text-xs font-bold text-white">Mimalloc_v2</div>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Bottom Tape */}
          <div className="h-40 border-t border-obsidian-border bg-obsidian-surface/50">
            <SystemLogs externalLogs={logs} />
          </div>
        </div>

        {/* Right: Orderbook & Tape */}
        <div className="w-[300px] shrink-0 flex flex-col bg-obsidian-surface">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} /> Market Depth
            </span>
            <div className="flex items-center gap-2">
               <span className="text-[9px] text-hft-green font-bold">LIVE</span>
               <div className="w-1 h-1 rounded-full bg-hft-green animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col">
             <div className="flex-1 flex flex-col-reverse p-1 overflow-hidden">
                {asks.map((a, i) => (
                  <div key={i} className="flex justify-between items-center py-0.5 px-3 text-[10px] relative group hover:bg-white/[0.02] cursor-default">
                    <div className="absolute inset-y-0 right-0 bg-hft-red/5 transition-all" style={{ width: `${Math.min(100, parseFloat(a.sz) * 2)}%` }}></div>
                    <span className="text-hft-red relative z-10">{parseFloat(a.px).toFixed(3)}</span>
                    <span className="text-slate-500 relative z-10">{parseFloat(a.sz).toFixed(1)}</span>
                  </div>
                ))}
             </div>
             
             <div className="h-10 border-y border-white/5 bg-white/[0.02] flex items-center justify-between px-4">
                <span className="text-sm font-bold text-white">{trades[0]?.px || '---'}</span>
                <span className="text-[10px] text-slate-500">SOL_BASE</span>
             </div>

             <div className="flex-1 flex flex-col p-1 overflow-hidden">
                {bids.map((b, i) => (
                  <div key={i} className="flex justify-between items-center py-0.5 px-3 text-[10px] relative group hover:bg-white/[0.02] cursor-default">
                    <div className="absolute inset-y-0 right-0 bg-hft-green/5 transition-all" style={{ width: `${Math.min(100, parseFloat(b.sz) * 2)}%` }}></div>
                    <span className="text-hft-green relative z-10">{parseFloat(b.px).toFixed(3)}</span>
                    <span className="text-slate-500 relative z-10">{parseFloat(b.sz).toFixed(1)}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;