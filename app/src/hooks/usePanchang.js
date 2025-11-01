import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { getPanchangData } from "../services/api";

export const usePanchang = (date = null) => {
  const [panchangData, setPanchangData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPanchangData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use provided date or today's date in YYYY-MM-DD format
      const dateString = date
        ? moment(date).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      const data = await getPanchangData(dateString);
      // getPanchangData will return fallback data if API is unavailable
      // so we always have data here, no need to set error
      if (data) {
        setPanchangData(data);
      } else {
        setError("No panchang data available");
      }
    } catch (err) {
      // Only set error if it's not a handled API unavailability
      // (which would return fallback data instead of throwing)
      console.error("Error fetching panchang data:", err);
      setError("Failed to fetch Panchang data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchPanchangData();

    // Refresh data every hour
    const interval = setInterval(fetchPanchangData, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchPanchangData]);

  const refreshData = useCallback(() => {
    fetchPanchangData();
  }, [fetchPanchangData]);

  return { panchangData, loading, error, refreshData };
};
