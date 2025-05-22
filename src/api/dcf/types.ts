export interface DCFValuation {
  symbol: string;
  date: string;
  stockPrice: number;
  dcf: number;
  dcfPlus: number;
  dcfMinus: number;
  upside: number;
  downside: number;
  growthRate: number;
  discountRate: number;
  terminalGrowthRate: number;
  wacc: number;
  beta: number;
  marketRiskPremium: number;
  riskFreeRate: number;
  taxRate: number;
  debtToEquity: number;
  costOfDebt: number;
  costOfEquity: number;
  assumptions: {
    revenueGrowth: number;
    operatingMargin: number;
    taxRate: number;
    capexToRevenue: number;
    workingCapitalToRevenue: number;
    beta: number;
    marketRiskPremium: number;
    riskFreeRate: number;
    terminalGrowthRate: number;
  };
}

export interface LeveredDCF extends DCFValuation {
  enterpriseValue: number;
  equityValue: number;
  netDebt: number;
  minorityInterest: number;
  preferredEquity: number;
  cashAndEquivalents: number;
  totalDebt: number;
  operatingLeaseLiabilities: number;
  pensionLiabilities: number;
  otherLiabilities: number;
}

export interface CustomDCFInput {
  symbol: string;
  revenueGrowth: number;
  operatingMargin: number;
  taxRate: number;
  capexToRevenue: number;
  workingCapitalToRevenue: number;
  beta: number;
  marketRiskPremium: number;
  riskFreeRate: number;
  terminalGrowthRate: number;
  projectionYears: number;
  includeDebt: boolean;
  debtToEquity: number;
  costOfDebt: number;
}

export interface CustomDCFOutput extends DCFValuation {
  projections: {
    year: number;
    revenue: number;
    operatingIncome: number;
    freeCashFlow: number;
    presentValue: number;
  }[];
  terminalValue: number;
  enterpriseValue: number;
  equityValue: number;
  netDebt?: number;
  minorityInterest?: number;
  preferredEquity?: number;
  cashAndEquivalents?: number;
  totalDebt?: number;
  operatingLeaseLiabilities?: number;
  pensionLiabilities?: number;
  otherLiabilities?: number;
}
