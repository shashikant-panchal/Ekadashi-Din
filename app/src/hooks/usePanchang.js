import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPanchangData } from "../services/api";

export const usePanchang = (date = null) => {
  const [panchangData, setPanchangData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useSelector((state) => state.location);

  const fetchPanchangData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dateString = date
        ? moment(date).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      const locationData = location?.latitude && location?.longitude
        ? { latitude: location.latitude, longitude: location.longitude }
        : null;

      const data = await getPanchangData(dateString, locationData);
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
  }, [date, location?.latitude, location?.longitude]);

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
