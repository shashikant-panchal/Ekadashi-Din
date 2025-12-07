// Use dynamic festival calculations from utils
import { getFestivalsByMonth as getFestivalsByMonthUtil } from '../utils/hinduFestivals';

// Legacy static data for backward compatibility
export const festivalData2025 = [
    // This is now calculated dynamically, but kept for backward compatibility
];

export const getFestivalsByMonth = (month, year = null) => {
    const currentYear = year || new Date().getFullYear();
    const festivals = getFestivalsByMonthUtil(month, currentYear);
    
    // Transform to match expected format
    return festivals.map(f => ({
        name: f.name,
        date: f.date,
        deity: f.deity || '',
        type: f.type,
        description: f.description,
        color: f.color
    }));
};
