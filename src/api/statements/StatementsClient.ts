import { FMPClient } from "../FMPClient.js";
import {
  IncomeStatement,
  BalanceSheetStatement,
  CashFlowStatement,
  IncomeStatementGrowth,
  BalanceSheetStatementGrowth,
  CashFlowStatementGrowth,
  FinancialStatementGrowth,
  FinancialReportDate,
  LatestFinancialStatement,
  Period,
  FinancialReport10K,
  RevenueProductSegmentation,
  RevenueGeographicSegmentation,
  AsReportedIncomeStatement,
  AsReportedBalanceSheet,
  AsReportedCashFlowStatement,
  AsReportedFinancialStatement,
} from "./types.js";

export class StatementsClient extends FMPClient {
  async getIncomeStatement(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<IncomeStatement[]> {
    return super.get<IncomeStatement[]>("/income-statement", {
      symbol,
      ...params,
    });
  }

  async getBalanceSheetStatement(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<BalanceSheetStatement[]> {
    return super.get<BalanceSheetStatement[]>("/balance-sheet-statement", {
      symbol,
      ...params,
    });
  }

  async getCashFlowStatement(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<CashFlowStatement[]> {
    return super.get<CashFlowStatement[]>("/cash-flow-statement", {
      symbol,
      ...params,
    });
  }

  async getLatestFinancialStatements(
    params: { page?: number; limit?: number } = {}
  ): Promise<LatestFinancialStatement[]> {
    return super.get<LatestFinancialStatement[]>(
      "/latest-financial-statements",
      params
    );
  }

  async getIncomeStatementTTM(
    symbol: string,
    params: { limit?: number } = {}
  ): Promise<IncomeStatement[]> {
    return super.get<IncomeStatement[]>("/income-statement-ttm", {
      symbol,
      ...params,
    });
  }

  async getBalanceSheetStatementTTM(
    symbol: string,
    params: { limit?: number } = {}
  ): Promise<BalanceSheetStatement[]> {
    return super.get<BalanceSheetStatement[]>("/balance-sheet-statement-ttm", {
      symbol,
      ...params,
    });
  }

  async getCashFlowStatementTTM(
    symbol: string,
    params: { limit?: number } = {}
  ): Promise<CashFlowStatement[]> {
    return super.get<CashFlowStatement[]>("/cash-flow-statement-ttm", {
      symbol,
      ...params,
    });
  }

  async getIncomeStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<IncomeStatementGrowth[]> {
    return super.get<IncomeStatementGrowth[]>("/income-statement-growth", {
      symbol,
      ...params,
    });
  }

  async getBalanceSheetStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<BalanceSheetStatementGrowth[]> {
    return super.get<BalanceSheetStatementGrowth[]>(
      "/balance-sheet-statement-growth",
      {
        symbol,
        ...params,
      }
    );
  }

  async getCashFlowStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<CashFlowStatementGrowth[]> {
    return super.get<CashFlowStatementGrowth[]>("/cash-flow-statement-growth", {
      symbol,
      ...params,
    });
  }

  async getFinancialStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<FinancialStatementGrowth[]> {
    return super.get<FinancialStatementGrowth[]>("/financial-growth", {
      symbol,
      ...params,
    });
  }

  async getFinancialReportsDates(
    symbol: string
  ): Promise<FinancialReportDate[]> {
    return super.get<FinancialReportDate[]>("/financial-reports-dates", {
      symbol,
    });
  }

  // Financial Reports Form 10-K JSON API
  async getFinancialReportJSON(
    symbol: string,
    year: number,
    period: Period
  ): Promise<FinancialReport10K[]> {
    return super.get<FinancialReport10K[]>("/financial-reports-json", {
      symbol,
      year,
      period,
    });
  }

  // Financial Reports Form 10-K XLSX API
  async getFinancialReportXLSX(
    symbol: string,
    year: number,
    period: Period
  ): Promise<any> {
    return super.get<any>("/financial-reports-xlsx", {
      symbol,
      year,
      period,
    });
  }

  // Revenue Product Segmentation API
  async getRevenueProductSegmentation(
    symbol: string,
    params: { period?: "annual" | "quarter"; structure?: "flat" } = {}
  ): Promise<RevenueProductSegmentation[]> {
    return super.get<RevenueProductSegmentation[]>(
      "/revenue-product-segmentation",
      {
        symbol,
        ...params,
      }
    );
  }

  // Revenue Geographic Segments API
  async getRevenueGeographicSegmentation(
    symbol: string,
    params: { period?: "annual" | "quarter"; structure?: "flat" } = {}
  ): Promise<RevenueGeographicSegmentation[]> {
    return super.get<RevenueGeographicSegmentation[]>(
      "/revenue-geographic-segmentation",
      {
        symbol,
        ...params,
      }
    );
  }

  // As Reported Income Statements API
  async getIncomeStatementAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {}
  ): Promise<AsReportedIncomeStatement[]> {
    return super.get<AsReportedIncomeStatement[]>(
      "/income-statement-as-reported",
      {
        symbol,
        ...params,
      }
    );
  }

  // As Reported Balance Statements API
  async getBalanceSheetStatementAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {}
  ): Promise<AsReportedBalanceSheet[]> {
    return super.get<AsReportedBalanceSheet[]>(
      "/balance-sheet-statement-as-reported",
      {
        symbol,
        ...params,
      }
    );
  }

  // As Reported Cashflow Statements API
  async getCashFlowStatementAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {}
  ): Promise<AsReportedCashFlowStatement[]> {
    return super.get<AsReportedCashFlowStatement[]>(
      "/cash-flow-statement-as-reported",
      {
        symbol,
        ...params,
      }
    );
  }

  // As Reported Financial Statements API
  async getFinancialStatementFullAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {}
  ): Promise<AsReportedFinancialStatement[]> {
    return super.get<AsReportedFinancialStatement[]>(
      "/financial-statement-full-as-reported",
      {
        symbol,
        ...params,
      }
    );
  }
}
