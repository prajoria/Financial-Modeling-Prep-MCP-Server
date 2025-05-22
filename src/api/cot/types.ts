export interface COTReport {
  symbol: string;
  name: string;
  date: string;
  longPositions: number;
  shortPositions: number;
  longPercentage: number;
  shortPercentage: number;
  netPositions: number;
  netPercentage: number;
  longChange: number;
  shortChange: number;
  netChange: number;
  longChangePercentage: number;
  shortChangePercentage: number;
  netChangePercentage: number;
  reportType: string;
  exchange: string;
  category: string;
}

export interface COTAnalysis {
  symbol: string;
  name: string;
  date: string;
  longPositions: number;
  shortPositions: number;
  longPercentage: number;
  shortPercentage: number;
  netPositions: number;
  netPercentage: number;
  longChange: number;
  shortChange: number;
  netChange: number;
  longChangePercentage: number;
  shortChangePercentage: number;
  netChangePercentage: number;
  reportType: string;
  exchange: string;
  category: string;
  sentiment: string;
  trend: string;
  strength: number;
  volatility: number;
  momentum: number;
}

export interface COTList {
  symbol: string;
  name: string;
  exchange: string;
  category: string;
  reportType: string;
  lastUpdated: string;
  description: string;
  contractSize: number;
  contractUnit: string;
  tickSize: number;
  tickValue: number;
  tradingHours: string;
  settlementType: string;
  deliveryMonths: string[];
  isActive: boolean;
}
