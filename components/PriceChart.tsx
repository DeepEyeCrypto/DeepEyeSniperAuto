import React from 'react';
import { Candle } from '../types';

interface PriceChartProps {
  candles: Candle[];
  lastCandle: Candle | null;
}

const PriceChart: React.FC<PriceChartProps> = ({ candles }) => {
  if (!candles || candles.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0B0E11] text-slate-700 font-mono text-[10px]">
        <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
        AWAITING_MARKET_DATA_PACKETS
      </div>
    );
  }

  const maxHigh = Math.max(...candles.map(c => c.high));
  const minLow = Math.min(...candles.map(c => c.low));
  const range = maxHigh - minLow;

  return (
    <div className="w-full h-full p-4 flex items-end gap-[2px] bg-[#0B0E11]">
      {candles.slice(-60).map((candle, idx) => {
        const isUp = candle.close >= candle.open;
        const bodyHeight = (Math.abs(candle.close - candle.open) / range) * 100;
        const wickHeight = ((candle.high - candle.low) / range) * 100;
        const bottomOffset = ((Math.min(candle.open, candle.close) - minLow) / range) * 100;
        const wickBottom = ((candle.low - minLow) / range) * 100;

        return (
          <div key={idx} className="flex-1 flex flex-col items-center relative group h-full">
            {/* Wick */}
            <div 
              className={`absolute w-px ${isUp ? 'bg-emerald-500/40' : 'bg-red-500/40'}`}
              style={{ height: `${wickHeight}%`, bottom: `${wickBottom}%` }}
            />
            {/* Body */}
            <div 
              className={`w-full max-w-[6px] rounded-sm transition-all relative z-10 ${isUp ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]'}`}
              style={{ height: `${Math.max(bodyHeight, 2)}%`, bottom: `${bottomOffset}%` }}
            />
            {/* Tooltip Hover */}
            <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/80 border border-white/10 p-2 rounded text-[8px] z-50 whitespace-nowrap -translate-y-full">
              P: ${candle.close.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceChart;