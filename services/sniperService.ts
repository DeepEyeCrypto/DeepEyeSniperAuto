
import { Candle, SniperAlert } from '../types';

export class SniperService {
  private rsiPeriod = 14;
  private prices: number[] = [];

  calculateRSI(prices: number[]): number {
    if (prices.length < this.rsiPeriod + 1) return 50;
    
    let gains = 0;
    let losses = 0;

    for (let i = prices.length - this.rsiPeriod; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    const avgGain = gains / this.rsiPeriod;
    const avgLoss = losses / this.rsiPeriod;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  scan(candles: Candle[]): SniperAlert | null {
    if (candles.length < 5) return null;
    
    const last = candles[candles.length - 1];
    const first = candles[candles.length - 5];
    
    // Bubble Detection (Simplified parabolic check)
    const priceChange = ((last.close - first.open) / first.open) * 100;
    if (priceChange > 2.5) { // Relative "bubble" in SOL terms
       return {
         type: 'BUBBLE',
         confidence: Math.min(99, 70 + (priceChange * 5)),
         price: last.close,
         timestamp: Date.now()
       };
    }

    // RSI Exhaustion
    const currentPrices = candles.map(c => c.close);
    const rsi = this.calculateRSI(currentPrices);
    if (rsi > 85) {
      return {
        type: 'RSI_EXHAUSTION',
        confidence: 88,
        price: last.close,
        timestamp: Date.now()
      };
    }

    return null;
  }
}

export const sniperService = new SniperService();
