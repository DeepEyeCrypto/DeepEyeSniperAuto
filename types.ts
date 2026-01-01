// DEEPEYE V5 - Core Type Definitions

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TERMINAL = 'TERMINAL',
  INTELLIGENCE = 'INTELLIGENCE',
  SYSTEM_LOGS = 'SYSTEM_LOGS',
  NETWORK = 'NETWORK',
  SETTINGS = 'SETTINGS',
}

export interface SystemMetric {
  cpu: number;
  memory: number;
  latency: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM' | 'MARKET';
  message: string;
}

export interface L2Level {
  px: string;
  sz: string;
}

export interface L2Book {
  coin: string;
  levels: [L2Level[], L2Level[]]; // [bids, asks]
  time: number;
}

export interface Trade {
  coin: string;
  side: 'B' | 'S';
  px: string;
  sz: string;
  time: number;
  hash?: string;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface SniperAlert {
  type: 'BUBBLE' | 'RSI_EXHAUSTION';
  confidence: number;
  price: number;
  timestamp: number;
  recommendedDex?: DexType;
}

export interface RiskStatus {
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
  details?: string;
}

export enum DexType {
  JUPITER = 'JUPITER',
  HYPERLIQUID = 'HYPERLIQUID',
}
