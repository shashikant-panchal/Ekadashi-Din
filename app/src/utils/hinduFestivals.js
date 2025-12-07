// Hindu festival calculations - based on lunar calendar
// Matches web version implementation

import { getNewMoonsInYear, getFullMoonsInYear } from './lunarCalculations';

// Fixed solar festivals (same date every year)
const solarFestivals = [
    { name: "Makar Sankranti", month: 0, day: 14, description: "Sun enters Capricorn", type: "major", color: "#FF9800" },
    { name: "Pongal", month: 0, day: 14, description: "Tamil harvest festival", type: "regional", color: "#4CAF50" },
    { name: "Lohri", month: 0, day: 13, description: "Punjabi harvest festival", type: "regional", color: "#FF5722" },
    { name: "Vishu", month: 3, day: 14, description: "Kerala New Year", type: "regional", color: "#FFC107" },
    { name: "Tamil New Year", month: 3, day: 14, description: "Tamil New Year", type: "regional", color: "#9C27B0" },
];

// Lunar-based festival calculations
const lunarFestivalRules = [
    // Vasant Panchami - 5th day of Shukla Paksha in Magha (Jan-Feb)
    { name: "Vasant Panchami", basedOn: 'new', offset: 4, monthRange: [0, 1], description: "Festival of Saraswati", type: "major", deity: "Saraswati", color: "#FFEB3B" },
    
    // Maha Shivaratri - 14th day of Krishna Paksha in Phalguna (Feb-Mar)
    { name: "Maha Shivaratri", basedOn: 'full', offset: 13, monthRange: [1, 2], description: "Night of Lord Shiva", type: "major", deity: "Shiva", color: "#607D8B" },
    
    // Holika Dahan - day before full moon in Phalguna (Feb-Mar)
    { name: "Holika Dahan", basedOn: 'new', offset: 13, monthRange: [1, 2], description: "Burning of Holika", type: "major", color: "#FF5722" },
    
    // Holi - Full moon day of Phalguna (Feb-Mar)
    { name: "Holi", basedOn: 'new', offset: 14, monthRange: [1, 2], description: "Festival of Colors", type: "major", color: "#E91E63" },
    
    // Ugadi/Gudi Padwa - First day of Chaitra (Mar-Apr)
    { name: "Ugadi / Gudi Padwa", basedOn: 'new', offset: 0, monthRange: [2, 3], description: "Telugu/Marathi New Year", type: "regional", color: "#9C27B0" },
    
    // Ram Navami - 9th day of Shukla Paksha in Chaitra (Mar-Apr)
    { name: "Ram Navami", basedOn: 'new', offset: 8, monthRange: [2, 3], description: "Birth of Lord Rama", type: "major", deity: "Rama", color: "#2196F3" },
    
    // Hanuman Jayanti - Full moon of Chaitra (Mar-Apr)
    { name: "Hanuman Jayanti", basedOn: 'new', offset: 14, monthRange: [3, 4], description: "Birth of Lord Hanuman", type: "major", deity: "Hanuman", color: "#FF5722" },
    
    // Akshaya Tritiya - 3rd day of Shukla Paksha in Vaishakha (Apr-May)
    { name: "Akshaya Tritiya", basedOn: 'new', offset: 2, monthRange: [3, 4], description: "Day of eternal prosperity", type: "major", color: "#FFD700" },
    
    // Buddha Purnima - Full moon of Vaishakha (Apr-May)
    { name: "Buddha Purnima", basedOn: 'new', offset: 14, monthRange: [4, 5], description: "Birth of Lord Buddha", type: "major", color: "#9E9E9E" },
    
    // Guru Purnima - Full moon of Ashadha (Jun-Jul)
    { name: "Guru Purnima", basedOn: 'new', offset: 14, monthRange: [6, 7], description: "Day to honor gurus", type: "major", color: "#9C27B0" },
    
    // Raksha Bandhan - Full moon of Shravana (Jul-Aug)
    { name: "Raksha Bandhan", basedOn: 'new', offset: 14, monthRange: [7, 8], description: "Bond between siblings", type: "major", color: "#E91E63" },
    
    // Krishna Janmashtami - 8th day of Krishna Paksha in Bhadrapada (Aug-Sep)
    { name: "Krishna Janmashtami", basedOn: 'full', offset: 7, monthRange: [7, 8], description: "Birth of Lord Krishna", type: "major", deity: "Krishna", color: "#3F51B5" },
    
    // Ganesh Chaturthi - 4th day of Shukla Paksha in Bhadrapada (Aug-Sep)
    { name: "Ganesh Chaturthi", basedOn: 'new', offset: 3, monthRange: [7, 8], description: "Birth of Lord Ganesha", type: "major", deity: "Ganesha", color: "#FF5722" },
    
    // Onam - Based on Malayalam calendar, roughly Aug-Sep
    { name: "Onam", basedOn: 'new', offset: 11, monthRange: [7, 8], description: "Kerala harvest festival", type: "regional", color: "#FFEB3B" },
    
    // Navratri - First 9 days of Shukla Paksha in Ashwin (Sep-Oct)
    { name: "Navratri Begins", basedOn: 'new', offset: 0, monthRange: [8, 9], description: "Nine nights of Durga", type: "major", deity: "Durga", color: "#E91E63" },
    
    // Dussehra - 10th day of Shukla Paksha in Ashwin (Sep-Oct)
    { name: "Dussehra / Vijayadashami", basedOn: 'new', offset: 9, monthRange: [8, 9], description: "Victory of good over evil", type: "major", deity: "Durga", color: "#F44336" },
    
    // Karwa Chauth - 4th day of Krishna Paksha in Kartik (Oct-Nov)
    { name: "Karwa Chauth", basedOn: 'full', offset: 3, monthRange: [9, 10], description: "Fast for spouse's longevity", type: "minor", color: "#E91E63" },
    
    // Dhanteras - 13th day of Krishna Paksha in Kartik (Oct-Nov)
    { name: "Dhanteras", basedOn: 'new', offset: -2, monthRange: [9, 10], description: "First day of Diwali", type: "major", deity: "Lakshmi", color: "#FFD700" },
    
    // Narak Chaturdashi - 14th day of Krishna Paksha in Kartik (Oct-Nov)
    { name: "Narak Chaturdashi", basedOn: 'new', offset: -1, monthRange: [9, 10], description: "Day before Diwali", type: "major", deity: "Krishna", color: "#FF5722" },
    
    // Diwali - Amavasya of Kartik (Oct-Nov)
    { name: "Diwali", basedOn: 'new', offset: 0, monthRange: [9, 10], description: "Festival of Lights", type: "major", deity: "Lakshmi", color: "#FFD700" },
    
    // Govardhan Puja - Day after Diwali
    { name: "Govardhan Puja", basedOn: 'new', offset: 1, monthRange: [9, 10], description: "Worship of Govardhan Hill", type: "major", deity: "Krishna", color: "#4CAF50" },
    
    // Bhai Dooj - 2 days after Diwali
    { name: "Bhai Dooj", basedOn: 'new', offset: 2, monthRange: [9, 10], description: "Brother-sister celebration", type: "major", color: "#9C27B0" },
    
    // Chhath Puja - 6 days after Diwali
    { name: "Chhath Puja", basedOn: 'new', offset: 6, monthRange: [10, 11], description: "Worship of Sun God", type: "regional", deity: "Surya", color: "#FF9800" },
    
    // Gita Jayanti - 11th day of Shukla Paksha in Margashirsha (Nov-Dec)
    { name: "Gita Jayanti", basedOn: 'new', offset: 10, monthRange: [10, 11], description: "Day Bhagavad Gita was revealed", type: "major", deity: "Krishna", color: "#FF9800" },
];

