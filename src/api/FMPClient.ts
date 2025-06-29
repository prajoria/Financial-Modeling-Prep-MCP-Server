import axios, { type AxiosInstance, type AxiosError, type AxiosRequestConfig } from "axios";
import { DEFAULT_API_KEY } from "../constants/index.js";

interface FMPErrorResponse {
  message: string;
  [key: string]: any;
}

export class FMPClient {
  private readonly apiKey?: string;
  private readonly baseUrl: string = "https://financialmodelingprep.com/stable";
  private readonly client: AxiosInstance;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseUrl,
    });
  }

  // Get the API key from the context or the instance
  private getApiKey(context?: {
    config?: { FMP_ACCESS_TOKEN?: string };
  }): string {
    const configApiKey = context?.config?.FMP_ACCESS_TOKEN;

    if (configApiKey) {
      return configApiKey;
    }

    if (!this.apiKey || this.apiKey === DEFAULT_API_KEY) {
      throw new Error(
        "FMP_ACCESS_TOKEN is required for this operation. Please provide it in the configuration."
      );
    }

    return this.apiKey;
  }

  protected async get<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options?: {
      signal?: AbortSignal;
      context?: { config?: { FMP_ACCESS_TOKEN?: string } };
    }
  ): Promise<T> {
    try {
      // Try to get API key from context first, fall back to instance API key
      const apiKey = this.getApiKey(options?.context);

      const config: AxiosRequestConfig = {
        params: {
          ...params,
          apikey: apiKey,
        },
      };

      if (options?.signal) {
        config.signal = options.signal;
      }

      const response = await this.client.get<T>(endpoint, config);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<FMPErrorResponse>;
        throw new Error(
          `FMP API Error: ${
            axiosError.response?.data?.message || axiosError.message
          }`
        );
      }
      throw new Error(
        `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  protected async post<T>(
    endpoint: string,
    data: any,
    params: Record<string, any> = {},
    options?: {
      signal?: AbortSignal;
      context?: { config?: { FMP_ACCESS_TOKEN?: string } };
    }
  ): Promise<T> {
    try {
      // Try to get API key from context first, fall back to instance API key
      const apiKey = this.getApiKey(options?.context);

      const config: AxiosRequestConfig = {
        params: {
          ...params,
          apikey: apiKey,
        },
      };

      if (options?.signal) {
        config.signal = options.signal;
      }

      const response = await this.client.post<T>(endpoint, data, config);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<FMPErrorResponse>;
        throw new Error(
          `FMP API Error: ${
            axiosError.response?.data?.message || axiosError.message
          }`
        );
      }
      throw new Error(
        `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
