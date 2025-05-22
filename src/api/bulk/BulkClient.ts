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

export class BulkClient extends FMPClient {
  /**
   * Get company profiles in bulk
   */
  async getCompanyProfilesBulk(params: PartParams): Promise<CompanyProfile[]> {
    return this.get<CompanyProfile[]>(`/profile-bulk`, {
      part: params.part,
    });
  }

  /**
   * Get stock ratings in bulk
   */
  async getStockRatingsBulk(): Promise<StockRating[]> {
    return this.get<StockRating[]>(`/rating-bulk`);
  }

  /**
   * Get DCF valuations in bulk
   */
  async getDCFValuationsBulk(): Promise<DCFValuation[]> {
    return this.get<DCFValuation[]>(`/dcf-bulk`);
  }

  /**
   * Get financial scores in bulk
   */
  async getFinancialScoresBulk(): Promise<FinancialScore[]> {
    return this.get<FinancialScore[]>(`/scores-bulk`);
  }

  /**
   * Get price target summaries in bulk
   */
  async getPriceTargetSummariesBulk(): Promise<PriceTargetSummary[]> {
    return this.get<PriceTargetSummary[]>(`/price-target-summary-bulk`);
  }

  /**
   * Get ETF holders in bulk
   */
  async getETFHoldersBulk(params: PartParams): Promise<ETFHolder[]> {
    return this.get<ETFHolder[]>(`/etf-holder-bulk`, {
      part: params.part,
    });
  }

  /**
   * Get upgrades/downgrades consensus in bulk
   */
  async getUpgradesDowngradesConsensusBulk(): Promise<
    UpgradesDowngradesConsensus[]
  > {
    return this.get<UpgradesDowngradesConsensus[]>(
      `/upgrades-downgrades-consensus-bulk`
    );
  }

  /**
   * Get key metrics TTM in bulk
   */
  async getKeyMetricsTTMBulk(): Promise<KeyMetricsTTM[]> {
    return this.get<KeyMetricsTTM[]>(`/key-metrics-ttm-bulk`);
  }

  /**
   * Get ratios TTM in bulk
   */
  async getRatiosTTMBulk(): Promise<RatiosTTM[]> {
    return this.get<RatiosTTM[]>(`/ratios-ttm-bulk`);
  }

  /**
   * Get stock peers in bulk
   */
  async getStockPeersBulk(): Promise<StockPeer[]> {
    return this.get<StockPeer[]>(`/peers-bulk`);
  }

  /**
   * Get earnings surprises in bulk
   */
  async getEarningsSurprisesBulk(
    params: EarningsSurpriseParams
  ): Promise<EarningsSurprise[]> {
    return this.get<EarningsSurprise[]>(`/earnings-surprises-bulk`, {
      year: params.year,
    });
  }

  /**
   * Get income statements in bulk
   */
  async getIncomeStatementsBulk(
    params: YearPeriodParams
  ): Promise<IncomeStatement[]> {
    return this.get<IncomeStatement[]>(`/income-statement-bulk`, {
      year: params.year,
      period: params.period,
    });
  }

  /**
   * Get income statement growth in bulk
   */
  async getIncomeStatementGrowthBulk(
    params: YearPeriodParams
  ): Promise<IncomeStatementGrowth[]> {
    return this.get<IncomeStatementGrowth[]>(`/income-statement-growth-bulk`, {
      year: params.year,
      period: params.period,
    });
  }

  /**
   * Get balance sheet statements in bulk
   */
  async getBalanceSheetStatementsBulk(
    params: YearPeriodParams
  ): Promise<BalanceSheetStatement[]> {
    return this.get<BalanceSheetStatement[]>(`/balance-sheet-statement-bulk`, {
      year: params.year,
      period: params.period,
    });
  }

  /**
   * Get balance sheet growth in bulk
   */
  async getBalanceSheetGrowthBulk(
    params: YearPeriodParams
  ): Promise<BalanceSheetGrowth[]> {
    return this.get<BalanceSheetGrowth[]>(
      `/balance-sheet-statement-growth-bulk`,
      {
        year: params.year,
        period: params.period,
      }
    );
  }

  /**
   * Get cash flow statements in bulk
   */
  async getCashFlowStatementsBulk(
    params: YearPeriodParams
  ): Promise<CashFlowStatement[]> {
    return this.get<CashFlowStatement[]>(`/cash-flow-statement-bulk`, {
      year: params.year,
      period: params.period,
    });
  }

  /**
   * Get cash flow growth in bulk
   */
  async getCashFlowGrowthBulk(
    params: YearPeriodParams
  ): Promise<CashFlowGrowth[]> {
    return this.get<CashFlowGrowth[]>(`/cash-flow-statement-growth-bulk`, {
      year: params.year,
      period: params.period,
    });
  }

  /**
   * Get EOD data in bulk
   */
  async getEODDataBulk(params: EODParams): Promise<EODData[]> {
    return this.get<EODData[]>(`/eod-bulk`, {
      date: params.date,
    });
  }
}
