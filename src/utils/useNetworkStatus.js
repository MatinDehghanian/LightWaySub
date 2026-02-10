import { useState, useEffect } from "react";

/**
 * Hook to detect slow/offline network conditions
 * Helps provide better UX for users with poor internet
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Handle online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check for slow connection using Network Information API
    if ("connection" in navigator) {
      const connection = navigator.connection;
      
      const checkConnection = () => {
        // Consider slow if effectiveType is 2g or slow-2g
        // or if downlink is less than 1 Mbps
        const isSlow =
          connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g" ||
          (connection.downlink && connection.downlink < 1);
        setIsSlowConnection(isSlow);
      };

      checkConnection();
      connection.addEventListener("change", checkConnection);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        connection.removeEventListener("change", checkConnection);
      };
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, isSlowConnection };
};

export default useNetworkStatus;
