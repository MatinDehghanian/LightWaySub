import Request from "./Request";

/**
 * Helper to get initial data embedded in HTML by Jinja2 template
 * This provides instant data without network request
 */
const getInitialData = () => {
  if (typeof window !== 'undefined' && window.__INITIAL_DATA__) {
    return window.__INITIAL_DATA__;
  }
  return null;
};

export default class GetInfoRequest extends Request {
  /**
   * Get user info - first tries embedded data, then falls back to API
   */
  static async getInfo() {
    // First check for Jinja-embedded initial data (instant, no network)
    const initialData = getInitialData();
    if (initialData?.user) {
      // Return in same format as API response
      return {
        data: {
          ...initialData.user,
          links: initialData.links || [],
        },
      };
    }

    // Fall back to API request if no initial data
    const pathname = `${
      import.meta.env?.VITE_PANEL_DOMAIN || window.location.origin
    }${window.location.pathname.split("#")[0]}`;

    try {
      const response = await GetInfoRequest.send(
        `${pathname}/info`,
        "GET",
        {},
        {
          toastError: true,
        },
      );
      return response;
    } catch (error) {
      console.error("Error fetching info:", error);
      throw error;
    }
  }

  /**
   * Get configs/links - first tries embedded data, then falls back to API
   */
  static async getConfigs() {
    // First check for Jinja-embedded initial data
    const initialData = getInitialData();
    if (initialData?.links && initialData.links.length > 0) {
      // Return in same format as API response
      return {
        data: initialData.links.join("\n"),
      };
    }

    // Fall back to API request
    const pathname = `${
      import.meta.env?.VITE_PANEL_DOMAIN ?? window.location.origin
    }${window.location.pathname.split("#")[0]}`;

    try {
      const response = await GetInfoRequest.send(
        `${pathname}`,
        "GET",
        {},
        {
          toastError: true,
        },
      );
      return response;
    } catch (error) {
      console.error("Error fetching info:", error);
      throw error;
    }
  }
}
