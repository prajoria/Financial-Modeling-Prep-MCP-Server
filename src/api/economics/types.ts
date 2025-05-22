export interface TreasuryRate {
  date: string;
  month1: number;
  month2: number;
  month3: number;
  month6: number;
  year1: number;
  year2: number;
  year3: number;
  year5: number;
  year7: number;
  year10: number;
  year20: number;
  year30: number;
}

export interface EconomicIndicator {
  date: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  period: string;
  unit: string;
  category: string;
  subcategory: string;
  source: string;
  lastUpdated: string;
}

export interface EconomicCalendar {
  date: string;
  time: string;
  country: string;
  event: string;
  importance: string;
  actual: number | null;
  forecast: number | null;
  previous: number | null;
  unit: string;
  currency: string;
  impact: string;
  description: string;
}

export interface MarketRiskPremium {
  date: string;
  value: number;
  change: number;
  changePercent: number;
  period: string;
  source: string;
  lastUpdated: string;
}
