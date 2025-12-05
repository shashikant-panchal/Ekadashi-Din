import moment from 'moment';
import { useEffect, useState } from 'react';
import { getEkadashiList, getNextEkadashi } from '../services/api';

export const useNextEkadashi = () => {
  const [nextEkadashi, setNextEkadashi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNextEkadashi = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getNextEkadashi();
        setNextEkadashi(data);
      } catch (err) {
        console.error('Error fetching next ekadashi:', err);
        setError('Failed to fetch next Ekadashi. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNextEkadashi();

    const interval = setInterval(fetchNextEkadashi, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { nextEkadashi, loading, error };
};

export const useEkadashiList = (year = null) => {
  const [ekadashiList, setEkadashiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEkadashiList = async () => {
      setLoading(true);
      setError(null);

      try {
        const yearToFetch = year || moment().year();
        const data = await getEkadashiList(yearToFetch);

        const ekadashis = Array.isArray(data) ? data : (data.ekadashis || data.data || []);
        setEkadashiList(ekadashis);
      } catch (err) {
        console.error('Error fetching ekadashi list:', err);
        setError('Failed to fetch Ekadashi list. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEkadashiList();

    return () => { };
  }, [year]);

  return { ekadashiList, loading, error };
};

