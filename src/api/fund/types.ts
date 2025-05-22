export interface FundHolding {
  symbol: string;
  name: string;
  weight: number;
  shares: number;
  marketValue: number;
  currency: string;
  exchange: string;
  sector: string;
  industry: string;
  country: string;
  lastUpdated: string;
}

export interface FundInfo {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  micCode: string;
  country: string;
  type: string;
  isin: string;
  lei: string;
  cusip: string;
  class: string;
  category: string;
  family: string;
  description: string;
  website: string;
  inceptionDate: string;
  expenseRatio: number;
  aum: number;
  nav: number;
  navCurrency: string;
  navDate: string;
  navChange: number;
  navChangePercent: number;
  ytdReturn: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  tenYearReturn: number;
  sinceInceptionReturn: number;
  dividendYield: number;
  dividendFrequency: string;
  lastDividendDate: string;
  lastDividendAmount: number;
  lastDividendCurrency: string;
  isActive: boolean;
  isEtf: boolean;
  isMutualFund: boolean;
}

export interface FundCountryAllocation {
  country: string;
  weight: number;
  marketValue: number;
  currency: string;
  lastUpdated: string;
}

export interface FundAssetExposure {
  etfSymbol: string;
  etfName: string;
  weight: number;
  shares: number;
  marketValue: number;
  currency: string;
  lastUpdated: string;
}

export interface FundSectorWeighting {
  sector: string;
  weight: number;
  marketValue: number;
  currency: string;
  lastUpdated: string;
}

export interface FundDisclosure {
  symbol: string;
  name: string;
  cik: string;
  formType: string;
  filingDate: string;
  acceptedDate: string;
  periodOfReport: string;
  url: string;
  holdings: FundHolding[];
  lastUpdated: string;
}

export interface FundDisclosureSearch {
  symbol: string;
  name: string;
  cik: string;
  formType: string;
  filingDate: string;
  acceptedDate: string;
  periodOfReport: string;
  url: string;
  lastUpdated: string;
}

export interface FundDisclosureDate {
  filingDate: string;
  acceptedDate: string;
  formType: string;
  url: string;
  lastUpdated: string;
}
