import { FMPClient } from "../FMPClient.js";
import {
  LatestEarningTranscript,
  EarningTranscript,
  TranscriptDate,
  AvailableTranscriptSymbol,
  LatestTranscriptsParams,
  TranscriptParams,
  TranscriptDatesParams,
} from "./types.js";

export class EarningsTranscriptClient extends FMPClient {
  /**
   * Get latest earning transcripts with pagination
   */
  async getLatestTranscripts(
    params: LatestTranscriptsParams = {}
  ): Promise<LatestEarningTranscript[]> {
    return this.get<LatestEarningTranscript[]>(
      `/earning-call-transcript-latest`,
      {
        limit: params.limit,
        page: params.page,
      }
    );
  }

  /**
   * Get earning transcript for a specific company, year, and quarter
   */
  async getTranscript(params: TranscriptParams): Promise<EarningTranscript[]> {
    return this.get<EarningTranscript[]>(`/earning-call-transcript`, {
      symbol: params.symbol,
      year: params.year,
      quarter: params.quarter,
      limit: params.limit,
    });
  }

  /**
   * Get transcript dates for a specific company
   */
  async getTranscriptDates(
    params: TranscriptDatesParams
  ): Promise<TranscriptDate[]> {
    return this.get<TranscriptDate[]>(`/earning-call-transcript-dates`, {
      symbol: params.symbol,
    });
  }

  /**
   * Get list of available transcript symbols
   */
  async getAvailableTranscriptSymbols(): Promise<AvailableTranscriptSymbol[]> {
    return this.get<AvailableTranscriptSymbol[]>(`/earnings-transcript-list`);
  }
}
