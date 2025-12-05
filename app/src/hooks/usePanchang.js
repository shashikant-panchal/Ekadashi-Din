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
      const dateString = date
        ? moment(date).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      const data = await getPanchangData(dateString);
      if (data) {
        setPanchangData(data);
      } else {
        setError("No panchang data available");
      }
    } catch (err) {
      console.error("Error fetching panchang data:", err);
      setError("Failed to fetch Panchang data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchPanchangData();

    const interval = setInterval(fetchPanchangData, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchPanchangData]);

  const refreshData = useCallback(() => {
    fetchPanchangData();
  }, [fetchPanchangData]);

  return { panchangData, loading, error, refreshData };
};
