import axios from "axios";
import moment from "moment";
import { EKADASHI_CALENDAR_2025 } from "../data/ekadashiData";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpb2NpZ3JncHdkY2FhanJ4dnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODE0NDMsImV4cCI6MjA3MTc1NzQ0M30.3wL7Z4bUNkmAVPUE43gW97Bpq2bqYLW1i-KOaZQb3ko";

const BASE_URL = "https://panchang-api.herokuapp.com/api/v1";
const PANCHANG_API_URL =
  "https://giocigrgpwdcaajrxvrf.supabase.co/functions/v1/get-panchang";

export const getPanchangData = async (date = null) => {
  try {
    // Use new Supabase API endpoint
    const requestData = {
      latitude: 19.076,
      longitude: 72.8777,
    };

    // Add date if provided
    if (date) {
      requestData.date = date;
    }

    const response = await axios.post(PANCHANG_API_URL, requestData, {
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching panchang data:", error);
    // Return fallback data structure if API fails
    const fallbackDate = date ? moment(date) : moment();
    return {
      tithi: "Ekadashi",
      sunrise: "06:09",
      sunset: "18:30",
      moonrise: "12:00",
      moonset: "00:00",
      location: "Mumbai, India",
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
    // If API fails, use static data
    console.log("API unavailable, using static data for Ekadashi list");

    // Use static data for the requested year
    const ekadashiList = getEkadashiListFromStaticData(year);

    if (ekadashiList.length > 0) {
      return ekadashiList;
    }

    // If no data for requested year, throw error
    throw new Error(`No Ekadashi data available for year ${year}`);
  }
};

// Convert static Ekadashi data to API format
const getEkadashiListFromStaticData = (year) => {
  if (year === 2025) {
    return EKADASHI_CALENDAR_2025.map((ekadashi) => ({
      name: ekadashi.name,
      ekadashi_name: ekadashi.name,
      date: ekadashi.date.format("YYYY-MM-DD"),
      ekadashi_date: ekadashi.date.format("YYYY-MM-DD"),
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

    // If the API returns today's Ekadashi, find the next one after today
    if (ekadashiDate.isSame(today, "day")) {
      // Find the next Ekadashi after today
      const currentYear = moment().year();
      const ekadashiList = getEkadashiListFromStaticData(currentYear);
      const nextEkadashi = ekadashiList.find((e) => {
        const date = moment(e.date);
        return date.isAfter(today, "day");
      });

      if (nextEkadashi) {
        return nextEkadashi;
      }

      // Check next year
      const nextYearList = getEkadashiListFromStaticData(currentYear + 1);
      if (nextYearList.length > 0) {
        return nextYearList[0];
      }
    }

    return data;
  } catch (error) {
    // If API fails, calculate next Ekadashi from static data
    console.log("API unavailable, using static data for next Ekadashi");

    const currentYear = moment().year();
    const ekadashiList = getEkadashiListFromStaticData(currentYear);
    const today = moment();

    // Find next ekadashi AFTER today (exclude today)
    const nextEkadashi = ekadashiList.find((e) => {
      const ekadashiDate = moment(e.date);
      return ekadashiDate.isAfter(today, "day");
    });

    if (nextEkadashi) {
      return nextEkadashi;
    }

    // If none found in current year, check next year
    const nextYearList = getEkadashiListFromStaticData(currentYear + 1);
    if (nextYearList.length > 0) {
      return nextYearList[0];
    }

    // If still no ekadashi found, throw error
    throw new Error("No upcoming Ekadashi found");
  }
};

// Helper function to get today's Ekadashi if it exists
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
