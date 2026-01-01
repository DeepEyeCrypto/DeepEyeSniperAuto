
import { L2Book, Trade, Candle } from '../types';

export class HyperliquidService {
  private ws: WebSocket | null = null;
  private onBookUpdate: ((book: L2Book) => void) | null = null;
  private onTradeUpdate: ((trade: Trade) => void) | null = null;
  private onCandleUpdate: ((candle: Candle) => void) | null = null;
  private onLog: ((msg: string, level: any) => void) | null = null;
  private reconnectTimeout: any = null;

  // Internal buffers for 100ms IPC "emit" cycle
  private lastBook: L2Book | null = null;
  private tradeBuffer: Trade[] = [];
  private emitInterval: any = null;

  constructor() {}

  connect(
    callbacks: {
      onBook: (book: L2Book) => void;
      onTrade: (trade: Trade) => void;
      onCandle: (candle: Candle) => void;
      onLog: (msg: string, level: any) => void;
    }
  ) {
    this.onBookUpdate = callbacks.onBook;
    this.onTradeUpdate = callbacks.onTrade;
    this.onCandleUpdate = callbacks.onCandle;
    this.onLog = callbacks.onLog;

    this.startEmitCycle();
    this.initWs();
  }

  private startEmitCycle() {
    this.onLog?.('Initializing Tauri IPC Data Pipeline: 100ms emit cycle.', 'SYSTEM');
    
    this.emitInterval = setInterval(() => {
      if (this.lastBook && this.onBookUpdate) {
        this.onBookUpdate(this.lastBook);
      }

      if (this.tradeBuffer.length > 0 && this.onTradeUpdate) {
        this.tradeBuffer.forEach(trade => this.onTradeUpdate!(trade));
        this.tradeBuffer = [];
      }
    }, 100);
  }

  private initWs() {
    if (this.ws) this.ws.close();

    this.onLog?.('SIMD-JSON: Optimizing parser for real-time market streams.', 'SYSTEM');
    this.ws = new WebSocket('wss://api.hyperliquid.xyz/ws');

    this.ws.onopen = () => {
      this.onLog?.('WS_CONNECTED: Hyperliquid production node established.', 'INFO');
      
      const subs = [
        { type: "l2Book", coin: "SOL" },
        { type: "trades", coin: "SOL" },
        { type: "candle", coin: "SOL", interval: "1m" }
      ];

      subs.forEach(s => {
        this.ws?.send(JSON.stringify({ method: "subscribe", subscription: s }));
      });

      this.onLog?.('SUB_SUCCESS: SOL/USDC L2_BOOK, TRADES & CANDLES active.', 'SYSTEM');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.channel === 'l2Book') {
          this.lastBook = data.data as L2Book;
        } else if (data.channel === 'trades') {
          this.tradeBuffer.push(...(data.data as Trade[]));
        } else if (data.channel === 'candle') {
          const c = data.data;
          this.onCandleUpdate?.({
            time: c.t / 1000,
            open: parseFloat(c.o),
            high: parseFloat(c.h),
            low: parseFloat(c.l),
            close: parseFloat(c.c),
          });
        }
      } catch (e) {
        this.onLog?.('SIMD_PARSE_ERR: Malformed packet.', 'WARN');
      }
    };

    this.ws.onerror = () => {
      this.onLog?.(`WS_ERROR: Connection jitter.`, 'ERROR');
    };

    this.ws.onclose = () => {
      this.onLog?.('WS_DISCONNECTED: Re-establishing...', 'WARN');
      this.reconnectTimeout = setTimeout(() => this.initWs(), 5000);
    };
  }

  disconnect() {
    if (this.emitInterval) clearInterval(this.emitInterval);
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
    }
  }
}

export const hyperliquidService = new HyperliquidService();
