export interface CommodityPrice {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap: number;
  timestamp: string;
  lastUpdated: string;
}

export interface CommodityHistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
  vwap: number;
  timestamp: string;
}

export interface CommodityQuote {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  price: number;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  volume: number;
  openInterest: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  timestamp: string;
  lastUpdated: string;
}

export interface CommodityContract {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  contractSize: number;
  contractUnit: string;
  tickSize: number;
  tickValue: number;
  marginRequirement: number;
  settlementType: string;
  deliveryMonth: string;
  lastTradingDay: string;
  firstNoticeDay: string;
  isActive: boolean;
  lastUpdated: string;
}

export interface CommodityMarketData {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  openInterest: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  lastPrice: number;
  lastSize: number;
  lastTime: string;
  timestamp: string;
  lastUpdated: string;
}

export interface CommodityNews {
  symbol: string;
  title: string;
  date: string;
  text: string;
  url: string;
  source: string;
  sentiment: string;
  category: string;
  lastUpdated: string;
}

export interface CommodityForecast {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  currentPrice: number;
  targetPrice: number;
  targetDate: string;
  forecastType: string;
  confidence: number;
  analyst: string;
  source: string;
  lastUpdated: string;
}

export interface CommoditySupplyDemand {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  supply: number;
  demand: number;
  inventory: number;
  production: number;
  consumption: number;
  imports: number;
  exports: number;
  period: string;
  source: string;
  lastUpdated: string;
}
