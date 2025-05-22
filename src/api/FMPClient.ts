import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";

interface FMPErrorResponse {
  message: string;
  [key: string]: any;
}

export class FMPClient {
  private readonly apiKey: string;
  private readonly baseUrl: string = "https://financialmodelingprep.com/stable";
  private readonly client: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseUrl,
      params: {
        apikey: this.apiKey,
      },
    });
  }

  protected async get<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options?: { signal?: AbortSignal }
  ): Promise<T> {
    try {
      const config: AxiosRequestConfig = { params };
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
    options?: { signal?: AbortSignal }
  ): Promise<T> {
    try {
      const config: AxiosRequestConfig = { params };
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
