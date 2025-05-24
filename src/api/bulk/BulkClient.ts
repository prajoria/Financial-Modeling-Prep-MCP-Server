import { FMPClient } from "../FMPClient.js";
import {
  CompanyProfile,
  StockRating,
  DCFValuation,
  FinancialScore,
  PriceTargetSummary,
  ETFHolder,
  UpgradesDowngradesConsensus,
  KeyMetricsTTM,
  RatiosTTM,
  StockPeer,
  EarningsSurprise,
  IncomeStatement,
  IncomeStatementGrowth,
  BalanceSheetStatement,
  BalanceSheetGrowth,
  CashFlowStatement,
  CashFlowGrowth,
  EODData,
  PartParams,
  YearPeriodParams,
  EarningsSurpriseParams,
  EODParams,
} from "./types.js";

// Define a context type for all client methods
type FMPContext = {
  config?: {
    FMP_ACCESS_TOKEN?: string;
  };
};

export class BulkClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get company profiles in bulk
   * @param params Part parameters
   * @param options Optional parameters including abort signal and context
   */
  async getCompanyProfilesBulk(
    params: PartParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanyProfile[]> {
    return this.get<CompanyProfile[]>(
      `/profile-bulk`,
      {
        part: params.part,
      },
      options
    );
  }

  /**
   * Get stock ratings in bulk
   * @param options Optional parameters including abort signal and context
   */
  async getStockRatingsBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<StockRating[]> {
    return this.get<StockRating[]>(`/rating-bulk`, {}, options);
  }

  /**
   * Get DCF valuations in bulk
   * @param options Optional parameters including abort signal and context
   */
  async getDCFValuationsBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<DCFValuation[]> {
    return this.get<DCFValuation[]>(`/dcf-bulk`, {}, options);
  }

  /**
   * Get financial scores in bulk
   * @param options Optional parameters including abort signal and context
   */
  async getFinancialScoresBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<FinancialScore[]> {
    return this.get<FinancialScore[]>(`/scores-bulk`, {}, options);
  }

  /**
   * Get price target summaries in bulk
   * @param options Optional parameters including abort signal and context
   */
  async getPriceTargetSummariesBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<PriceTargetSummary[]> {
    return this.get<PriceTargetSummary[]>(
      `/price-target-summary-bulk`,
      {},
      options
    );
  }

  /**
   * Get ETF holders in bulk
   * @param params Part parameters
   * @param options Optional parameters including abort signal and context
   */
  async getETFHoldersBulk(
    params: PartParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ETFHolder[]> {
    return this.get<ETFHolder[]>(
      `/etf-holder-bulk`,
      {
        part: params.part,
      },
      options
    );
  }

  /**
   * Get upgrades/downgrades consensus in bulk
   * @param options Optional parameters including abort signal and context
   */
  async getUpgradesDowngradesConsensusBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<UpgradesDowngradesConsensus[]> {
    return this.get<UpgradesDowngradesConsensus[]>(
      `/upgrades-downgrades-consensus-bulk`,
      {},
      options
    );
  }

  /**
   * Get key metrics TTM in bulk
   * @param options Optional parameters including abort signal and context
   */
  async getKeyMetricsTTMBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<KeyMetricsTTM[]> {
    return this.get<KeyMetricsTTM[]>(`/key-metrics-ttm-bulk`, {}, options);
  }

  /**
   * Get ratios TTM in bulk
   * @param options Optional parameters including abort signal and context
   */
  async getRatiosTTMBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<RatiosTTM[]> {
    return this.get<RatiosTTM[]>(`/ratios-ttm-bulk`, {}, options);
  }

  /**
   * Get stock peers in bulk
   * @param options Optional parameters including abort signal and context
   */
  async getStockPeersBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<StockPeer[]> {
    return this.get<StockPeer[]>(`/peers-bulk`, {}, options);
  }

  /**
   * Get earnings surprises in bulk
   * @param params Earnings surprise parameters
   * @param options Optional parameters including abort signal and context
   */
  async getEarningsSurprisesBulk(
    params: EarningsSurpriseParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EarningsSurprise[]> {
    return this.get<EarningsSurprise[]>(
      `/earnings-surprises-bulk`,
      {
        year: params.year,
      },
      options
    );
  }

  /**
   * Get income statements in bulk
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   */
  async getIncomeStatementsBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IncomeStatement[]> {
    return this.get<IncomeStatement[]>(
      `/income-statement-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get income statement growth in bulk
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   */
  async getIncomeStatementGrowthBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IncomeStatementGrowth[]> {
    return this.get<IncomeStatementGrowth[]>(
      `/income-statement-growth-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get balance sheet statements in bulk
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   */
  async getBalanceSheetStatementsBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<BalanceSheetStatement[]> {
    return this.get<BalanceSheetStatement[]>(
      `/balance-sheet-statement-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get balance sheet growth in bulk
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   */
  async getBalanceSheetGrowthBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<BalanceSheetGrowth[]> {
    return this.get<BalanceSheetGrowth[]>(
      `/balance-sheet-statement-growth-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get cash flow statements in bulk
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   */
  async getCashFlowStatementsBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CashFlowStatement[]> {
    return this.get<CashFlowStatement[]>(
      `/cash-flow-statement-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get cash flow growth in bulk
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   */
  async getCashFlowGrowthBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CashFlowGrowth[]> {
    return this.get<CashFlowGrowth[]>(
      `/cash-flow-statement-growth-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get EOD data in bulk
   * @param params EOD parameters
   * @param options Optional parameters including abort signal and context
   */
  async getEODDataBulk(
    params: EODParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EODData[]> {
    return this.get<EODData[]>(
      `/eod-bulk`,
      {
        date: params.date,
      },
      options
    );
  }
}