export function calculateFestivalsForYear(year) {
    const festivals = [];
    
    // Add solar festivals
    solarFestivals.forEach(f => {
        festivals.push({
            name: f.name,
            date: new Date(year, f.month, f.day),
            description: f.description,
            type: f.type,
            deity: f.deity,
            color: f.color
        });
    });
    
    // Calculate lunar festivals
    const newMoons = getNewMoonsInYear(year);
    const fullMoons = getFullMoonsInYear(year);
    
    // Add previous year's Dec moons for early year calculations
    const prevNewMoons = getNewMoonsInYear(year - 1).filter(d => d.getMonth() >= 10);
    const prevFullMoons = getFullMoonsInYear(year - 1).filter(d => d.getMonth() >= 10);
    
    const allNewMoons = [...prevNewMoons, ...newMoons];
    const allFullMoons = [...prevFullMoons, ...fullMoons];
    
    lunarFestivalRules.forEach(rule => {
        const baseMoons = rule.basedOn === 'new' ? allNewMoons : allFullMoons;
        
        baseMoons.forEach(moon => {
            // Check if this moon falls in the expected month range for this festival
            const moonMonth = moon.getMonth();
            if (moonMonth < rule.monthRange[0] || moonMonth > rule.monthRange[1]) return;
            
            const festivalDate = new Date(moon);
            festivalDate.setDate(festivalDate.getDate() + rule.offset);
            
            // Only include if in target year
            if (festivalDate.getFullYear() !== year) return;
            
            // Check for duplicates
            const exists = festivals.some(f => 
                f.name === rule.name && 
                f.date.getMonth() === festivalDate.getMonth()
            );
            
            if (!exists) {
                festivals.push({
                    name: rule.name,
                    date: festivalDate,
                    description: rule.description,
                    type: rule.type,
                    deity: rule.deity,
                    color: rule.color
                });
            }
        });
    });
    
    // Sort by date
    festivals.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return festivals;
}

export function getFestivalsByMonth(month, year) {
    const allFestivals = calculateFestivalsForYear(year);
    return allFestivals.filter(f => f.date.getMonth() === month);
}

export function isFestivalDay(day, month, year) {
    const festivals = getFestivalsByMonth(month, year);
    return festivals.find(f => f.date.getDate() === day);
}

export function getFestivalsOnDate(day, month, year) {
    const festivals = getFestivalsByMonth(month, year);
    return festivals.filter(f => f.date.getDate() === day);
}

