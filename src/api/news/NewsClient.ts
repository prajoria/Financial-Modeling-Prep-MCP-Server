import { FMPClient } from "../FMPClient.js";
import {
  FMPArticle,
  NewsArticle,
  NewsParams,
  NewsSearchParams,
} from "./types.js";

export class NewsClient extends FMPClient {
  /**
   * Get articles from Financial Modeling Prep
   */
  async getFMPArticles(
    params: { page?: number; limit?: number } = {}
  ): Promise<FMPArticle[]> {
    return super.get<FMPArticle[]>("/fmp-articles", params);
  }

  /**
   * Get general news
   */
  async getGeneralNews(params: NewsParams = {}): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/general-latest", params);
  }

  /**
   * Get press releases
   */
  async getPressReleases(params: NewsParams = {}): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/press-releases-latest", params);
  }

  /**
   * Get stock news
   */
  async getStockNews(params: NewsParams = {}): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/stock-latest", params);
  }

  /**
   * Get crypto news
   */
  async getCryptoNews(params: NewsParams = {}): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/crypto-latest", params);
  }

  /**
   * Get forex news
   */
  async getForexNews(params: NewsParams = {}): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/forex-latest", params);
  }

  /**
   * Search press releases by symbols
   */
  async searchPressReleases(params: NewsSearchParams): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/press-releases", params);
  }

  /**
   * Search stock news by symbols
   */
  async searchStockNews(params: NewsSearchParams): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/stock", params);
  }

  /**
   * Search crypto news by symbols
   */
  async searchCryptoNews(params: NewsSearchParams): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/crypto", params);
  }

  /**
   * Search forex news by symbols
   */
  async searchForexNews(params: NewsSearchParams): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/forex", params);
  }
}
