import Axios from "axios";
import { toast } from "react-toastify";

/**
 * @typedef Utils
 * @prop {boolean} toastError
 * @prop {boolean} toastSuccess
 */

// Simple in-memory cache for API responses
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute cache

export default class Request {
  static axiosInstance = Axios.create({
    // Shorter timeout for faster failure detection on slow networks
    timeout: 15000,
  });

  /**
   *
   * @param {string} url
   * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method
   * @param {import('axios').AxiosRequestConfig} config
   * @param {Utils} utils
   *
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async send(url, method = "GET", config = {}, utils = undefined) {
    // Check cache for GET requests
    if (method === "GET") {
      const cached = cache.get(url);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.response;
      }
    }

    const request = this.axiosInstance.request({
      url,
      method,
      ...config,
    });
    
    const response = await this.handleRequest(request, utils);
    
    // Cache successful GET responses
    if (method === "GET" && response) {
      cache.set(url, { response, timestamp: Date.now() });
    }
    
    return response;
  }

  /**
   * @param {Promise<AxiosResponse>} request
   * @param {Utils} utils
   * @return {Promise<AxiosResponse<any>>}
   */
  static async handleRequest(request, utils = undefined) {
    try {
      const response = await request;
      if (utils?.toastSuccess) toast.success(response.data.message);
      return response;
    } catch (e) {
      if (!e.response) {
        if (utils?.toastError) {
          // More helpful message for slow connection issues
          const message = e.code === 'ECONNABORTED' 
            ? "اتصال به سرور کند است. لطفا صبر کنید..."
            : "در اتصال به سرور خطایی رخ داده است.";
          toast.error(message);
        }
        return;
      }
      if (
        utils?.toastError &&
        (e.response?.data?.message || e.response?.data?.detail)
      ) {
        toast.error(e.response?.data?.message || e.response?.data?.detail);
      }
      console.error("Request error:", e);
      throw e;
    }
  }
}
