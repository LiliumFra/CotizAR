export interface DolarRate {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export interface InflationData {
  fecha: string;
  valor: number;
}

export interface CryptoPrice {
  usd: number;
  ars: number;
  usd_24h_change?: number;
}

export interface CryptoMarket {
  bitcoin: CryptoPrice;
  ethereum: CryptoPrice;
  tether: CryptoPrice;
  solana: CryptoPrice;
}

export interface MarketData {
  rates: DolarRate[];
  riesgo: number;
  inflation: InflationData[];
  crypto: CryptoMarket | null;
  news: NewsItem[];
  lastUpdate: Date | null;
  loading: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export type TimeFrame = '1M' | '3M' | '1Y';

export interface HistoryPoint {
  date: string; // formatted
  dateRaw: string;
  value: number;
  sma: number;
}

export interface ChartStats {
  sma30: number;
  min: number;
  max: number;
  start: number;
  end: number;
  change: number;
}