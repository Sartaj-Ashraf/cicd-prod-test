import axios, { AxiosError, AxiosResponse } from "axios";
import { InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

const customFetch = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

customFetch.interceptors.response.use(
  (response:AxiosResponse) => response,

  async (error:AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }
    if (
      error.response?.status === 401 &&
      error.response?.data?.code ==="GENERATE_NEW_ACCESS_TOKEN"
    ) {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If refresh already in progress → queue requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(customFetch(originalRequest)),
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        await customFetch.post("/auth/refresh");

        processQueue(null);

        // Retry original request
        return customFetch(originalRequest);

      } catch (err) {
        processQueue(err);

     

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default customFetch;
