import axios from "axios";
import moment from "moment";
import { ekadashiData2025 } from "../data/ekadashiData";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpb2NpZ3JncHdkY2FhanJ4dnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODE0NDMsImV4cCI6MjA3MTc1NzQ0M30.3wL7Z4bUNkmAVPUE43gW97Bpq2bqYLW1i-KOaZQb3ko";

const BASE_URL = "https://panchang-api.herokuapp.com/api/v1";
const PANCHANG_API_URL =
  "https://giocigrgpwdcaajrxvrf.supabase.co/functions/v1/get-panchang";

export const getPanchangData = async (date = null, location = null) => {
  try {
    const latitude = location?.latitude ?? 19.076;
    const longitude = location?.longitude ?? 72.8777;

    const requestData = {
      latitude,
      longitude,
    };

    if (date) {
      requestData.date = date;
    }

    const response = await axios.post(PANCHANG_API_URL, requestData, {
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      timeout: 10000, // 10 second timeout
    });

    if (response.data) {
      return response.data;
    }

    throw new Error("No data received from API");
  } catch (error) {
    console.error("Error fetching panchang data:", error);

    // Better fallback data matching web version format
    const fallbackDate = date ? moment(date) : moment();
    const locationStr =
      location?.latitude && location?.longitude
        ? `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`
        : "Mumbai, India";

    return {
      tithi: "Ekadashi",
      sunrise: "06:09",
      sunset: "18:30",
      moonrise: "12:00",
      moonset: "00:00",
      location: locationStr,
      nakshatra: "Rohini",
      yoga: "Vishkumbha",
      karana: "Bava",
      date: fallbackDate.format("DD MMMM YYYY"),
    };
  }
};

export const getEkadashiList = async (year) => {
  try {
    const response = await axios.get(`${BASE_URL}/ekadashi`, {
      params: {
        year: year,
      },
    });
    return response.data;
  } catch (error) {
    console.log("API unavailable, using static data for Ekadashi list");

    const ekadashiList = getEkadashiListFromStaticData(year);

    if (ekadashiList.length > 0) {
      return ekadashiList;
    }

    throw new Error(`No Ekadashi data available for year ${year}`);
  }
};

const getEkadashiListFromStaticData = (year) => {
  if (year === 2025) {
    return ekadashiData2025.map((ekadashi) => ({
      name: ekadashi.name,
      ekadashi_name: ekadashi.name,
      date: moment(ekadashi.date).format("YYYY-MM-DD"),
      ekadashi_date: moment(ekadashi.date).format("YYYY-MM-DD"),
      paksha: ekadashi.paksha,
      month: ekadashi.month,
      significance: ekadashi.significance,
      fastingRules: ekadashi.fastingRules,
      benefits: ekadashi.benefits,
      moonPhase: ekadashi.moonPhase,
      vrataKatha: ekadashi.vrataKatha,
    }));
  }
  return [];
};

export const getNextEkadashi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/next-ekadashi`);
    const data = response.data;
    const today = moment();
    const ekadashiDate = moment(data.date || data.ekadashi_date);

    if (ekadashiDate.isSame(today, "day")) {
      const currentYear = moment().year();
      const ekadashiList = getEkadashiListFromStaticData(currentYear);
      const nextEkadashi = ekadashiList.find((e) => {
        const date = moment(e.date);
        return date.isAfter(today, "day");
      });

      if (nextEkadashi) {
        return nextEkadashi;
      }

      const nextYearList = getEkadashiListFromStaticData(currentYear + 1);
      if (nextYearList.length > 0) {
        return nextYearList[0];
      }
    }

    return data;
  } catch (error) {
    console.log("API unavailable, using static data for next Ekadashi");

    const currentYear = moment().year();
    const ekadashiList = getEkadashiListFromStaticData(currentYear);
    const today = moment();

    const nextEkadashi = ekadashiList.find((e) => {
      const ekadashiDate = moment(e.date);
      return ekadashiDate.isAfter(today, "day");
    });

    if (nextEkadashi) {
      return nextEkadashi;
    }

    const nextYearList = getEkadashiListFromStaticData(currentYear + 1);
    if (nextYearList.length > 0) {
      return nextYearList[0];
    }

    throw new Error("No upcoming Ekadashi found");
  }
};

export const getTodayEkadashi = async () => {
  try {
    const currentYear = moment().year();
    const ekadashiList = getEkadashiListFromStaticData(currentYear);
    const today = moment();

    const todayEkadashi = ekadashiList.find((e) => {
      const ekadashiDate = moment(e.date);
      return ekadashiDate.isSame(today, "day");
    });

    return todayEkadashi || null;
  } catch (error) {
    console.error("Error fetching today's Ekadashi:", error);
    return null;
  }
};

export const getTithiDetails = async (date) => {
  try {
    const response = await axios.get(`${BASE_URL}/tithi`, {
      params: {
        date: date,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tithi details:", error);
    throw error;
  }
};
