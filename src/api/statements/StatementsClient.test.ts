import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StatementsClient } from './StatementsClient.js';
import { FMPClient } from '../FMPClient.js';
import type {
  IncomeStatement,
  BalanceSheetStatement,
  CashFlowStatement,
  LatestFinancialStatement,
  IncomeStatementGrowth,
  BalanceSheetStatementGrowth,
  CashFlowStatementGrowth,
  FinancialStatementGrowth,
  FinancialReportDate,
  FinancialReport10K,
  RevenueProductSegmentation,
  RevenueGeographicSegmentation,
  AsReportedIncomeStatement,
  AsReportedBalanceSheet,
  AsReportedCashFlowStatement,
  AsReportedFinancialStatement,
  KeyMetrics,
  Ratios,
  KeyMetricsTTM,
  FinancialRatiosTTM,
  FinancialScores,
  OwnerEarnings,
} from './types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('StatementsClient', () => {
  let statementsClient: StatementsClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create StatementsClient instance
    statementsClient = new StatementsClient('test-api-key');
  });

  describe('getIncomeStatement', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IncomeStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          revenue: 383285000000,
          costOfRevenue: 214137000000,
          grossProfit: 169148000000,
          researchAndDevelopmentExpenses: 29915000000,
          generalAndAdministrativeExpenses: 6496000000,
          sellingAndMarketingExpenses: 0,
          sellingGeneralAndAdministrativeExpenses: 24932000000,
          otherExpenses: 0,
          operatingExpenses: 54847000000,
          costAndExpenses: 268984000000,
          netInterestIncome: 3750000000,
          interestIncome: 4020000000,
          interestExpense: 3933000000,
          depreciationAndAmortization: 11519000000,
          ebitda: 125820000000,
          ebit: 114301000000,
          nonOperatingIncomeExcludingInterest: 382000000,
          operatingIncome: 114301000000,
          totalOtherIncomeExpensesNet: 269000000,
          incomeBeforeTax: 114570000000,
          incomeTaxExpense: 16741000000,
          netIncomeFromContinuingOperations: 97829000000,
          netIncomeFromDiscontinuedOperations: 0,
          otherAdjustmentsToNetIncome: 0,
          netIncome: 97829000000,
          netIncomeDeductions: 0,
          bottomLineNetIncome: 97829000000,
          eps: 6.13,
          epsDiluted: 6.13,
          weightedAverageShsOut: 15956000000,
          weightedAverageShsOutDil: 15956000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getIncomeStatement('AAPL', {
        limit: 10,
        period: 'FY'
      });

      expect(mockGet).toHaveBeenCalledWith('/income-statement', {
        symbol: 'AAPL',
        limit: 10,
        period: 'FY'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: IncomeStatement[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getIncomeStatement('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/income-statement', {
        symbol: 'AAPL'
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(statementsClient.getIncomeStatement('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getBalanceSheetStatement', () => {
    it('should call get with correct parameters', async () => {
      const mockData: BalanceSheetStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          cashAndCashEquivalents: 29965000000,
          shortTermInvestments: 31590000000,
          cashAndShortTermInvestments: 61555000000,
          netReceivables: 29508000000,
          accountsReceivables: 18508000000,
          otherReceivables: 11000000000,
          inventory: 6331000000,
          prepaids: 0,
          otherCurrentAssets: 14695000000,
          totalCurrentAssets: 143566000000,
          propertyPlantEquipmentNet: 43715000000,
          goodwill: 0,
          intangibleAssets: 0,
          goodwillAndIntangibleAssets: 0,
          longTermInvestments: 100544000000,
          taxAssets: 0,
          otherNonCurrentAssets: 64758000000,
          totalNonCurrentAssets: 208672000000,
          otherAssets: 0,
          totalAssets: 352755000000,
          totalPayables: 0,
          accountPayables: 62611000000,
          otherPayables: 0,
          accruedExpenses: 0,
          shortTermDebt: 9822000000,
          capitalLeaseObligationsCurrent: 0,
          taxPayables: 0,
          deferredRevenue: 8061000000,
          otherCurrentLiabilities: 58829000000,
          totalCurrentLiabilities: 139323000000,
          longTermDebt: 106550000000,
          deferredRevenueNonCurrent: 0,
          deferredTaxLiabilitiesNonCurrent: 0,
          otherNonCurrentLiabilities: 39441000000,
          totalNonCurrentLiabilities: 145991000000,
          otherLiabilities: 0,
          capitalLeaseObligations: 0,
          totalLiabilities: 285314000000,
          treasuryStock: 0,
          preferredStock: 0,
          commonStock: 73812000000,
          retainedEarnings: -6371000000,
          additionalPaidInCapital: 0,
          accumulatedOtherComprehensiveIncomeLoss: 0,
          otherTotalStockholdersEquity: 0,
          totalStockholdersEquity: 67441000000,
          totalEquity: 67441000000,
          minorityInterest: 0,
          totalLiabilitiesAndTotalEquity: 352755000000,
          totalInvestments: 132134000000,
          totalDebt: 116372000000,
          netDebt: 86407000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getBalanceSheetStatement('AAPL', {
        limit: 5,
        period: 'Q4'
      });

      expect(mockGet).toHaveBeenCalledWith('/balance-sheet-statement', {
        symbol: 'AAPL',
        limit: 5,
        period: 'Q4'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: BalanceSheetStatement[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getBalanceSheetStatement('MSFT');

      expect(mockGet).toHaveBeenCalledWith('/balance-sheet-statement', {
        symbol: 'MSFT'
      }, undefined);
    });
  });

  describe('getCashFlowStatement', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CashFlowStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          netIncome: 97829000000,
          depreciationAndAmortization: 11519000000,
          deferredIncomeTax: 0,
          stockBasedCompensation: 10833000000,
          changeInWorkingCapital: -1688000000,
          accountsReceivables: -1688000000,
          inventory: -1618000000,
          accountsPayables: 1889000000,
          otherWorkingCapital: -1271000000,
          otherNonCashItems: 0,
          netCashProvidedByOperatingActivities: 110563000000,
          investmentsInPropertyPlantAndEquipment: -10959000000,
          acquisitionsNet: -33000000,
          purchasesOfInvestments: -29513000000,
          salesMaturitiesOfInvestments: 39686000000,
          otherInvestingActivities: 1337000000,
          netCashProvidedByInvestingActivities: 518000000,
          netDebtIssuance: 0,
          longTermNetDebtIssuance: 0,
          shortTermNetDebtIssuance: 0,
          netStockIssuance: 0,
          netCommonStockIssuance: 0,
          commonStockIssuance: 0,
          commonStockRepurchased: -77550000000,
          netPreferredStockIssuance: 0,
          netDividendsPaid: -15025000000,
          commonDividendsPaid: -15025000000,
          preferredDividendsPaid: 0,
          otherFinancingActivities: 3037000000,
          netCashProvidedByFinancingActivities: -89538000000,
          effectOfForexChangesOnCash: 0,
          netChangeInCash: 21543000000,
          cashAtEndOfPeriod: 29965000000,
          cashAtBeginningOfPeriod: 8422000000,
          operatingCashFlow: 110563000000,
          capitalExpenditure: -10959000000,
          freeCashFlow: 99604000000,
          incomeTaxesPaid: 18679000000,
          interestPaid: 3933000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getCashFlowStatement('AAPL', {
        limit: 3,
        period: 'Q1'
      });

      expect(mockGet).toHaveBeenCalledWith('/cash-flow-statement', {
        symbol: 'AAPL',
        limit: 3,
        period: 'Q1'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getLatestFinancialStatements', () => {
    it('should call get with correct parameters', async () => {
      const mockData: LatestFinancialStatement[] = [
        {
          symbol: 'AAPL',
          calendarYear: 2023,
          period: 'FY',
          date: '2023-12-31',
          dateAdded: '2024-01-26'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getLatestFinancialStatements({
        page: 0,
        limit: 100
      });

      expect(mockGet).toHaveBeenCalledWith('/latest-financial-statements', {
        page: 0,
        limit: 100
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: LatestFinancialStatement[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getLatestFinancialStatements();

      expect(mockGet).toHaveBeenCalledWith('/latest-financial-statements', {}, undefined);
    });
  });

  describe('getKeyMetrics', () => {
    it('should call get with correct parameters', async () => {
      const mockData: KeyMetrics[] = [
        {
          symbol: 'AAPL',
          date: '2023-12-31',
          fiscalYear: '2023',
          period: 'FY',
          reportedCurrency: 'USD',
          marketCap: 3000000000000,
          enterpriseValue: 2950000000000,
          evToSales: 7.7,
          evToOperatingCashFlow: 26.7,
          evToFreeCashFlow: 29.6,
          evToEBITDA: 23.4,
          netDebtToEBITDA: 0.69,
          currentRatio: 1.03,
          incomeQuality: 1.13,
          grahamNumber: 0,
          grahamNetNet: 0,
          taxBurden: 0.85,
          interestBurden: 1.0,
          workingCapital: 4243000000,
          investedCapital: 183813000000,
          returnOnAssets: 0.277,
          operatingReturnOnAssets: 0.324,
          returnOnTangibleAssets: 0.277,
          returnOnEquity: 1.45,
          returnOnInvestedCapital: 0.532,
          returnOnCapitalEmployed: 0.532,
          earningsYield: 0.033,
          freeCashFlowYield: 0.033,
          capexToOperatingCashFlow: 0.099,
          capexToDepreciation: 0.951,
          capexToRevenue: 0.029,
          salesGeneralAndAdministrativeToRevenue: 0.065,
          researchAndDevelopementToRevenue: 0.078,
          stockBasedCompensationToRevenue: 0.028,
          intangiblesToTotalAssets: 0,
          averageReceivables: 28184000000,
          averagePayables: 64115000000,
          averageInventory: 6820000000,
          daysOfSalesOutstanding: 26.87,
          daysOfPayablesOutstanding: 109.15,
          daysOfInventoryOutstanding: 11.61,
          operatingCycle: 38.48,
          cashConversionCycle: -70.67,
          freeCashFlowToEquity: 99604000000,
          freeCashFlowToFirm: 99604000000,
          tangibleAssetValue: 67441000000,
          netCurrentAssetValue: 4243000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getKeyMetrics('AAPL', {
        limit: 10,
        period: 'annual'
      });

      expect(mockGet).toHaveBeenCalledWith('/key-metrics', {
        symbol: 'AAPL',
        limit: 10,
        period: 'annual'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: KeyMetrics[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getKeyMetrics('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/key-metrics', {
        symbol: 'AAPL'
      }, undefined);
    });
  });

  describe('getRatios', () => {
    it('should call get with correct parameters', async () => {
      const mockData: Ratios[] = [
        {
          symbol: 'AAPL',
          date: '2023-12-31',
          fiscalYear: '2023',
          period: 'FY',
          reportedCurrency: 'USD',
          grossProfitMargin: 0.441,
          ebitMargin: 0.298,
          ebitdaMargin: 0.328,
          operatingProfitMargin: 0.298,
          pretaxProfitMargin: 0.299,
          continuousOperationsProfitMargin: 0.255,
          netProfitMargin: 0.255,
          bottomLineProfitMargin: 0.255,
          receivablesTurnover: 13.6,
          payablesTurnover: 3.34,
          inventoryTurnover: 31.46,
          fixedAssetTurnover: 8.77,
          assetTurnover: 1.09,
          currentRatio: 1.03,
          quickRatio: 0.99,
          solvencyRatio: 0.191,
          cashRatio: 0.174,
          priceToEarningsRatio: 29.15,
          priceToEarningsGrowthRatio: 2.3,
          forwardPriceToEarningsGrowthRatio: 0,
          priceToBookRatio: 39.74,
          priceToSalesRatio: 7.42,
          priceToFreeCashFlowRatio: 28.6,
          priceToOperatingCashFlowRatio: 25.74,
          debtToAssetsRatio: 0.33,
          debtToEquityRatio: 1.73,
          debtToCapitalRatio: 0.63,
          longTermDebtToCapitalRatio: 0.61,
          financialLeverageRatio: 5.23,
          workingCapitalTurnoverRatio: 90.33,
          operatingCashFlowRatio: 0.794,
          operatingCashFlowSalesRatio: 0.288,
          freeCashFlowOperatingCashFlowRatio: 0.901,
          debtServiceCoverageRatio: 28.11,
          interestCoverageRatio: 29.06,
          shortTermOperatingCashFlowCoverageRatio: 0.794,
          operatingCashFlowCoverageRatio: 0.794,
          capitalExpenditureCoverageRatio: 10.09,
          dividendPaidAndCapexCoverageRatio: 4.31,
          dividendPayoutRatio: 0.154,
          dividendYield: 0.005,
          dividendYieldPercentage: 0.5,
          revenuePerShare: 24.03,
          netIncomePerShare: 6.13,
          interestDebtPerShare: 7.29,
          cashPerShare: 1.88,
          bookValuePerShare: 4.23,
          tangibleBookValuePerShare: 4.23,
          shareholdersEquityPerShare: 4.23,
          operatingCashFlowPerShare: 6.93,
          capexPerShare: 0.69,
          freeCashFlowPerShare: 6.24,
          netIncomePerEBT: 0.854,
          ebtPerEbit: 1.002,
          priceToFairValue: 1.0,
          debtToMarketCap: 0.041,
          effectiveTaxRate: 0.146,
          enterpriseValueMultiple: 25.8
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getRatios('AAPL', {
        limit: 5,
        period: 'quarter'
      });

      expect(mockGet).toHaveBeenCalledWith('/ratios', {
        symbol: 'AAPL',
        limit: 5,
        period: 'quarter'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getKeyMetricsTTM', () => {
    it('should call get with correct parameters', async () => {
      const mockData: KeyMetricsTTM[] = [
        {
          symbol: 'AAPL',
          marketCap: 3000000000000,
          enterpriseValueTTM: 2950000000000,
          evToSalesTTM: 7.7,
          evToOperatingCashFlowTTM: 26.7,
          evToFreeCashFlowTTM: 29.6,
          evToEBITDATTM: 23.4,
          netDebtToEBITDATTM: 0.69,
          currentRatioTTM: 1.03,
          incomeQualityTTM: 1.13,
          grahamNumberTTM: 0,
          grahamNetNetTTM: 0,
          taxBurdenTTM: 0.85,
          interestBurdenTTM: 1.0,
          workingCapitalTTM: 4243000000,
          investedCapitalTTM: 183813000000,
          returnOnAssetsTTM: 0.277,
          operatingReturnOnAssetsTTM: 0.324,
          returnOnTangibleAssetsTTM: 0.277,
          returnOnEquityTTM: 1.45,
          returnOnInvestedCapitalTTM: 0.532,
          returnOnCapitalEmployedTTM: 0.532,
          earningsYieldTTM: 0.033,
          freeCashFlowYieldTTM: 0.033,
          capexToOperatingCashFlowTTM: 0.099,
          capexToDepreciationTTM: 0.951,
          capexToRevenueTTM: 0.029,
          salesGeneralAndAdministrativeToRevenueTTM: 0.065,
          researchAndDevelopementToRevenueTTM: 0.078,
          stockBasedCompensationToRevenueTTM: 0.028,
          intangiblesToTotalAssetsTTM: 0,
          averageReceivablesTTM: 28184000000,
          averagePayablesTTM: 64115000000,
          averageInventoryTTM: 6820000000,
          daysOfSalesOutstandingTTM: 26.87,
          daysOfPayablesOutstandingTTM: 109.15,
          daysOfInventoryOutstandingTTM: 11.61,
          operatingCycleTTM: 38.48,
          cashConversionCycleTTM: -70.67,
          freeCashFlowToEquityTTM: 99604000000,
          freeCashFlowToFirmTTM: 99604000000,
          tangibleAssetValueTTM: 67441000000,
          netCurrentAssetValueTTM: 4243000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getKeyMetricsTTM('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/key-metrics-ttm', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialRatiosTTM', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialRatiosTTM[] = [
        {
          symbol: 'AAPL',
          date: '2023-12-31',
          fiscalYear: '2023',
          period: 'FY',
          reportedCurrency: 'USD',
          grossProfitMarginTTM: 0.441,
          ebitMarginTTM: 0.298,
          ebitdaMarginTTM: 0.328,
          operatingProfitMarginTTM: 0.298,
          pretaxProfitMarginTTM: 0.299,
          continuousOperationsProfitMarginTTM: 0.255,
          netProfitMarginTTM: 0.255,
          bottomLineProfitMarginTTM: 0.255,
          receivablesTurnoverTTM: 13.6,
          payablesTurnoverTTM: 3.34,
          inventoryTurnoverTTM: 31.46,
          fixedAssetTurnoverTTM: 8.77,
          assetTurnoverTTM: 1.09,
          currentRatioTTM: 1.03,
          quickRatioTTM: 0.99,
          solvencyRatioTTM: 0.191,
          cashRatioTTM: 0.174,
          priceToEarningsRatioTTM: 29.15,
          priceToEarningsGrowthRatioTTM: 2.3,
          forwardPriceToEarningsGrowthRatioTTM: 0,
          priceToBookRatioTTM: 39.74,
          priceToSalesRatioTTM: 7.42,
          priceToFreeCashFlowRatioTTM: 28.6,
          priceToOperatingCashFlowRatioTTM: 25.74,
          debtToAssetsRatioTTM: 0.33,
          debtToEquityRatioTTM: 1.73,
          debtToCapitalRatioTTM: 0.63,
          longTermDebtToCapitalRatioTTM: 0.61,
          financialLeverageRatioTTM: 5.23,
          workingCapitalTurnoverRatioTTM: 90.33,
          operatingCashFlowRatioTTM: 0.794,
          operatingCashFlowSalesRatioTTM: 0.288,
          freeCashFlowOperatingCashFlowRatioTTM: 0.901,
          debtServiceCoverageRatioTTM: 28.11,
          interestCoverageRatioTTM: 29.06,
          shortTermOperatingCashFlowCoverageRatioTTM: 0.794,
          operatingCashFlowCoverageRatioTTM: 0.794,
          capitalExpenditureCoverageRatioTTM: 10.09,
          dividendPaidAndCapexCoverageRatioTTM: 4.31,
          dividendPayoutRatioTTM: 0.154,
          dividendYieldTTM: 0.005,
          enterpriseValueTTM: 2950000000000,
          revenuePerShareTTM: 24.03,
          netIncomePerShareTTM: 6.13,
          interestDebtPerShareTTM: 7.29,
          cashPerShareTTM: 1.88,
          bookValuePerShareTTM: 4.23,
          tangibleBookValuePerShareTTM: 4.23,
          shareholdersEquityPerShareTTM: 4.23,
          operatingCashFlowPerShareTTM: 6.93,
          capexPerShareTTM: 0.69,
          freeCashFlowPerShareTTM: 6.24,
          netIncomePerEBTTTM: 0.854,
          ebtPerEbitTTM: 1.002,
          priceToFairValueTTM: 1.0,
          debtToMarketCapTTM: 0.041,
          effectiveTaxRateTTM: 0.146,
          enterpriseValueMultipleTTM: 25.8
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialRatiosTTM('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/ratios-ttm', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialScores', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialScores[] = [
        {
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          altmanZScore: 8.31,
          piotroskiScore: 6,
          workingCapital: 4243000000,
          totalAssets: 352755000000,
          retainedEarnings: -6371000000,
          ebit: 114301000000,
          marketCap: 3000000000000,
          totalLiabilities: 285314000000,
          revenue: 383285000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialScores('AAPL', {
        limit: 5
      });

      expect(mockGet).toHaveBeenCalledWith('/financial-scores', {
        symbol: 'AAPL',
        limit: 5
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: FinancialScores[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getFinancialScores('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/financial-scores', {
        symbol: 'AAPL'
      }, undefined);
    });
  });

  describe('getOwnerEarnings', () => {
    it('should call get with correct parameters', async () => {
      const mockData: OwnerEarnings[] = [
        {
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          fiscalYear: '2023',
          period: 'FY',
          date: '2023-12-31',
          averagePPE: 43715000000,
          maintenanceCapex: 5479500000,
          ownersEarnings: 105083500000,
          growthCapex: 5479500000,
          ownersEarningsPerShare: 6.59
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getOwnerEarnings('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/owner-earnings', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialReportsDates', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialReportDate[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'FY',
          linkXlsx: 'https://financialmodelingprep.com/financial-reports-xlsx/AAPL/2023/FY',
          linkJson: 'https://financialmodelingprep.com/financial-reports-json/AAPL/2023/FY'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialReportsDates('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/financial-reports-dates', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialReportJSON', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialReport10K[] = [
        {
          symbol: 'AAPL',
          period: 'FY',
          year: '2023'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialReportJSON('AAPL', 2023, 'FY');

      expect(mockGet).toHaveBeenCalledWith('/financial-reports-json', {
        symbol: 'AAPL',
        year: 2023,
        period: 'FY'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getRevenueProductSegmentation', () => {
    it('should call get with correct parameters', async () => {
      const mockData: RevenueProductSegmentation[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'annual',
          reportedCurrency: 'USD',
          date: '2023-12-31',
          data: {
            'iPhone': 200583000000,
            'Mac': 29357000000,
            'iPad': 28300000000,
            'Services': 85200000000
          }
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getRevenueProductSegmentation('AAPL', {
        period: 'annual',
        structure: 'flat'
      });

      expect(mockGet).toHaveBeenCalledWith('/revenue-product-segmentation', {
        symbol: 'AAPL',
        period: 'annual',
        structure: 'flat'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: RevenueProductSegmentation[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getRevenueProductSegmentation('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/revenue-product-segmentation', {
        symbol: 'AAPL'
      }, undefined);
    });
  });

  describe('getRevenueGeographicSegmentation', () => {
    it('should call get with correct parameters', async () => {
      const mockData: RevenueGeographicSegmentation[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'annual',
          reportedCurrency: 'USD',
          date: '2023-12-31',
          data: {
            'Americas': 162560000000,
            'Europe': 94294000000,
            'Greater China': 72559000000,
            'Japan': 24872000000,
            'Rest of Asia Pacific': 29000000000
          }
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getRevenueGeographicSegmentation('AAPL', {
        period: 'quarter'
      });

      expect(mockGet).toHaveBeenCalledWith('/revenue-geographic-segmentation', {
        symbol: 'AAPL',
        period: 'quarter'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getIncomeStatementAsReported', () => {
    it('should call get with correct parameters', async () => {
      const mockData: AsReportedIncomeStatement[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'annual',
          reportedCurrency: 'USD',
          date: '2023-12-31',
          data: {
            'Total net sales': 383285000000,
            'Cost of sales': 214137000000,
            'Gross margin': 169148000000
          }
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getIncomeStatementAsReported('AAPL', {
        limit: 10,
        period: 'annual'
      });

      expect(mockGet).toHaveBeenCalledWith('/income-statement-as-reported', {
        symbol: 'AAPL',
        limit: 10,
        period: 'annual'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new StatementsClient('my-api-key');
      expect(client).toBeInstanceOf(StatementsClient);
    });

    it('should create instance without API key', () => {
      const client = new StatementsClient();
      expect(client).toBeInstanceOf(StatementsClient);
    });
  });
}); 
